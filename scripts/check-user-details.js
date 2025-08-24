#!/usr/bin/env node

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function checkUserDetails() {
  try {
    console.log('🔍 Checking admin user details...\n');
    
    // Get detailed user information
    const user = await client.fetch(`*[_type == "user" && username == "admin"][0]{
      _id,
      username,
      email,
      name,
      role,
      isActive,
      passwordHash,
      permissions,
      createdAt,
      updatedAt,
      lastLogin,
      loginAttempts,
      lockedUntil
    }`);
    
    if (user) {
      console.log('📋 User Details:');
      console.log(`   ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Password Hash: ${user.passwordHash ? '✅ Set' : '❌ Missing'}`);
      console.log(`   Permissions: ${user.permissions?.join(', ') || 'None'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Updated: ${user.updatedAt}`);
      console.log(`   Last Login: ${user.lastLogin || 'Never'}`);
      console.log(`   Login Attempts: ${user.loginAttempts || 0}`);
      console.log(`   Locked Until: ${user.lockedUntil || 'Not locked'}`);
      
      if (!user.passwordHash) {
        console.log('\n❌ PROBLEM: User has no password hash!');
        console.log('   This is why authentication is failing.');
        console.log('\n🔧 Solution: You need to set a password for this user.');
        console.log('   You can either:');
        console.log('   1. Use the password setup page (if available)');
        console.log('   2. Update the user directly in Sanity Studio');
        console.log('   3. Run a script to set the password');
      }
      
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUserDetails();
