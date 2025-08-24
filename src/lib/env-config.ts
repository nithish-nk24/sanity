import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Sanity Configuration
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1, 'Sanity Project ID is required'),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1, 'Sanity Dataset is required'),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid API version format'),
  SANITY_WRITE_TOKEN: z.string().min(1, 'Sanity Write Token is required'),
  
  // Authentication & Security
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL format'),
  
  // CSRF Protection
  CSRF_SECRET: z.string().min(64, 'CSRF_SECRET must be at least 64 characters'),
  CSRF_TOKEN_LENGTH: z.coerce.number().int().min(32).max(128).default(64),
  CSRF_COOKIE_NAME: z.string().default('csrf-token'),
  CSRF_HEADER_NAME: z.string().default('x-csrf-token'),
  
  // Content Security Policy
  CSP_VIOLATION_WEBHOOK: z.string().url().optional(),
  CSP_MODE: z.enum(['development', 'production', 'strict']).default('production'),
  CSP_REPORT_ONLY: z.coerce.boolean().default(false),
  
  // API Security
  SECURITY_WEBHOOK_URL: z.string().url().optional(),
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  
  // Rate Limiting
  RATE_LIMIT_GENERAL_MAX: z.coerce.number().int().min(10).max(1000).default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().min(3).max(20).default(5),
  RATE_LIMIT_BLOG_MAX: z.coerce.number().int().min(5).max(50).default(10),
  RATE_LIMIT_UPLOAD_MAX: z.coerce.number().int().min(10).max(100).default(20),
  
  // Monitoring & Logging
  ENABLE_SECURITY_LOGGING: z.coerce.boolean().default(true),
  ENABLE_REQUEST_LOGGING: z.coerce.boolean().default(true),
  
  // HTTPS Enforcement
  FORCE_HTTPS: z.coerce.boolean().default(true),
  
  // Razorpay Configuration
  RAZORPAY_KEY_ID: z.string().min(1, 'Razorpay Key ID is required'),
  RAZORPAY_KEY_SECRET: z.string().min(1, 'Razorpay Key Secret is required'),
  
  // Database & External Services
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  
  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // File Upload
  MAX_FILE_SIZE: z.coerce.number().int().min(1024).max(100 * 1024 * 1024).default(10 * 1024 * 1024), // 10MB default
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/gif,image/webp'),
  
  // Application Settings
  SITE_NAME: z.string().default('Cyfotok Academy'),
  SITE_URL: z.string().url().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  
  // Feature Flags
  ENABLE_REGISTRATION: z.coerce.boolean().default(true),
  ENABLE_COMMENTS: z.coerce.boolean().default(true),
  ENABLE_ANALYTICS: z.coerce.boolean().default(true),
  ENABLE_NOTIFICATIONS: z.coerce.boolean().default(true),
  
  // Development Settings
  ENABLE_DEBUG_MODE: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Performance
  CACHE_TTL: z.coerce.number().int().min(60).max(86400).default(3600), // 1 hour default
  MAX_CONCURRENT_REQUESTS: z.coerce.number().int().min(1).max(100).default(10),
  
  // Backup & Recovery
  BACKUP_ENABLED: z.coerce.boolean().default(false),
  BACKUP_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(30),
  BACKUP_SCHEDULE: z.string().default('0 2 * * *'), // Daily at 2 AM
  
  // Maintenance Mode
  MAINTENANCE_MODE: z.coerce.boolean().default(false),
  MAINTENANCE_MESSAGE: z.string().default('Site is under maintenance. Please check back later.'),
  
  // Third-party Integrations
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  FACEBOOK_PIXEL_ID: z.string().optional(),
  HOTJAR_ID: z.string().optional(),
  
  // Error Reporting
  SENTRY_DSN: z.string().url().optional(),
  LOGROCKET_ID: z.string().optional(),
  
  // Testing
  TEST_DATABASE_URL: z.string().url().optional(),
  TEST_SANITY_PROJECT_ID: z.string().optional(),
  
  // Custom Environment Variables
  CUSTOM_CONFIG: z.string().optional(),
});

// Environment variable types
export type EnvConfig = z.infer<typeof envSchema>;

// Environment-specific configurations
export const ENV_CONFIGS = {
  development: {
    LOG_LEVEL: 'debug' as const,
    ENABLE_DEBUG_MODE: true,
    ENABLE_REQUEST_LOGGING: true,
    CACHE_TTL: 300, // 5 minutes in development
    CSP_MODE: 'development' as const,
    CSP_REPORT_ONLY: true,
  },
  
  production: {
    LOG_LEVEL: 'warn' as const,
    ENABLE_DEBUG_MODE: false,
    ENABLE_REQUEST_LOGGING: false,
    CACHE_TTL: 3600, // 1 hour in production
    CSP_MODE: 'production' as const,
    CSP_REPORT_ONLY: false,
    FORCE_HTTPS: true,
  },
  
  test: {
    LOG_LEVEL: 'error' as const,
    ENABLE_DEBUG_MODE: false,
    ENABLE_REQUEST_LOGGING: false,
    CACHE_TTL: 60, // 1 minute in tests
    CSP_MODE: 'strict' as const,
    CSP_REPORT_ONLY: true,
  },
} as const;

