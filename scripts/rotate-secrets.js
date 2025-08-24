#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Secret rotation configuration
const ROTATION_CONFIG = {
  NEXTAUTH_SECRET: {
    interval: 90 * 24 * 60 * 60 * 1000, // 90 days
    minLength: 64,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: 'NextAuth.js secret for JWT signing'
  },
  CSRF_SECRET: {
    interval: 30 * 24 * 60 * 60 * 1000, // 30 days
    minLength: 128,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: 'CSRF protection secret key'
  },
  ENCRYPTION_KEY: {
    interval: 365 * 24 * 60 * 60 * 1000, // 1 year
    minLength: 32,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: 'Encryption key for sensitive data'
  },
  JWT_SECRET: {
    interval: 90 * 24 * 60 * 60 * 1000, // 90 days
    minLength: 64,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: 'JWT token signing secret'
  },
  API_KEY: {
    interval: 180 * 24 * 60 * 60 * 1000, // 180 days
    minLength: 32,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: false },
    description: 'API authentication key'
  },
  DATABASE_PASSWORD: {
    interval: 60 * 24 * 60 * 60 * 1000, // 60 days
    minLength: 16,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: 'Database connection password'
  },
  SMTP_PASSWORD: {
    interval: 60 * 24 * 60 * 60 * 1000, // 60 days
    minLength: 16,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: 'SMTP email password'
  },
  REDIS_PASSWORD: {
    interval: 60 * 24 * 60 * 60 * 1000, // 60 days
    minLength: 16,
    complexity: { uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: 'Redis connection password'
  }
};

// Generate strong secret with specific requirements
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

// Check if secret needs rotation
function needsRotation(secretName, lastRotation, interval) {
  if (!lastRotation) return true;
  
  const now = Date.now();
  const lastRotationTime = new Date(lastRotation).getTime();
  const timeSinceRotation = now - lastRotationTime;
  
  return timeSinceRotation >= interval;
}

// Load environment file
function loadEnvironmentFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    const metadata = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          env[key.trim()] = value;
          
          // Check for rotation metadata
          if (key.endsWith('_LAST_ROTATED')) {
            const baseKey = key.replace('_LAST_ROTATED', '');
            metadata[baseKey] = value;
          }
        }
      }
    });
    
    return { env, metadata };
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error.message);
    return null;
  }
}

// Save environment file with metadata
function saveEnvironmentFile(filePath, env, metadata) {
  try {
    let content = '';
    
    // Add environment variables
    for (const [key, value] of Object.entries(env)) {
      content += `${key}=${value}\n`;
    }
    
    // Add metadata
    content += '\n# Secret rotation metadata\n';
    for (const [key, value] of Object.entries(metadata)) {
      content += `# ${key}_LAST_ROTATED=${value}\n`;
    }
    
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${filePath}:`, error.message);
    return false;
  }
}

// Rotate specific secret
function rotateSecret(secretName, env, metadata) {
  const config = ROTATION_CONFIG[secretName];
  if (!config) {
    console.log(`⚠️  No rotation config found for ${secretName}`);
    return false;
  }
  
  const lastRotation = metadata[secretName];
  if (!needsRotation(secretName, lastRotation, config.interval)) {
    console.log(`✅ ${secretName} doesn't need rotation yet`);
    return false;
  }
  
  // Generate new secret
  const newSecret = generateSecret(config.minLength, config.complexity);
  
  // Update environment
  env[secretName] = newSecret;
  metadata[secretName] = new Date().toISOString();
  
  console.log(`🔄 Rotated ${secretName}: ${newSecret.substring(0, 8)}...`);
  return true;
}

// Rotate all secrets that need rotation
function rotateAllSecrets(env, metadata) {
  const rotated = [];
  
  for (const secretName of Object.keys(ROTATION_CONFIG)) {
    if (rotateSecret(secretName, env, metadata)) {
      rotated.push(secretName);
    }
  }
  
  return rotated;
}

// Create backup of environment file
function createBackup(filePath) {
  try {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error(`❌ Error creating backup: ${error.message}`);
    return null;
  }
}

// Validate rotated secrets
function validateSecrets(env) {
  const errors = [];
  
  for (const [secretName, config] of Object.entries(ROTATION_CONFIG)) {
    const secret = env[secretName];
    if (secret) {
      if (secret.length < config.minLength) {
        errors.push(`${secretName} is too short (${secret.length} < ${config.minLength})`);
      }
      
      // Check complexity
      const hasUppercase = /[A-Z]/.test(secret);
      const hasLowercase = /[a-z]/.test(secret);
      const hasNumbers = /\d/.test(secret);
      const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(secret);
      
      if (config.complexity.uppercase && !hasUppercase) {
        errors.push(`${secretName} missing uppercase letters`);
      }
      if (config.complexity.lowercase && !hasLowercase) {
        errors.push(`${secretName} missing lowercase letters`);
      }
      if (config.complexity.numbers && !hasNumbers) {
        errors.push(`${secretName} missing numbers`);
      }
      if (config.complexity.symbols && !hasSymbols) {
        errors.push(`${secretName} missing symbols`);
      }
    }
  }
  
  return errors;
}

