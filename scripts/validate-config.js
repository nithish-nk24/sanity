#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration validation rules
const VALIDATION_RULES = {
  // Required environment variables
  required: [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'NEXT_PUBLIC_SANITY_API_VERSION',
    'SANITY_WRITE_TOKEN',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'CSRF_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
  ],
  
  // Secret strength requirements
  secrets: {
    NEXTAUTH_SECRET: { minLength: 64, description: 'NextAuth secret' },
    CSRF_SECRET: { minLength: 128, description: 'CSRF protection secret' },
    ENCRYPTION_KEY: { minLength: 32, description: 'Encryption key' }
  },
  
  // URL validation
  urls: [
    'NEXTAUTH_URL',
    'SITE_URL',
    'CSP_VIOLATION_WEBHOOK',
    'SECURITY_WEBHOOK_URL',
    'SLACK_WEBHOOK_URL'
  ],
  
  // Numeric validation
  numbers: {
    RATE_LIMIT_GENERAL_MAX: { min: 10, max: 1000, default: 100 },
    RATE_LIMIT_AUTH_MAX: { min: 3, max: 20, default: 5 },
    RATE_LIMIT_BLOG_MAX: { min: 5, max: 50, default: 10 },
    RATE_LIMIT_UPLOAD_MAX: { min: 10, max: 100, default: 20 },
    MAX_FILE_SIZE: { min: 1024, max: 100 * 1024 * 1024, default: 10 * 1024 * 1024 },
    CACHE_TTL: { min: 60, max: 86400, default: 3600 }
  },
  
  // Boolean validation
  booleans: [
    'ENABLE_SECURITY_LOGGING',
    'ENABLE_REQUEST_LOGGING',
    'FORCE_HTTPS',
    'CSP_REPORT_ONLY',
    'ENABLE_DEBUG_MODE',
    'ENABLE_REGISTRATION',
    'ENABLE_COMMENTS',
    'ENABLE_ANALYTICS',
    'ENABLE_NOTIFICATIONS',
    'BACKUP_ENABLED',
    'MAINTENANCE_MODE'
  ],
  
  // Environment-specific requirements
  production: {
    required: ['SECURITY_WEBHOOK_URL', 'SLACK_WEBHOOK_URL'],
    forbidden: ['ENABLE_DEBUG_MODE'],
    mustBeTrue: ['FORCE_HTTPS'],
    mustBeFalse: ['CSP_REPORT_ONLY']
  }
};

// Validation functions
function validateRequired(env, errors) {
  for (const key of VALIDATION_RULES.required) {
    if (!env[key] || env[key].trim() === '') {
      errors.push(`❌ Missing required environment variable: ${key}`);
    }
  }
}

function validateSecrets(env, errors) {
  for (const [key, rule] of Object.entries(VALIDATION_RULES.secrets)) {
    if (env[key]) {
      if (env[key].length < rule.minLength) {
        errors.push(`❌ ${rule.description} (${key}) is too short. Minimum length: ${rule.minLength}, Current: ${env[key].length}`);
      }
      
      // Check complexity
      const hasUppercase = /[A-Z]/.test(env[key]);
      const hasLowercase = /[a-z]/.test(env[key]);
      const hasNumbers = /\d/.test(env[key]);
      const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(env[key]);
      
      if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSymbols) {
        errors.push(`❌ ${rule.description} (${key}) lacks complexity. Must include uppercase, lowercase, numbers, and symbols`);
      }
    }
  }
}

function validateUrls(env, errors) {
  for (const key of VALIDATION_RULES.urls) {
    if (env[key] && env[key] !== '') {
      try {
        new URL(env[key]);
      } catch {
        errors.push(`❌ Invalid URL format for ${key}: ${env[key]}`);
      }
    }
  }
}

function validateNumbers(env, errors) {
  for (const [key, rule] of Object.entries(VALIDATION_RULES.numbers)) {
    if (env[key]) {
      const num = parseInt(env[key]);
      if (isNaN(num)) {
        errors.push(`❌ ${key} must be a valid number, got: ${env[key]}`);
      } else if (num < rule.min || num > rule.max) {
        errors.push(`❌ ${key} must be between ${rule.min} and ${rule.max}, got: ${num}`);
      }
    }
  }
}

function validateBooleans(env, errors) {
  for (const key of VALIDATION_RULES.booleans) {
    if (env[key] && !['true', 'false', '0', '1'].includes(env[key].toLowerCase())) {
      errors.push(`❌ ${key} must be a boolean value (true/false), got: ${env[key]}`);
    }
  }
}

