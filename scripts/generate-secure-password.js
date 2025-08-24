#!/usr/bin/env node

const crypto = require('crypto');

function generateSecurePassword() {
  // Generate a cryptographically secure password
  const length = 20;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(crypto.randomInt(charset.length));
  }
  
  // Ensure it meets all complexity requirements
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
  // If it doesn't meet requirements, regenerate
  if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSymbols) {
    return generateSecurePassword();
  }
  
  return password;
}

function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < 5; i++) {
    codes.push(crypto.randomInt(100000, 999999).toString());
  }
  return codes;
}

console.log('🔐 Generating secure admin password...\n');

const securePassword = generateSecurePassword();
const backupCodes = generateBackupCodes();

console.log('✅ Secure Password Generated:');
console.log(`   Password: ${securePassword}`);
console.log(`   Length: ${securePassword.length} characters`);
console.log(`   Complexity: ✅ Uppercase, Lowercase, Numbers, Symbols`);

console.log('\n🔑 Password Security Features:');
console.log('   ✅ Cryptographically random');
console.log('   ✅ 20 characters long');
console.log('   ✅ Meets all complexity requirements');
console.log('   ✅ Suitable for production use');

console.log('\n📋 Backup Codes (for MFA):');
backupCodes.forEach((code, index) => {
  console.log(`   ${index + 1}. ${code}`);
});

console.log('\n⚠️  SECURITY NOTES:');
console.log('   1. Store this password securely');
console.log('   2. Don\'t share it in plain text');
console.log('   3. Consider implementing MFA');
console.log('   4. Rotate password every 90 days');
console.log('   5. Use different passwords for different services');

console.log('\n🎯 Next Steps:');
console.log('   1. Update admin password in database');
console.log('   2. Test login with new password');
console.log('   3. Store password securely');
console.log('   4. Consider implementing MFA');