// Validate and parse environment variables
function validateEnv(): EnvConfig {
  try {
    const env = envSchema.parse(process.env);
    
    // Apply environment-specific overrides
    const envOverrides = ENV_CONFIGS[env.NODE_ENV];
    const finalConfig = { ...env, ...envOverrides };
    
    // Validate production requirements
    if (finalConfig.NODE_ENV === 'production') {
      validateProductionConfig(finalConfig);
    }
    
    return finalConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
}

// Validate production configuration
function validateProductionConfig(config: EnvConfig): void {
  const errors: string[] = [];
  
  // Check for weak secrets
  if (config.NEXTAUTH_SECRET.length < 64) {
    errors.push('NEXTAUTH_SECRET must be at least 64 characters in production');
  }
  
  if (config.CSRF_SECRET.length < 128) {
    errors.push('CSRF_SECRET must be at least 128 characters in production');
  }
  
  // Check for HTTPS
  if (!config.FORCE_HTTPS) {
    errors.push('FORCE_HTTPS must be true in production');
  }
  
  // Check for secure CSP
  if (config.CSP_MODE === 'development') {
    errors.push('CSP_MODE cannot be development in production');
  }
  
  // Check for monitoring
  if (!config.SECURITY_WEBHOOK_URL && !config.SLACK_WEBHOOK_URL) {
    errors.push('At least one monitoring webhook must be configured in production');
  }
  
  if (errors.length > 0) {
    throw new Error(`Production configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Generate strong secrets
export function generateStrongSecret(length: number = 128): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return result;
}

// Generate environment-specific secrets
export function generateEnvironmentSecrets(): Record<string, string> {
  return {
    NEXTAUTH_SECRET: generateStrongSecret(64),
    CSRF_SECRET: generateStrongSecret(128),
    JWT_SECRET: generateStrongSecret(64),
    ENCRYPTION_KEY: generateStrongSecret(32),
    API_KEY: generateStrongSecret(32),
  };
}

// Check if running in production
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Check if running in development
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Check if running in test environment
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// Get configuration for current environment
export function getConfig(): EnvConfig {
  return validateEnv();
}

// Get specific configuration value
export function getConfigValue<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
  const config = getConfig();
  return config[key];
}

// Check if feature is enabled
export function isFeatureEnabled(feature: keyof Pick<EnvConfig, 'ENABLE_REGISTRATION' | 'ENABLE_COMMENTS' | 'ENABLE_ANALYTICS' | 'ENABLE_NOTIFICATIONS'>): boolean {
  return getConfigValue(feature);
}

// Get environment-specific configuration
export function getEnvironmentConfig() {
  const config = getConfig();
  return ENV_CONFIGS[config.NODE_ENV];
}

// Validate configuration on startup
export function validateStartupConfig(): void {
  try {
    const config = getConfig();
    console.log(`✅ Environment configuration validated successfully for ${config.NODE_ENV} mode`);
    
    if (isProduction()) {
      console.log('🔒 Production security checks passed');
    }
  } catch (error) {
    console.error('❌ Environment configuration validation failed:', error);
    process.exit(1);
  }
}

// Export validated configuration
export const env = getConfig();

// Export type-safe configuration getters
export const config = {
  sanity: {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
    writeToken: env.SANITY_WRITE_TOKEN,
  },
  
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
  
  security: {
    csrf: {
      secret: env.CSRF_SECRET,
      tokenLength: env.CSRF_TOKEN_LENGTH,
      cookieName: env.CSRF_COOKIE_NAME,
      headerName: env.CSRF_HEADER_NAME,
    },
    csp: {
      mode: env.CSP_MODE,
      reportOnly: env.CSP_REPORT_ONLY,
      violationWebhook: env.CSP_VIOLATION_WEBHOOK,
    },
    rateLimit: {
      general: env.RATE_LIMIT_GENERAL_MAX,
      auth: env.RATE_LIMIT_AUTH_MAX,
      blog: env.RATE_LIMIT_BLOG_MAX,
      upload: env.RATE_LIMIT_UPLOAD_MAX,
    },
  },
  
  razorpay: {
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
  },
  
  app: {
    name: env.SITE_NAME,
    url: env.SITE_URL,
    adminEmail: env.ADMIN_EMAIL,
    features: {
      registration: env.ENABLE_REGISTRATION,
      comments: env.ENABLE_COMMENTS,
      analytics: env.ENABLE_ANALYTICS,
      notifications: env.ENABLE_NOTIFICATIONS,
    },
  },
  
  development: {
    debugMode: env.ENABLE_DEBUG_MODE,
    logLevel: env.LOG_LEVEL,
    requestLogging: env.ENABLE_REQUEST_LOGGING,
  },
  
  performance: {
    cacheTTL: env.CACHE_TTL,
    maxConcurrentRequests: env.MAX_CONCURRENT_REQUESTS,
  },
  
  maintenance: {
    enabled: env.MAINTENANCE_MODE,
    message: env.MAINTENANCE_MESSAGE,
  },
} as const;
