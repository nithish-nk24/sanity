#!/usr/bin/env node

const { createClient } = require('@sanity/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function testAuthentication() {
  try {
    console.log('🧪 Testing authentication flow...\n');
    
    // Test 1: Check environment variables
    console.log('1️⃣ Environment Variables Check:');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log(`   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION}`);
    console.log(`   Write Token: ${process.env.SANITY_WRITE_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`   CSRF_SECRET: ${process.env.CSRF_SECRET ? '✅ Set' : '❌ Missing'}`);
    
    // Test 2: Check Sanity connection
    console.log('\n2️⃣ Sanity Connection Test:');
    try {
      const testQuery = await client.fetch('*[_type == "user"][0]');
      console.log('   ✅ Sanity connection successful');
      console.log(`   ✅ Found user: ${testQuery.username}`);
    } catch (error) {
      console.log('   ❌ Sanity connection failed:', error.message);
      return;
    }
    
    // Test 3: Check user query (same as auth-utils)
    console.log('\n3️⃣ User Query Test (Auth Utils):');
    const USER_BY_USERNAME_QUERY = `*[_type == "user" && username == $username][0]{
      _id,
      username,
      email,
      name,
      passwordHash,
      role,
      isActive,
      lastLogin,
      loginAttempts,
      lockedUntil,
      permissions
    }`;
    
    try {
      const user = await client.fetch(USER_BY_USERNAME_QUERY, { username: 'admin' });
      if (user) {
        console.log('   ✅ User query successful');
        console.log(`   ✅ User found: ${user.username} (${user.role})`);
        console.log(`   ✅ Active: ${user.isActive}`);
        console.log(`   ✅ Password Hash: ${user.passwordHash ? 'Set' : 'Missing'}`);
        console.log(`   ✅ Locked: ${user.lockedUntil ? 'Yes' : 'No'}`);
        console.log(`   ✅ Login Attempts: ${user.loginAttempts || 0}`);
      } else {
        console.log('   ❌ User not found');
        return;
      }
    } catch (error) {
      console.log('   ❌ User query failed:', error.message);
      return;
    }
    
    // Test 4: Test password verification
    console.log('\n4️⃣ Password Verification Test:');
    const testPassword = 'admin123'; // This is just for testing
    
    try {
      const user = await client.fetch(USER_BY_USERNAME_QUERY, { username: 'admin' });
      if (user.passwordHash) {
        const isPasswordValid = await bcrypt.compare(testPassword, user.passwordHash);
        console.log(`   ✅ Password verification working`);
        console.log(`   ✅ Test password match: ${isPasswordValid ? 'Yes' : 'No'}`);
        console.log(`   ✅ Hash length: ${user.passwordHash.length} characters`);
      } else {
        console.log('   ❌ No password hash found');
      }
    } catch (error) {
      console.log('   ❌ Password verification failed:', error.message);
    }
    
    // Test 5: Check for common issues
    console.log('\n5️⃣ Common Issues Check:');
    
    // Check if user is locked
    const user = await client.fetch(USER_BY_USERNAME_QUERY, { username: 'admin' });
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      console.log('   ❌ User account is locked');
      const lockoutTime = new Date(user.lockedUntil);
      const remainingTime = Math.ceil((lockoutTime.getTime() - Date.now()) / 1000 / 60);
      console.log(`   ⏰ Locked until: ${lockoutTime.toISOString()}`);
      console.log(`   ⏰ Remaining time: ${remainingTime} minutes`);
    } else {
      console.log('   ✅ User account is not locked');
    }
    
    // Check login attempts
    if (user.loginAttempts >= 5) {
      console.log('   ❌ Too many failed login attempts');
      console.log(`   🔢 Failed attempts: ${user.loginAttempts}`);
    } else {
      console.log('   ✅ Login attempts within limit');
    }
    
    // Test 6: Production vs Development check
    console.log('\n6️⃣ Environment Check:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
    console.log(`   Current working directory: ${process.cwd()}`);
    
    // Check if .env.local exists
    const fs = require('fs');
    const envLocalExists = fs.existsSync('.env.local');
    console.log(`   .env.local exists: ${envLocalExists ? '✅ Yes' : '❌ No'}`);
    
    if (envLocalExists) {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      const hasSanityVars = envContent.includes('NEXT_PUBLIC_SANITY_PROJECT_ID') && 
                           envContent.includes('SANITY_WRITE_TOKEN');
      console.log(`   Sanity variables in .env.local: ${hasSanityVars ? '✅ Yes' : '❌ No'}`);
    }
    
    console.log('\n🎯 Summary:');
    console.log('   If all tests pass above, the issue might be:');
    console.log('   1. Production environment variables not set correctly');
    console.log('   2. Build process not including .env.local');
    console.log('   3. Different Sanity project/dataset in production');
    console.log('   4. Authentication flow differences in production build');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthentication();
