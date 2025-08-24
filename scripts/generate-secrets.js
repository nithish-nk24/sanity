#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Secret generation configuration
const SECRET_CONFIGS = {
  NEXTAUTH_SECRET: {
    length: 64,
    description: 'NextAuth.js secret for JWT signing',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  CSRF_SECRET: {
    length: 128,
    description: 'CSRF protection secret key',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  ENCRYPTION_KEY: {
    length: 32,
    description: 'Encryption key for sensitive data',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  JWT_SECRET: {
    length: 64,
    description: 'JWT token signing secret',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  API_KEY: {
    length: 32,
    description: 'API authentication key',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: false }
  },
  DATABASE_PASSWORD: {
    length: 16,
    description: 'Database connection password',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  SMTP_PASSWORD: {
    length: 16,
    description: 'SMTP email password',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  REDIS_PASSWORD: {
    length: 16,
    description: 'Redis connection password',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  BACKUP_ENCRYPTION_KEY: {
    length: 32,
    description: 'Backup encryption key',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true }
  },
  MONITORING_API_KEY: {
    length: 32,
    description: 'Monitoring service API key',
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: false }
  }
};

// Generate secret with specific requirements
function generateSecret(length, complexity) {
  let charset = '';
  let result = '';

  if (complexity.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (complexity.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (complexity.numbers) charset += '0123456789';
  if (complexity.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Ensure at least one character from each required category
  if (complexity.uppercase) result += charset.charAt(Math.floor(Math.random() * 26));
  if (complexity.lowercase) result += charset.charAt(26 + Math.floor(Math.random() * 26));
  if (complexity.numbers) result += charset.charAt(52 + Math.floor(Math.random() * 10));
  if (complexity.symbols) result += charset.charAt(62 + Math.floor(Math.random() * (charset.length - 62)));

  // Fill the rest randomly
  for (let i = result.length; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Shuffle the result
  return result.split('').sort(() => Math.random() - 0.5).join('');
}

// Generate all secrets
function generateAllSecrets() {
  const secrets = {};
  
  console.log('🔐 Generating strong secrets for all services...\n');
  
  for (const [key, config] of Object.entries(SECRET_CONFIGS)) {
    const secret = generateSecret(config.length, config.complexity);
    secrets[key] = secret;
    
    console.log(`✅ ${key}`);
    console.log(`   Length: ${config.length} characters`);
    console.log(`   Description: ${config.description}`);
    console.log(`   Secret: ${secret}\n`);
  }
  
  return secrets;
}

// Create environment-specific files
function createEnvironmentFiles(secrets) {
  const envDir = path.join(process.cwd(), 'config', 'environments');
  
  // Ensure directory exists
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }
  
  // Development environment
  const devEnv = {
    NODE_ENV: 'development',
    NEXTAUTH_URL: 'http://localhost:3000',
    CSP_MODE: 'development',
    CSP_REPORT_ONLY: 'true',
    FORCE_HTTPS: 'false',
    ENABLE_DEBUG_MODE: 'true',
    LOG_LEVEL: 'debug',
    ...secrets
  };
  
  // Staging environment
  const stagingEnv = {
    NODE_ENV: 'staging',
    NEXTAUTH_URL: 'https://staging.yourdomain.com',
    CSP_MODE: 'production',
    CSP_REPORT_ONLY: 'true',
    FORCE_HTTPS: 'true',
    ENABLE_DEBUG_MODE: 'false',
    LOG_LEVEL: 'info',
    ...secrets
  };
  
  // Production environment
  const prodEnv = {
    NODE_ENV: 'production',
    NEXTAUTH_URL: 'https://yourdomain.com',
    CSP_MODE: 'production',
    CSP_REPORT_ONLY: 'false',
    FORCE_HTTPS: 'true',
    ENABLE_DEBUG_MODE: 'false',
    LOG_LEVEL: 'warn',
    ...secrets
  };
  
  // Write environment files
  fs.writeFileSync(
    path.join(envDir, '.env.development'),
    Object.entries(devEnv).map(([k, v]) => `${k}=${v}`).join('\n')
  );
  
  fs.writeFileSync(
    path.join(envDir, '.env.staging'),
    Object.entries(stagingEnv).map(([k, v]) => `${k}=${v}`).join('\n')
  );
  
  fs.writeFileSync(
    path.join(envDir, '.env.production'),
    Object.entries(prodEnv).map(([k, v]) => `${k}=${v}`).join('\n')
  );
  
  console.log('📁 Environment files created in config/environments/');
}

// Create .env.local template
function createLocalEnvTemplate(secrets) {
  const template = `# Local Environment Configuration
# Copy this file to .env.local and fill in your actual values
# NEVER commit .env.local to version control

# Node Environment
NODE_ENV=development

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-27
SANITY_WRITE_TOKEN=your_sanity_write_token_here

# Authentication & Security
NEXTAUTH_SECRET=${secrets.NEXTAUTH_SECRET}
NEXTAUTH_URL=http://localhost:3000

# CSRF Protection
CSRF_SECRET=${secrets.CSRF_SECRET}
CSRF_TOKEN_LENGTH=64
CSRF_COOKIE_NAME=csrf-token
CSRF_HEADER_NAME=x-csrf-token

# Content Security Policy
CSP_VIOLATION_WEBHOOK=your_csp_violation_webhook_url_here
CSP_MODE=development
CSP_REPORT_ONLY=true

# API Security
SECURITY_WEBHOOK_URL=your_security_webhook_url_here
SLACK_WEBHOOK_URL=your_slack_webhook_url_here

# Rate Limiting
RATE_LIMIT_GENERAL_MAX=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_BLOG_MAX=10
RATE_LIMIT_UPLOAD_MAX=20

# Monitoring & Logging
ENABLE_SECURITY_LOGGING=true
ENABLE_REQUEST_LOGGING=true

# HTTPS Enforcement
FORCE_HTTPS=false

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Database & External Services
DATABASE_URL=your_database_url_here
REDIS_URL=your_redis_url_here

# Email Configuration
SMTP_HOST=your_smtp_host_here
SMTP_PORT=587
SMTP_USER=your_smtp_username_here
SMTP_PASS=${secrets.SMTP_PASSWORD}

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Application Settings
SITE_NAME=Cyfotok Academy
SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@yourdomain.com

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_COMMENTS=true
ENABLE_ANALYTICS=false
ENABLE_NOTIFICATIONS=false

# Development Settings
ENABLE_DEBUG_MODE=true
LOG_LEVEL=debug

# Performance
CACHE_TTL=300
MAX_CONCURRENT_REQUESTS=5

# Backup & Recovery
BACKUP_ENABLED=false
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE=0 2 * * *

# Maintenance Mode
MAINTENANCE_MODE=false
MAINTENANCE_MESSAGE=Site is under maintenance. Please check back later.

# Third-party Integrations
GOOGLE_ANALYTICS_ID=your_ga_id_here
FACEBOOK_PIXEL_ID=your_fb_pixel_id_here
HOTJAR_ID=your_hotjar_id_here

# Error Reporting
SENTRY_DSN=your_sentry_dsn_here
LOGROCKET_ID=your_logrocket_id_here

# Testing
TEST_DATABASE_URL=your_test_database_url_here
TEST_SANITY_PROJECT_ID=your_test_sanity_project_id_here

# Custom Environment Variables
CUSTOM_CONFIG=your_custom_config_here
`;
  
  fs.writeFileSync('.env.local.template', template);
  console.log('📄 .env.local.template created');
}

// Create secrets summary
function createSecretsSummary(secrets) {
  const summary = `# Generated Secrets Summary
# Generated on: ${new Date().toISOString()}
# 
# IMPORTANT: These secrets are for reference only.
# Use the actual values in your environment files.
# NEVER commit this file to version control.

${Object.entries(secrets).map(([key, value]) => `${key}=${value}`).join('\n')}

# Secret Rotation Schedule:
# - NEXTAUTH_SECRET: Every 90 days
# - CSRF_SECRET: Every 30 days
# - ENCRYPTION_KEY: Every 365 days (manual rotation)
# - JWT_SECRET: Every 90 days
# - API_KEY: Every 180 days
# - Database passwords: Every 60 days
# - SMTP passwords: Every 60 days
# - Redis passwords: Every 60 days

# Security Notes:
# - Store secrets securely (use environment variables)
# - Rotate secrets regularly according to schedule
# - Use different secrets for each environment
# - Monitor secret usage and access
# - Implement secret rotation automation
`;
  
  fs.writeFileSync('SECRETS_SUMMARY.md', summary);
  console.log('📋 SECRETS_SUMMARY.md created');
}

// Main execution
function main() {
  try {
    console.log('🚀 Starting secret generation process...\n');
    
    // Generate all secrets
    const secrets = generateAllSecrets();
    
    // Create environment files
    createEnvironmentFiles(secrets);
    
    // Create local environment template
    createLocalEnvTemplate(secrets);
    
    // Create secrets summary
    createSecretsSummary(secrets);
    
    console.log('\n🎉 Secret generation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy .env.local.template to .env.local');
    console.log('2. Fill in your actual service credentials');
    console.log('3. Review and customize environment files');
    console.log('4. Set up secret rotation monitoring');
    console.log('5. Never commit .env.local or SECRETS_SUMMARY.md');
    
  } catch (error) {
    console.error('❌ Error generating secrets:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSecret,
  generateAllSecrets,
  createEnvironmentFiles,
  createLocalEnvTemplate,
  createSecretsSummary
};