function validateEnvironmentSpecific(env, errors) {
  if (env.NODE_ENV === 'production') {
    const productionRules = VALIDATION_RULES.production;
    
    // Check required production variables
    for (const key of productionRules.required) {
      if (!env[key] || env[key].trim() === '') {
        errors.push(`❌ Production requires: ${key}`);
      }
    }
    
    // Check forbidden in production
    for (const key of productionRules.forbidden) {
      if (env[key] === 'true') {
        errors.push(`❌ Production forbids: ${key} = true`);
      }
    }
    
    // Check must be true in production
    for (const key of productionRules.mustBeTrue) {
      if (env[key] !== 'true') {
        errors.push(`❌ Production requires: ${key} = true`);
      }
    }
    
    // Check must be false in production
    for (const key of productionRules.mustBeFalse) {
      if (env[key] === 'true') {
        errors.push(`❌ Production requires: ${key} = false`);
      }
    }
  }
}

function validateSecurity(env, errors) {
  // Check for weak secrets
  if (env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length < 64) {
    errors.push(`❌ NEXTAUTH_SECRET is too weak for production (${env.NEXTAUTH_SECRET.length} chars, need 64+)`);
  }
  
  if (env.CSRF_SECRET && env.CSRF_SECRET.length < 128) {
    errors.push(`❌ CSRF_SECRET is too weak for production (${env.CSRF_SECRET.length} chars, need 128+)`);
  }
  
  // Check for development settings in production
  if (env.NODE_ENV === 'production') {
    if (env.CSP_MODE === 'development') {
      errors.push(`❌ CSP_MODE cannot be 'development' in production`);
    }
    
    if (env.ENABLE_DEBUG_MODE === 'true') {
      errors.push(`❌ ENABLE_DEBUG_MODE cannot be true in production`);
    }
    
    if (env.LOG_LEVEL === 'debug') {
      errors.push(`❌ LOG_LEVEL cannot be 'debug' in production`);
    }
  }
  
  // Check for exposed sensitive data
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /key/i,
    /token/i,
    /credential/i
  ];
  
  for (const [key, value] of Object.entries(env)) {
    if (sensitivePatterns.some(pattern => pattern.test(key))) {
      if (value && value.length > 0 && value !== 'your_' + key.toLowerCase() + '_here') {
        // Check if it looks like a placeholder
        if (!value.includes('your_') && !value.includes('here')) {
          console.log(`⚠️  Warning: ${key} appears to contain actual value (not placeholder)`);
        }
      }
    }
  }
}

