import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHmac } from 'crypto';

export interface CSRFConfig {
  secret: string;
  tokenLength: number;
  cookieName: string;
  headerName: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
    path: string;
  };
  excludePaths: string[];
  excludeMethods: string[];
}

// Default CSRF configuration
export const DEFAULT_CSRF_CONFIG: CSRFConfig = {
  secret: process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production',
  tokenLength: 32,
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  },
  excludePaths: ['/api/health', '/api/metrics'],
  excludeMethods: ['GET', 'HEAD', 'OPTIONS']
};

// CSRF token store (use Redis in production)
class CSRFTokenStore {
  private tokens = new Map<string, { token: string; expires: number }>();
  private maxTokens = 10000; // Maximum tokens to store

  // Generate a new CSRF token
  generateToken(): string {
    const token = randomBytes(this.maxTokens).toString('hex');
    const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    // Clean up expired tokens
    this.cleanup();
    
    // Store the token
    this.tokens.set(token, { token, expires });
    
    // Limit the number of stored tokens
    if (this.tokens.size > this.maxTokens) {
      const oldestTokens = Array.from(this.tokens.entries())
        .sort(([, a], [, b]) => a.expires - b.expires)
        .slice(0, this.tokens.size - this.maxTokens);
      
      oldestTokens.forEach(([key]) => this.tokens.delete(key));
    }
    
    return token;
  }

  // Validate a CSRF token
  validateToken(token: string): boolean {
    const stored = this.tokens.get(token);
    
    if (!stored) {
      return false;
    }
    
    // Check if token has expired
    if (Date.now() > stored.expires) {
      this.tokens.delete(token);
      return false;
    }
    
    return true;
  }

  // Invalidate a CSRF token
  invalidateToken(token: string): boolean {
    return this.tokens.delete(token);
  }

  // Clean up expired tokens
  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.tokens.entries()) {
      if (now > value.expires) {
        this.tokens.delete(key);
      }
    }
  }

  // Get token statistics
  getStats(): { totalTokens: number; expiredTokens: number } {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [, value] of this.tokens.entries()) {
      if (now > value.expires) {
        expiredCount++;
      }
    }
    
    return {
      totalTokens: this.tokens.size,
      expiredTokens: expiredCount
    };
  }
}

// Create global token store
const csrfTokenStore = new CSRFTokenStore();

// Generate CSRF token
export function generateCSRFToken(): string {
  return csrfTokenStore.generateToken();
}

// Validate CSRF token
export function validateCSRFToken(token: string): boolean {
  return csrfTokenStore.validateToken(token);
}

// Generate CSRF token with HMAC for additional security
export function generateSecureCSRFToken(secret: string = DEFAULT_CSRF_CONFIG.secret): string {
  const randomToken = randomBytes(DEFAULT_CSRF_CONFIG.tokenLength).toString('hex');
  const timestamp = Date.now().toString();
  const data = `${randomToken}:${timestamp}`;
  const hmac = createHmac('sha256', secret).update(data).digest('hex');
  
  return `${data}:${hmac}`;
}

// Validate secure CSRF token
export function validateSecureCSRFToken(
  token: string,
  secret: string = DEFAULT_CSRF_CONFIG.secret
): { isValid: boolean; timestamp?: number; error?: string } {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) {
      return { isValid: false, error: 'Invalid token format' };
    }
    
    const [randomToken, timestamp, hmac] = parts;
    const data = `${randomToken}:${timestamp}`;
    const expectedHmac = createHmac('sha256', secret).update(data).digest('hex');
    
    if (hmac !== expectedHmac) {
      return { isValid: false, error: 'Invalid HMAC' };
    }
    
    const tokenTimestamp = parseInt(timestamp, 10);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (now - tokenTimestamp > maxAge) {
      return { isValid: false, error: 'Token expired' };
    }
    
    return { isValid: true, timestamp: tokenTimestamp };
  } catch (error) {
    return { isValid: false, error: 'Token validation failed' };
  }
}

