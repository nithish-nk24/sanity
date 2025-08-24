import { config } from '../env-config';

// Base configuration interface
export interface EnvironmentConfig {
  name: string;
  debug: boolean;
  logging: {
    level: string;
    enableRequestLogging: boolean;
    enableSecurityLogging: boolean;
  };
  security: {
    cspMode: string;
    cspReportOnly: boolean;
    forceHttps: boolean;
    enableCSRF: boolean;
    rateLimiting: {
      enabled: boolean;
      strict: boolean;
    };
  };
  performance: {
    cacheTTL: number;
    maxConcurrentRequests: number;
    enableCompression: boolean;
    enableMinification: boolean;
  };
  features: {
    registration: boolean;
    comments: boolean;
    analytics: boolean;
    notifications: boolean;
    maintenance: boolean;
  };
  monitoring: {
    enableMetrics: boolean;
    enableHealthChecks: boolean;
    enableErrorReporting: boolean;
    webhookUrls: string[];
  };
  database: {
    connectionPool: number;
    queryTimeout: number;
    enableLogging: boolean;
  };
  email: {
    enabled: boolean;
    retryAttempts: number;
    retryDelay: number;
  };
  fileUpload: {
    maxSize: number;
    allowedTypes: string[];
    enableVirusScan: boolean;
    storage: 'local' | 's3' | 'cloudinary';
  };
}

// Development environment configuration
export const developmentConfig: EnvironmentConfig = {
  name: 'development',
  debug: true,
  logging: {
    level: 'debug',
    enableRequestLogging: true,
    enableSecurityLogging: true,
  },
  security: {
    cspMode: 'development',
    cspReportOnly: true,
    forceHttps: false,
    enableCSRF: true,
    rateLimiting: {
      enabled: true,
      strict: false,
    },
  },
  performance: {
    cacheTTL: 300, // 5 minutes
    maxConcurrentRequests: 5,
    enableCompression: false,
    enableMinification: false,
  },
  features: {
    registration: true,
    comments: true,
    analytics: false,
    notifications: false,
    maintenance: false,
  },
  monitoring: {
    enableMetrics: false,
    enableHealthChecks: true,
    enableErrorReporting: false,
    webhookUrls: [],
  },
  database: {
    connectionPool: 5,
    queryTimeout: 30000,
    enableLogging: true,
  },
  email: {
    enabled: false,
    retryAttempts: 1,
    retryDelay: 1000,
  },
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: 'image/jpeg,image/png,image/gif,image/webp',
    enableVirusScan: false,
    storage: 'local',
  },
};

// Staging environment configuration
export const stagingConfig: EnvironmentConfig = {
  name: 'staging',
  debug: false,
  logging: {
    level: 'info',
    enableRequestLogging: true,
    enableSecurityLogging: true,
  },
  security: {
    cspMode: 'production',
    cspReportOnly: true,
    forceHttps: true,
    enableCSRF: true,
    rateLimiting: {
      enabled: true,
      strict: true,
    },
  },
  performance: {
    cacheTTL: 1800, // 30 minutes
    maxConcurrentRequests: 20,
    enableCompression: true,
    enableMinification: true,
  },
  features: {
    registration: true,
    comments: true,
    analytics: true,
    notifications: true,
    maintenance: false,
  },
  monitoring: {
    enableMetrics: true,
    enableHealthChecks: true,
    enableErrorReporting: true,
    webhookUrls: [config.security.webhookUrl || ''].filter(Boolean),
  },
  database: {
    connectionPool: 10,
    queryTimeout: 15000,
    enableLogging: false,
  },
  email: {
    enabled: true,
    retryAttempts: 3,
    retryDelay: 2000,
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: 'image/jpeg,image/png,image/gif,image/webp,application/pdf',
    enableVirusScan: true,
    storage: 's3',
  },
};

// Production environment configuration
export const productionConfig: EnvironmentConfig = {
  name: 'production',
  debug: false,
  logging: {
    level: 'warn',
    enableRequestLogging: false,
    enableSecurityLogging: true,
  },
  security: {
    cspMode: 'production',
    cspReportOnly: false,
    forceHttps: true,
    enableCSRF: true,
    rateLimiting: {
      enabled: true,
      strict: true,
    },
  },
  performance: {
    cacheTTL: 3600, // 1 hour
    maxConcurrentRequests: 50,
    enableCompression: true,
    enableMinification: true,
  },
  features: {
    registration: true,
    comments: true,
    analytics: true,
    notifications: true,
    maintenance: false,
  },
  monitoring: {
    enableMetrics: true,
    enableHealthChecks: true,
    enableErrorReporting: true,
    webhookUrls: [
      config.security.webhookUrl || '',
      config.security.slackWebhookUrl || '',
    ].filter(Boolean),
  },
  database: {
    connectionPool: 20,
    queryTimeout: 10000,
    enableLogging: false,
  },
  email: {
    enabled: true,
    retryAttempts: 5,
    retryDelay: 5000,
  },
  fileUpload: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: 'image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain',
    enableVirusScan: true,
    storage: 's3',
  },
};

// Test environment configuration
export const testConfig: EnvironmentConfig = {
  name: 'test',
  debug: false,
  logging: {
    level: 'error',
    enableRequestLogging: false,
    enableSecurityLogging: false,
  },
  security: {
    cspMode: 'strict',
    cspReportOnly: true,
    forceHttps: false,
    enableCSRF: false,
    rateLimiting: {
      enabled: false,
      strict: false,
    },
  },
  performance: {
    cacheTTL: 60, // 1 minute
    maxConcurrentRequests: 1,
    enableCompression: false,
    enableMinification: false,
  },
  features: {
    registration: false,
    comments: false,
    analytics: false,
    notifications: false,
    maintenance: false,
  },
  monitoring: {
    enableMetrics: false,
    enableHealthChecks: false,
    enableErrorReporting: false,
    webhookUrls: [],
  },
  database: {
    connectionPool: 1,
    queryTimeout: 5000,
    enableLogging: false,
  },
  email: {
    enabled: false,
    retryAttempts: 0,
    retryDelay: 0,
  },
  fileUpload: {
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: 'image/jpeg,image/png',
    enableVirusScan: false,
    storage: 'local',
  },
};

// Get configuration for current environment
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}

// Get specific configuration value
export function getConfigValue<K extends keyof EnvironmentConfig>(
  key: K
): EnvironmentConfig[K] {
  const envConfig = getEnvironmentConfig();
  return envConfig[key];
}

// Check if feature is enabled
export function isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
  return getConfigValue('features')[feature];
}

// Check if security feature is enabled
export function isSecurityEnabled(feature: keyof EnvironmentConfig['security']): boolean {
  return getConfigValue('security')[feature] as boolean;
}

// Get performance configuration
export function getPerformanceConfig() {
  return getConfigValue('performance');
}

// Get monitoring configuration
export function getMonitoringConfig() {
  return getConfigValue('monitoring');
}

// Export all configurations
export const ENVIRONMENT_CONFIGS = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
  test: testConfig,
} as const;

// Export current environment config
export const currentConfig = getEnvironmentConfig();
