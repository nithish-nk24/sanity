#!/usr/bin/env node

const { createClient } = require('@sanity/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Production Authentication Debug Script\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('   NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('   NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET ? '✅ Set' : '❌ Missing');
console.log('   NEXT_PUBLIC_SANITY_API_VERSION:', process.env.NEXT_PUBLIC_SANITY_API_VERSION ? '✅ Set' : '❌ Missing');
console.log('   SANITY_WRITE_TOKEN:', process.env.SANITY_WRITE_TOKEN ? '✅ Set' : '❌ Missing');
console.log('   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing');
console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing');

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function debugProductionAuth() {
  try {
    console.log('\n🔌 Testing Sanity Connection...');
    
    // Test basic connection
    const projectInfo = await client.fetch('*[_type == "sanity.imageAsset"][0]');
    console.log('✅ Sanity connection successful');
    
    // Find admin user
    console.log('\n👤 Looking for admin user...');
    const adminUser = await client.fetch('*[_type == "user" && username == "admin"][0]');
    
    if (!adminUser) {
      console.log('❌ Admin user not found in database');
      return;
    }
    
    console.log('✅ Admin user found:', {
      _id: adminUser._id,
      username: adminUser.username,
      role: adminUser.role,
      hasPasswordHash: !!adminUser.passwordHash,
      passwordHashLength: adminUser.passwordHash ? adminUser.passwordHash.length : 0,
      updatedAt: adminUser.updatedAt
    });
    
    // Test password verification
    console.log('\n🔐 Testing password verification...');
    const testPassword = ';37T%2KTa1(LCCh}OGAh';
    
    if (!adminUser.passwordHash) {
      console.log('❌ No password hash found for admin user');
      return;
    }
    
    const isPasswordValid = await bcrypt.compare(testPassword, adminUser.passwordHash);
    console.log('✅ Password verification:', isPasswordValid ? 'SUCCESS' : 'FAILED');
    
    if (isPasswordValid) {
      console.log('\n🎯 Authentication should work with:');
      console.log(`   Username: admin`);
      console.log(`   Password: ${testPassword}`);
    } else {
      console.log('\n❌ Password verification failed. Possible issues:');
      console.log('   1. Password hash in database is incorrect');
      console.log('   2. Password was changed after reset');
      console.log('   3. Database sync issues');
    }
    
    // Check for other users
    console.log('\n👥 Checking for other users...');
    const allUsers = await client.fetch('*[_type == "user"]');
    console.log(`   Total users found: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.role}) - Has password: ${!!user.passwordHash}`);
    });
    
  } catch (error) {
    console.error('❌ Error during debug:', error.message);
    console.error('   Stack:', error.stack);
    
    if (error.message.includes('Unauthorized')) {
      console.log('\n🔑 Authentication Error: Check your SANITY_WRITE_TOKEN');
    } else if (error.message.includes('Project not found')) {
      console.log('\n🏗️  Project Error: Check your NEXT_PUBLIC_SANITY_PROJECT_ID');
    } else if (error.message.includes('Dataset not found')) {
      console.log('\n📊 Dataset Error: Check your NEXT_PUBLIC_SANITY_DATASET');
    }
  }
}

debugProductionAuth();