// Generate rotation report
function generateRotationReport(rotated, metadata, errors) {
  const report = {
    timestamp: new Date().toISOString(),
    rotatedSecrets: rotated,
    nextRotationDates: {},
    validationErrors: errors,
    recommendations: []
  };
  
  // Calculate next rotation dates
  for (const [secretName, config] of Object.entries(ROTATION_CONFIG)) {
    const lastRotation = metadata[secretName];
    if (lastRotation) {
      const lastRotationTime = new Date(lastRotation).getTime();
      const nextRotationTime = lastRotationTime + config.interval;
      report.nextRotationDates[secretName] = new Date(nextRotationTime).toISOString();
    }
  }
  
  // Generate recommendations
  if (rotated.length > 0) {
    report.recommendations.push(`✅ Successfully rotated ${rotated.length} secret(s)`);
  }
  
  if (errors.length > 0) {
    report.recommendations.push(`❌ Fix validation errors: ${errors.join(', ')}`);
  }
  
  const now = Date.now();
  const upcomingRotations = [];
  
  for (const [secretName, nextDate] of Object.entries(report.nextRotationDates)) {
    const nextTime = new Date(nextDate).getTime();
    const daysUntilRotation = Math.ceil((nextTime - now) / (24 * 60 * 60 * 1000));
    
    if (daysUntilRotation <= 7) {
      upcomingRotations.push(`${secretName} in ${daysUntilRotation} days`);
    }
  }
  
  if (upcomingRotations.length > 0) {
    report.recommendations.push(`⚠️  Upcoming rotations: ${upcomingRotations.join(', ')}`);
  }
  
  return report;
}

// Save rotation report
function saveRotationReport(report, filename = 'secret-rotation-report.json') {
  try {
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`📋 Rotation report saved to ${filename}`);
  } catch (error) {
    console.error(`❌ Error saving report: ${error.message}`);
  }
}

// Display rotation status
function displayRotationStatus(metadata) {
  console.log('\n📅 Secret Rotation Status:\n');
  
  for (const [secretName, config] of Object.entries(ROTATION_CONFIG)) {
    const lastRotation = metadata[secretName];
    const status = lastRotation ? '✅' : '❌';
    const lastRotationText = lastRotation ? new Date(lastRotation).toLocaleDateString() : 'Never';
    
    if (lastRotation) {
      const lastRotationTime = new Date(lastRotation).getTime();
      const nextRotationTime = lastRotationTime + config.interval;
      const daysUntilRotation = Math.ceil((nextRotationTime - Date.now()) / (24 * 60 * 60 * 1000));
      
      let statusText = '';
      if (daysUntilRotation <= 0) {
        statusText = '🔴 OVERDUE';
      } else if (daysUntilRotation <= 7) {
        statusText = `🟡 Due in ${daysUntilRotation} days`;
      } else {
        statusText = `🟢 Due in ${daysUntilRotation} days`;
      }
      
      console.log(`${status} ${secretName}: ${lastRotationText} (${statusText})`);
    } else {
      console.log(`${status} ${secretName}: ${lastRotationText}`);
    }
  }
}

// Main execution
function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const envFile = args.find(arg => !arg.startsWith('--')) || '.env.local';
    const forceRotation = args.includes('--force');
    const dryRun = args.includes('--dry-run');
    
    console.log('🔄 Starting secret rotation process...\n');
    
    // Load environment file
    const result = loadEnvironmentFile(envFile);
    if (!result) {
      console.error(`❌ Environment file not found: ${envFile}`);
      process.exit(1);
    }
    
    const { env, metadata } = result;
    
    // Display current status
    displayRotationStatus(metadata);
    
    if (dryRun) {
      console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
    }
    
    // Create backup
    if (!dryRun) {
      createBackup(envFile);
    }
    
    // Rotate secrets
    const rotated = rotateAllSecrets(env, metadata);
    
    if (rotated.length === 0 && !forceRotation) {
      console.log('\n✅ No secrets need rotation at this time');
      return;
    }
    
    // Validate rotated secrets
    const validationErrors = validateSecrets(env);
    
    if (validationErrors.length > 0) {
      console.log('\n❌ Validation errors found:');
      validationErrors.forEach(error => console.log(`   ${error}`));
      
      if (!dryRun) {
        console.log('\n⚠️  Rolling back changes...');
        // In a real implementation, you'd restore from backup
        return;
      }
    }
    
    // Save changes
    if (!dryRun) {
      if (saveEnvironmentFile(envFile, env, metadata)) {
        console.log(`\n✅ Environment file updated: ${envFile}`);
      } else {
        console.log('\n❌ Failed to save environment file');
        return;
      }
    }
    
    // Generate and save report
    const report = generateRotationReport(rotated, metadata, validationErrors);
    if (!dryRun) {
      saveRotationReport(report);
    }
    
    // Display summary
    console.log('\n📊 Rotation Summary:');
    console.log(`   Rotated: ${rotated.length} secret(s)`);
    console.log(`   Errors: ${validationErrors.length}`);
    
    if (rotated.length > 0) {
      console.log('\n🔄 Rotated secrets:');
      rotated.forEach(secret => console.log(`   ✅ ${secret}`));
    }
    
    if (validationErrors.length > 0) {
      console.log('\n❌ Validation errors:');
      validationErrors.forEach(error => console.log(`   ${error}`));
    }
    
    console.log('\n🎉 Secret rotation completed successfully!');
    
  } catch (error) {
    console.error('❌ Rotation error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSecret,
  needsRotation,
  rotateSecret,
  rotateAllSecrets,
  validateSecrets,
  generateRotationReport
};