function validateSanityConfig(env, errors) {
  // Validate Sanity project ID format
  if (env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    if (env.NEXT_PUBLIC_SANITY_PROJECT_ID.length < 5) {
      errors.push(`❌ Sanity Project ID seems too short: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    }
  }
  
  // Validate API version format
  if (env.NEXT_PUBLIC_SANITY_API_VERSION) {
    const versionPattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!versionPattern.test(env.NEXT_PUBLIC_SANITY_API_VERSION)) {
      errors.push(`❌ Invalid Sanity API version format: ${env.NEXT_PUBLIC_SANITY_API_VERSION} (expected YYYY-MM-DD)`);
    }
  }
  
  // Validate dataset name
  if (env.NEXT_PUBLIC_SANITY_DATASET) {
    const datasetPattern = /^[a-z0-9_-]+$/;
    if (!datasetPattern.test(env.NEXT_PUBLIC_SANITY_DATASET)) {
      errors.push(`❌ Invalid dataset name: ${env.NEXT_PUBLIC_SANITY_DATASET} (only lowercase, numbers, hyphens, underscores)`);
    }
  }
}

function validateRazorpayConfig(env, errors) {
  if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    // Check if they look like actual keys (not placeholders)
    if (env.RAZORPAY_KEY_ID === 'your_razorpay_key_id_here' || 
        env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret_here') {
      errors.push(`❌ Razorpay credentials are still placeholder values`);
    }
    
    // Validate key format
    if (env.RAZORPAY_KEY_ID && !env.RAZORPAY_KEY_ID.startsWith('rzp_')) {
      errors.push(`❌ Razorpay Key ID should start with 'rzp_': ${env.RAZORPAY_KEY_ID}`);
    }
  }
}

function validateFileUploadConfig(env, errors) {
  if (env.MAX_FILE_SIZE) {
    const maxSize = parseInt(env.MAX_FILE_SIZE);
    if (maxSize > 100 * 1024 * 1024) { // 100MB
      errors.push(`❌ MAX_FILE_SIZE is very large (${maxSize} bytes). Consider reducing for security`);
    }
  }
  
  if (env.ALLOWED_FILE_TYPES) {
    const allowedTypes = env.ALLOWED_FILE_TYPES.split(',');
    const dangerousTypes = ['application/octet-stream', 'text/html', 'application/x-javascript'];
    
    for (const type of allowedTypes) {
      if (dangerousTypes.includes(type.trim())) {
        errors.push(`❌ Dangerous file type allowed: ${type.trim()}`);
      }
    }
  }
}

// Main validation function
function validateConfiguration(env) {
  const errors = [];
  const warnings = [];
  
  console.log('🔍 Validating environment configuration...\n');
  
  // Run all validations
  validateRequired(env, errors);
  validateSecrets(env, errors);
  validateUrls(env, errors);
  validateNumbers(env, errors);
  validateBooleans(env, errors);
  validateEnvironmentSpecific(env, errors);
  validateSecurity(env, errors);
  validateSanityConfig(env, errors);
  validateRazorpayConfig(env, errors);
  validateFileUploadConfig(env, errors);
  
  // Check for common issues
  if (env.NODE_ENV === 'production' && env.FORCE_HTTPS !== 'true') {
    warnings.push(`⚠️  FORCE_HTTPS is not enabled in production`);
  }
  
  if (env.NODE_ENV === 'production' && env.CSP_REPORT_ONLY === 'true') {
    warnings.push(`⚠️  CSP is in report-only mode in production`);
  }
  
  if (env.ENABLE_DEBUG_MODE === 'true' && env.NODE_ENV === 'production') {
    warnings.push(`⚠️  Debug mode is enabled in production`);
  }
  
  return { errors, warnings };
}

// Load environment file
function loadEnvironmentFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error.message);
    return null;
  }
}

// Generate configuration report
function generateReport(env, validation) {
  const report = {
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV || 'unknown',
    totalVariables: Object.keys(env).length,
    validation: validation,
    recommendations: []
  };
  
  // Generate recommendations
  if (env.NODE_ENV === 'production') {
    if (validation.errors.length === 0) {
      report.recommendations.push('✅ Production configuration is secure');
    } else {
      report.recommendations.push('❌ Fix validation errors before deploying to production');
    }
    
    if (validation.warnings.length > 0) {
      report.recommendations.push('⚠️  Review warnings for security best practices');
    }
  }
  
  if (env.NODE_ENV === 'development') {
    report.recommendations.push('🔧 Development configuration is ready for local development');
  }
  
  return report;
}

// Save validation report
function saveReport(report, filename = 'config-validation-report.json') {
  try {
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`📋 Validation report saved to ${filename}`);
  } catch (error) {
    console.error(`❌ Error saving report: ${error.message}`);
  }
}

// Main execution
function main() {
  try {
    // Check for environment file
    const envFile = process.argv[2] || '.env.local';
    const env = loadEnvironmentFile(envFile);
    
    if (!env) {
      console.error(`❌ Environment file not found: ${envFile}`);
      console.log('\nAvailable options:');
      console.log('1. Create .env.local from .env.local.template');
      console.log('2. Run: node scripts/generate-secrets.js');
      console.log('3. Specify a different file: node scripts/validate-config.js path/to/env/file');
      process.exit(1);
    }
    
    // Validate configuration
    const validation = validateConfiguration(env);
    
    // Display results
    console.log('📊 Validation Results:\n');
    
    if (validation.errors.length === 0) {
      console.log('✅ No validation errors found!');
    } else {
      console.log(`❌ Found ${validation.errors.length} validation error(s):`);
      validation.errors.forEach(error => console.log(`   ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      console.log(`\n⚠️  Found ${validation.warnings.length} warning(s):`);
      validation.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    // Generate and save report
    const report = generateReport(env, validation);
    saveReport(report);
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`   Environment: ${report.environment}`);
    console.log(`   Total Variables: ${report.totalVariables}`);
    console.log(`   Errors: ${validation.errors.length}`);
    console.log(`   Warnings: ${validation.warnings.length}`);
    
    if (validation.errors.length > 0) {
      console.log('\n❌ Configuration validation failed. Please fix the errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 Configuration validation passed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateConfiguration,
  loadEnvironmentFile,
  generateReport,
  saveReport
};
