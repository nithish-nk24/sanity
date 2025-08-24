import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { cspMiddleware, DEFAULT_CSP_CONFIG } from './csp';
import { csrfProtection, DEFAULT_CSRF_CONFIG } from './csrf-protection';

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
  statusCode: number;
  headers: boolean;
}

export const DEFAULT_RATE_LIMITS = {
  // General API endpoints
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP, please try again later.',
    statusCode: 429,
    headers: true
  },
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later.',
    statusCode: 429,
    headers: true
  },
  // Blog creation/editing
  blog: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Too many blog operations, please try again later.',
    statusCode: 429,
    headers: true
  },
  // File uploads
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
    message: 'Too many file uploads, please try again later.',
    statusCode: 429,
    headers: true
  }
} as const;

// In-memory rate limiting store (use Redis in production)
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const record = this.store.get(key);
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      const newRecord = { count: 1, resetTime: now + windowMs };
      this.store.set(key, newRecord);
      return newRecord;
    }
    
    // Increment existing record
    record.count++;
    return record;
  }

  get(key: string): { count: number; resetTime: number } | undefined {
    return this.store.get(key);
  }

  // Clean up expired records
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

const rateLimitStore = new RateLimitStore();

// Clean up expired records every 5 minutes
setInterval(() => rateLimitStore.cleanup(), 5 * 60 * 1000);

// Rate limiting middleware
export function rateLimit(
  config: RateLimitConfig,
  identifier?: (req: NextRequest) => string
) {
  return async function rateLimitMiddleware(req: NextRequest) {
    const key = identifier ? identifier(req) : getClientIdentifier(req);
    const record = rateLimitStore.increment(key, config.windowMs);
    
    if (record.count > config.maxRequests) {
      const response = NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: config.message,
          retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000)
        },
        { status: config.statusCode }
      );
      
      if (config.headers) {
        response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', '0');
        response.headers.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
        response.headers.set('Retry-After', Math.ceil((record.resetTime - Date.now()) / 1000).toString());
      }
      
      return response;
    }
    
    return null; // Continue to next middleware
  };
}

// Get client identifier (IP address or user ID)
function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded || realIp || req.ip || 'unknown';
  
  // If user is authenticated, use user ID for more precise rate limiting
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In a real app, you'd decode the JWT to get user ID
    // For now, we'll use a hash of the token
    return `user_${hashString(authHeader)}`;
  }
  
  return `ip_${ip}`;
}

// Simple string hashing function
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Security headers middleware
export function securityHeaders() {
  return function securityHeadersMiddleware(req: NextRequest) {
    const response = NextResponse.next();
    
    // Basic security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // HTTPS enforcement in production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    
    return response;
  };
}

// Request validation middleware
export function validateRequest(validationRules: Record<string, any>) {
  return function validationMiddleware(req: NextRequest) {
    try {
      const body = req.body ? JSON.parse(req.body as any) : {};
      const query = Object.fromEntries(req.nextUrl.searchParams);
      const headers = Object.fromEntries(req.headers.entries());
      
      const errors: string[] = [];
      
      // Validate required fields
      for (const [field, rules] of Object.entries(validationRules)) {
        const value = body[field] || query[field] || headers[field];
        
        if (rules.required && !value) {
          errors.push(`${field} is required`);
          continue;
        }
        
        if (value && rules.type) {
          if (typeof value !== rules.type) {
            errors.push(`${field} must be of type ${rules.type}`);
          }
        }
        
        if (value && rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters long`);
        }
        
        if (value && rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be no more than ${rules.maxLength} characters long`);
        }
        
        if (value && rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
        
        if (value && rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
      }
      
      if (errors.length > 0) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            message: 'Request validation failed',
            details: errors
          },
          { status: 400 }
        );
      }
      
      return null; // Continue to next middleware
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          message: 'Request body is not valid JSON'
        },
        { status: 400 }
      );
    }
  };
}

// Error handling middleware
export function errorHandler(error: Error, req: NextRequest) {
  console.error('API Error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
  
  // In development, show more details
  return NextResponse.json(
    { 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    { status: 500 }
  );
}

// CORS middleware
export function corsMiddleware() {
  return function corsMiddleware(req: NextRequest) {
    const response = NextResponse.next();
    
    const origin = req.headers.get('origin');
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.NEXT_PUBLIC_SITE_URL
    ].filter(Boolean);
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
    
    return response;
  };
}

// Request logging middleware
export function requestLogger() {
  return function loggingMiddleware(req: NextRequest) {
    const start = Date.now();
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Started`);
    
    // Override response to log completion
    const originalResponse = NextResponse.next();
    const response = new NextResponse(originalResponse.body, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers: originalResponse.headers
    });
    
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Completed in ${duration}ms - Status: ${response.status}`);
    
    return response;
  };
}

// Combine all security middleware
export function applySecurityMiddleware(
  req: NextRequest,
  options: {
    rateLimit?: RateLimitConfig;
    validation?: Record<string, any>;
    enableLogging?: boolean;
    enableCSP?: boolean;
    enableCSRF?: boolean;
    cspConfig?: any;
    csrfConfig?: any;
  } = {}
) {
  const middlewares: (() => NextResponse | null)[] = [];
  
  // Apply security headers
  middlewares.push(securityHeaders());
  
  // Apply CORS
  middlewares.push(corsMiddleware());
  
  // Apply CSP if enabled
  if (options.enableCSP !== false) {
    middlewares.push(cspMiddleware(options.cspConfig || DEFAULT_CSP_CONFIG));
  }
  
  // Apply CSRF protection if enabled
  if (options.enableCSRF !== false) {
    middlewares.push(csrfProtection(options.csrfConfig || DEFAULT_CSRF_CONFIG));
  }
  
  // Apply rate limiting if specified
  if (options.rateLimit) {
    middlewares.push(rateLimit(options.rateLimit));
  }
  
  // Apply request validation if specified
  if (options.validation) {
    middlewares.push(validateRequest(options.validation));
  }
  
  // Apply request logging if enabled
  if (options.enableLogging) {
    middlewares.push(requestLogger());
  }
  
  // Execute middleware chain
  for (const middleware of middlewares) {
    const result = middleware();
    if (result) {
      return result; // Middleware returned a response, stop execution
    }
  }
  
  return null; // Continue to route handler
}
