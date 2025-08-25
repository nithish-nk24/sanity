#!/usr/bin/env node

console.log('🔍 NextAuth URL Configuration Checker\n');

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

if (!NEXTAUTH_URL) {
  console.log('❌ NEXTAUTH_URL is not set!');
  console.log('\n🎯 You need to set this environment variable.');
  console.log('\n📋 Examples:');
  console.log('   Local: NEXTAUTH_URL=http://localhost:3000');
  console.log('   Vercel: NEXTAUTH_URL=https://myapp.vercel.app');
  console.log('   Railway: NEXTAUTH_URL=https://myapp.railway.app');
  console.log('   Custom: NEXTAUTH_URL=https://myapp.com');
  return;
}

console.log('✅ NEXTAUTH_URL is set:', NEXTAUTH_URL);

// Check if it's a valid URL
try {
  const url = new URL(NEXTAUTH_URL);
  console.log('✅ Valid URL format');
  console.log('   Protocol:', url.protocol);
  console.log('   Hostname:', url.hostname);
  console.log('   Port:', url.port || 'default');
  
  // Check for common issues
  if (url.protocol === 'http:' && url.hostname !== 'localhost') {
    console.log('⚠️  Warning: Using HTTP instead of HTTPS in production');
  }
  
  if (url.hostname === 'localhost' && url.hostname !== 'localhost') {
    console.log('⚠️  Warning: localhost in production environment');
  }
  
  if (NEXTAUTH_URL.endsWith('/')) {
    console.log('⚠️  Warning: URL ends with trailing slash');
  }
  
} catch (error) {
  console.log('❌ Invalid URL format:', error.message);
  return;
}

// Check environment context
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.VERCEL_ENV === 'production' ||
                    process.env.RAILWAY_ENVIRONMENT === 'production';

console.log('\n🌍 Environment Context:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('   VERCEL_ENV:', process.env.VERCEL_ENV || 'Not set');
console.log('   RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'Not set');
console.log('   Is Production:', isProduction ? '✅ Yes' : '❌ No');

// Production-specific checks
if (isProduction) {
  console.log('\n🚀 Production Environment Checks:');
  
  if (NEXTAUTH_URL.includes('localhost')) {
    console.log('   ❌ ERROR: localhost in production NEXTAUTH_URL');
    console.log('   🎯 Fix: Set to your production domain');
  } else if (NEXTAUTH_URL.startsWith('http://')) {
    console.log('   ⚠️  Warning: HTTP in production (use HTTPS)');
  } else {
    console.log('   ✅ Production URL looks good');
  }
  
  // Suggest common production domains
  console.log('\n💡 Common Production Domain Patterns:');
  console.log('   Vercel: https://your-project.vercel.app');
  console.log('   Railway: https://your-project.railway.app');
  console.log('   Heroku: https://your-app.herokuapp.com');
  console.log('   Custom: https://yourdomain.com');
}

console.log('\n📚 NextAuth URL Documentation:');
console.log('   - https://next-auth.js.org/configuration/options#nextauth_url');
console.log('   - Must match your production domain exactly');
console.log('   - Include protocol (https://)');
console.log('   - No trailing slash');

