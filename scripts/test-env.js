#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing environment variables...\n');

// Check Sanity variables
console.log('📊 Sanity Configuration:');
console.log(`   NEXT_PUBLIC_SANITY_PROJECT_ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ Missing'}`);
console.log(`   NEXT_PUBLIC_SANITY_DATASET: ${process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ Missing'}`);
console.log(`   NEXT_PUBLIC_SANITY_API_VERSION: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '❌ Missing'}`);
console.log(`   SANITY_WRITE_TOKEN: ${process.env.SANITY_WRITE_TOKEN ? '✅ Set' : '❌ Missing'}`);

// Check auth variables
console.log('\n🔐 Authentication Configuration:');
console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || '❌ Missing'}`);
console.log(`   CSRF_SECRET: ${process.env.CSRF_SECRET ? '✅ Set' : '❌ Missing'}`);

// Check other important variables
console.log('\n⚙️  Other Configuration:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`   RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID || '❌ Missing'}`);
console.log(`   RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Missing'}`);

// Test dotenv loading
console.log('\n📁 File Loading:');
const fs = require('fs');
const envLocalExists = fs.existsSync('.env.local');
console.log(`   .env.local exists: ${envLocalExists ? '✅ Yes' : '❌ No'}`);

if (envLocalExists) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  console.log(`   Total environment variables: ${lines.length}`);
  
  // Check for specific variables
  const hasSanityProjectId = envContent.includes('NEXT_PUBLIC_SANITY_PROJECT_ID=');
  const hasSanityToken = envContent.includes('SANITY_WRITE_TOKEN=');
  const hasNextAuthSecret = envContent.includes('NEXTAUTH_SECRET=');
  
  console.log(`   Has Sanity Project ID: ${hasSanityProjectId ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has Sanity Token: ${hasSanityToken ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has NextAuth Secret: ${hasNextAuthSecret ? '✅ Yes' : '❌ No'}`);
}

console.log('\n✅ Environment test completed');
