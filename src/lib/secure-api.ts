import { NextRequest, NextResponse } from 'next/server';
import { 
  applySecurityMiddleware, 
  DEFAULT_RATE_LIMITS, 
  errorHandler,
  RateLimitConfig 
} from './api-security';

export interface SecureApiOptions {
  rateLimit?: RateLimitConfig;
  validation?: Record<string, any>;
  enableLogging?: boolean;
  requireAuth?: boolean;
  allowedMethods?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}

// Secure API wrapper function
export function createSecureApi<T = any>(
  handler: (req: NextRequest) => Promise<ApiResponse<T>>,
  options: SecureApiOptions = {}
) {
  return async function secureApiHandler(req: NextRequest) {
    try {
      // Check allowed methods
      if (options.allowedMethods && !options.allowedMethods.includes(req.method)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Method not allowed',
            message: `Method ${req.method} is not allowed for this endpoint`
          },
          { status: 405 }
        );
      }

      // Apply security middleware
      const securityResponse = applySecurityMiddleware(req, {
        rateLimit: options.rateLimit,
        validation: options.validation,
        enableLogging: options.enableLogging
      });

      if (securityResponse) {
        return securityResponse;
      }

      // Authentication check (if required)
      if (options.requireAuth) {
        const authResult = await checkAuthentication(req);
        if (!authResult.success) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Unauthorized',
              message: 'Authentication required'
            },
            { status: 401 }
          );
        }
      }

      // Execute the actual handler
      const result = await handler(req);
      
      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return errorHandler(error as Error, req);
    }
  };
}

// Authentication check function
async function checkAuthentication(req: NextRequest): Promise<{ success: boolean; user?: any }> {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false };
    }

    const token = authHeader.substring(7);
    
    // In a real app, you'd verify the JWT token here
    // For now, we'll do a basic check
    if (token.length < 10) {
      return { success: false };
    }

    // Mock user data - replace with actual JWT verification
    const user = {
      id: 'user_123',
      role: 'user',
      permissions: ['read', 'write']
    };

    return { success: true, user };
  } catch (error) {
    return { success: false };
  }
}

// Predefined secure API configurations
export const SECURE_API_CONFIGS = {
  // Public read-only endpoints
  public: {
    rateLimit: DEFAULT_RATE_LIMITS.general,
    enableLogging: true
  },
  
  // Authentication endpoints
  auth: {
    rateLimit: DEFAULT_RATE_LIMITS.auth,
    validation: {
      username: { required: true, type: 'string', minLength: 3, maxLength: 50 },
      password: { required: true, type: 'string', minLength: 8, maxLength: 128 }
    },
    enableLogging: true
  },
  
  // Blog management endpoints
  blog: {
    rateLimit: DEFAULT_RATE_LIMITS.blog,
    requireAuth: true,
    validation: {
      title: { required: true, type: 'string', minLength: 3, maxLength: 200 },
      description: { required: true, type: 'string', minLength: 10, maxLength: 2000 }
    },
    enableLogging: true
  },
  
  // File upload endpoints
  upload: {
    rateLimit: DEFAULT_RATE_LIMITS.upload,
    requireAuth: true,
    enableLogging: true
  },
  
  // Admin endpoints
  admin: {
    rateLimit: DEFAULT_RATE_LIMITS.auth,
    requireAuth: true,
    validation: {
      action: { required: true, type: 'string', enum: ['create', 'read', 'update', 'delete'] }
    },
    enableLogging: true
  }
} as const;

// Helper function to create common API responses
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string,
  details?: any
): ApiResponse<T> {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error }),
    ...(details && { details })
  };
}

// Success response helper
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return createApiResponse(true, data, message);
}

// Error response helper
export function errorResponse(error: string, message?: string, details?: any): ApiResponse {
  return createApiResponse(false, undefined, message, error, details);
}

// Validation error response helper
export function validationErrorResponse(errors: string[]): ApiResponse {
  return createApiResponse(false, undefined, 'Validation failed', 'Validation failed', errors);
}

// Rate limit error response helper
export function rateLimitErrorResponse(message: string, retryAfter: number): ApiResponse {
  return createApiResponse(false, undefined, message, 'Rate limit exceeded', { retryAfter });
}
