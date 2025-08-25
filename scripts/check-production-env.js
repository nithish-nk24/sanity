#!/usr/bin/env node

console.log('🔍 Production Environment Check Script\n');

// Check if we're in a production-like environment
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.VERCEL_ENV === 'production' ||
                    process.env.RAILWAY_ENVIRONMENT === 'production' ||
                    process.env.HEROKU_APP_NAME ||
                    process.env.AWS_LAMBDA_FUNCTION_NAME;

console.log('🌍 Environment Detection:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('   VERCEL_ENV:', process.env.VERCEL_ENV || 'Not set');
console.log('   RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'Not set');
console.log('   HEROKU_APP_NAME:', process.env.HEROKU_APP_NAME || 'Not set');
console.log('   AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME || 'Not set');
console.log('   Is Production:', isProduction ? '✅ Yes' : '❌ No');

console.log('\n📋 Critical Environment Variables:');
console.log('   NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('   NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET ? '✅ Set' : '❌ Missing');
console.log('   NEXT_PUBLIC_SANITY_API_VERSION:', process.env.NEXT_PUBLIC_SANITY_API_VERSION ? '✅ Set' : '❌ Missing');
console.log('   SANITY_WRITE_TOKEN:', process.env.SANITY_WRITE_TOKEN ? '✅ Set' : '❌ Missing');
console.log('   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing');
console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing');

console.log('\n🔧 NextAuth Configuration:');
console.log('   NEXTAUTH_URL Value:', process.env.NEXTAUTH_URL || 'Not set');
console.log('   NEXTAUTH_SECRET Length:', process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.length : 'Not set');

console.log('\n🌐 Sanity Configuration:');
console.log('   Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'Not set');
console.log('   Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'Not set');
console.log('   API Version:', process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'Not set');
console.log('   Write Token Length:', process.env.SANITY_WRITE_TOKEN ? process.env.SANITY_WRITE_TOKEN.length : 'Not set');

// Check for common production issues
console.log('\n⚠️  Common Production Issues:');
if (!process.env.NEXTAUTH_URL) {
  console.log('   ❌ NEXTAUTH_URL is missing - NextAuth will fail');
} else if (process.env.NEXTAUTH_URL.includes('localhost')) {
  console.log('   ⚠️  NEXTAUTH_URL contains localhost - may cause issues in production');
} else {
  console.log('   ✅ NEXTAUTH_URL is properly configured for production');
}

if (!process.env.NEXTAUTH_SECRET) {
  console.log('   ❌ NEXTAUTH_SECRET is missing - NextAuth will fail');
} else if (process.env.NEXTAUTH_SECRET.length < 32) {
  console.log('   ⚠️  NEXTAUTH_SECRET is too short (should be 32+ characters)');
} else {
  console.log('   ✅ NEXTAUTH_SECRET is properly configured');
}

if (!process.env.SANITY_WRITE_TOKEN) {
  console.log('   ❌ SANITY_WRITE_TOKEN is missing - authentication will fail');
} else {
  console.log('   ✅ SANITY_WRITE_TOKEN is set');
}

console.log('\n🎯 Next Steps:');
if (!process.env.NEXTAUTH_URL || !process.env.NEXTAUTH_SECRET || !process.env.SANITY_WRITE_TOKEN) {
  console.log('   1. Set missing environment variables in your production environment');
  console.log('   2. Ensure NEXTAUTH_URL matches your production domain');
  console.log('   3. Generate a strong NEXTAUTH_SECRET (32+ characters)');
  console.log('   4. Verify SANITY_WRITE_TOKEN has correct permissions');
} else {
  console.log('   ✅ All critical environment variables are set');
  console.log('   🔍 Check Sanity Studio for user data and permissions');
  console.log('   📝 Verify the admin user exists in production database');
}

console.log('\n📚 Documentation:');
console.log('   - NextAuth Environment Variables: https://next-auth.js.org/configuration/options');
console.log('   - Sanity Environment Variables: https://www.sanity.io/docs/environment-variables');
console.log('   - Vercel Environment Variables: https://vercel.com/docs/projects/environment-variables');

