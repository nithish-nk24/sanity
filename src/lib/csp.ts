import { NextRequest, NextResponse } from 'next/server';

export interface CSPConfig {
  mode: 'development' | 'production' | 'strict';
  enableNonce?: boolean;
  reportOnly?: boolean;
  reportUri?: string;
}

// Default CSP configuration
export const DEFAULT_CSP_CONFIG: CSPConfig = {
  mode: 'production',
  enableNonce: true,
  reportOnly: false
};

// CSP directives for different modes
const CSP_DIRECTIVES = {
  development: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Required for Next.js development
      "'unsafe-inline'", // Required for Next.js development
      "http://localhost:*",
      "https://localhost:*"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS
      "http://localhost:*",
      "https://localhost:*",
      "https://fonts.googleapis.com"
    ],
    'font-src': [
      "'self'",
      "data:",
      "http://localhost:*",
      "https://localhost:*",
      "https://fonts.gstatic.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "blob:",
      "http://localhost:*",
      "https://localhost:*",
      "https:",
      "https://images.unsplash.com",
      "https://utfs.io"
    ],
    'connect-src': [
      "'self'",
      "http://localhost:*",
      "https://localhost:*",
      "https:",
      "wss:",
      "ws:"
    ],
    'frame-src': [
      "'self'",
      "http://localhost:*",
      "https://localhost:*"
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'upgrade-insecure-requests': []
  },
  
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for some UI components
      "https://cdn.jsdelivr.net",
      "https://unpkg.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS
      "https://fonts.googleapis.com",
      "https://cdn.jsdelivr.net"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com",
      "https://cdn.jsdelivr.net"
    ],
    'img-src': [
      "'self'",
      "data:",
      "blob:",
      "https:",
      "https://images.unsplash.com",
      "https://utfs.io",
      "https://cdn.jsdelivr.net"
    ],
    'connect-src': [
      "'self'",
      "https:",
      "wss:"
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'upgrade-insecure-requests': [],
    'worker-src': ["'self'", "blob:"],
    'media-src': ["'self'", "https:"],
    'manifest-src': ["'self'"]
  },
  
  strict: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'font-src': ["'self'"],
    'img-src': ["'self'", "data:"],
    'connect-src': ["'self'"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'upgrade-insecure-requests': [],
    'worker-src': ["'self'"],
    'media-src': ["'self'"],
    'manifest-src': ["'self'"]
  }
} as const;

// Generate CSP header value
export function generateCSPHeader(config: CSPConfig = DEFAULT_CSP_CONFIG): string {
  const directives = CSP_DIRECTIVES[config.mode];
  const cspParts: string[] = [];
  
  for (const [directive, sources] of Object.entries(directives)) {
    if (sources.length > 0) {
      cspParts.push(`${directive} ${sources.join(' ')}`);
    }
  }
  
  // Add nonce support if enabled
  if (config.enableNonce) {
    cspParts.push("'nonce-${nonce}'");
  }
  
  // Add report-uri if specified
  if (config.reportUri) {
    cspParts.push(`report-uri ${config.reportUri}`);
  }
  
  return cspParts.join('; ');
}

// Apply CSP headers to response
export function applyCSPHeaders(
  response: NextResponse,
  config: CSPConfig = DEFAULT_CSP_CONFIG
): NextResponse {
  const cspValue = generateCSPHeader(config);
  
  if (config.reportOnly) {
    response.headers.set('Content-Security-Policy-Report-Only', cspValue);
  } else {
    response.headers.set('Content-Security-Policy', cspValue);
  }
  
  return response;
}

// Generate nonce for inline scripts
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Validate CSP configuration
export function validateCSPConfig(config: CSPConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!['development', 'production', 'strict'].includes(config.mode)) {
    errors.push('Invalid CSP mode. Must be development, production, or strict');
  }
  
  if (config.reportUri && !config.reportUri.startsWith('https://')) {
    errors.push('Report URI must use HTTPS in production');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// CSP violation handler
export function handleCSPViolation(violation: any): void {
  console.warn('CSP Violation:', {
    documentUri: violation.documentUri,
    violatedDirective: violation.violatedDirective,
    blockedUri: violation.blockedUri,
    sourceFile: violation.sourceFile,
    lineNumber: violation.lineNumber,
    columnNumber: violation.columnNumber,
    timestamp: new Date().toISOString()
  });
  
  // In production, you'd send this to a monitoring service
  if (process.env.NODE_ENV === 'production' && process.env.CSP_VIOLATION_WEBHOOK) {
    fetch(process.env.CSP_VIOLATION_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(violation)
    }).catch(error => {
      console.error('Failed to report CSP violation:', error);
    });
  }
}

// CSP middleware for Next.js
export function cspMiddleware(config: CSPConfig = DEFAULT_CSP_CONFIG) {
  return function cspMiddleware(req: NextRequest) {
    const response = NextResponse.next();
    
    // Validate config
    const validation = validateCSPConfig(config);
    if (!validation.isValid) {
      console.error('Invalid CSP config:', validation.errors);
      return response;
    }
    
    // Apply CSP headers
    return applyCSPHeaders(response, config);
  };
}