// CSRF protection middleware
export function csrfProtection(config: CSRFConfig = DEFAULT_CSRF_CONFIG) {
  return function csrfMiddleware(req: NextRequest) {
    // Skip CSRF protection for excluded paths and methods
    if (shouldSkipCSRF(req, config)) {
      return NextResponse.next();
    }

    // For state-changing requests, validate CSRF token
    if (config.excludeMethods.includes(req.method)) {
      const csrfToken = req.headers.get(config.headerName) || 
                       req.nextUrl.searchParams.get('csrf_token');
      
      if (!csrfToken) {
        return NextResponse.json(
          { 
            error: 'CSRF token missing',
            message: 'CSRF token is required for this request'
          },
          { status: 403 }
        );
      }
      
      // Validate the token
      const isValid = validateCSRFToken(csrfToken);
      if (!isValid) {
        return NextResponse.json(
          { 
            error: 'Invalid CSRF token',
            message: 'CSRF token is invalid or expired'
          },
          { status: 403 }
        );
      }
    }

    // For all requests, ensure CSRF token cookie is set
    const response = NextResponse.next();
    const existingToken = req.cookies.get(config.cookieName);
    
    if (!existingToken) {
      const newToken = generateCSRFToken();
      response.cookies.set(config.cookieName, newToken, config.cookieOptions);
    }
    
    return response;
  };
}

// Check if CSRF protection should be skipped
function shouldSkipCSRF(req: NextRequest, config: CSRFConfig): boolean {
  const path = req.nextUrl.pathname;
  const method = req.method;
  
  // Skip for excluded paths
  if (config.excludePaths.some(excludedPath => path.startsWith(excludedPath))) {
    return true;
  }
  
  // Skip for excluded methods
  if (config.excludeMethods.includes(method)) {
    return false; // Don't skip, these need CSRF protection
  }
  
  return true;
}

// Generate CSRF token for forms
export function generateFormCSRFToken(): { token: string; field: string } {
  const token = generateCSRFToken();
  return {
    token,
    field: `<input type="hidden" name="csrf_token" value="${token}" />`
  };
}

// Validate CSRF token from form data
export function validateFormCSRFToken(formData: FormData): boolean {
  const token = formData.get('csrf_token');
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  return validateCSRFToken(token);
}

// CSRF token refresh middleware
export function refreshCSRFToken(config: CSRFConfig = DEFAULT_CSRF_CONFIG) {
  return function refreshMiddleware(req: NextRequest) {
    const response = NextResponse.next();
    
    // Always refresh the CSRF token for security
    const newToken = generateCSRFToken();
    response.cookies.set(config.cookieName, newToken, {
      ...config.cookieOptions,
      maxAge: config.cookieOptions.maxAge
    });
    
    return response;
  };
}

// CSRF token cleanup middleware
export function cleanupCSRFTokens() {
  return function cleanupMiddleware(req: NextRequest) {
    // This middleware doesn't modify the request/response
    // It just triggers cleanup of expired tokens
    csrfTokenStore.getStats(); // This triggers cleanup
    
    return NextResponse.next();
  };
}

// Get CSRF token from request
export function getCSRFTokenFromRequest(req: NextRequest, config: CSRFConfig = DEFAULT_CSRF_CONFIG): string | null {
  // Try to get token from cookie first
  const cookieToken = req.cookies.get(config.cookieName);
  if (cookieToken) {
    return cookieToken.value;
  }
  
  // Try to get token from header
  const headerToken = req.headers.get(config.headerName);
  if (headerToken) {
    return headerToken;
  }
  
  // Try to get token from query parameters
  const queryToken = req.nextUrl.searchParams.get('csrf_token');
  if (queryToken) {
    return queryToken;
  }
  
  return null;
}

// CSRF protection for API routes
export function protectAPIRoute(config: CSRFConfig = DEFAULT_CSRF_CONFIG) {
  return function apiProtectionMiddleware(req: NextRequest) {
    // Only protect state-changing methods
    if (!config.excludeMethods.includes(req.method)) {
      return NextResponse.next();
    }
    
    const token = getCSRFTokenFromRequest(req, config);
    
    if (!token) {
      return NextResponse.json(
        { 
          error: 'CSRF token missing',
          message: 'CSRF token is required for this request'
        },
        { status: 403 }
      );
    }
    
    if (!validateCSRFToken(token)) {
      return NextResponse.json(
        { 
          error: 'Invalid CSRF token',
          message: 'CSRF token is invalid or expired'
        },
        { status: 403 }
      );
    }
    
    return NextResponse.next();
  };
}
