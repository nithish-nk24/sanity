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

async function checkUsers() {
  try {
    console.log('🔍 Checking for users in Sanity database...\n');
    
    // Check if user schema exists
    const userSchema = await client.fetch('*[_type == "sanity.imageAsset"][0]');
    console.log('✅ Sanity client connection successful');
    
    // Query for users
    const users = await client.fetch('*[_type == "user"]');
    console.log(`📊 Found ${users.length} user(s) in database`);
    
    if (users.length === 0) {
      console.log('\n❌ No users found. Creating admin user...');
      
      // Create admin user
      const adminUser = {
        _type: 'user',
        username: 'admin',
        email: 'admin@cyfotok.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        permissions: [
          'create:blog',
          'edit:blog', 
          'delete:blog',
          'manage:users',
          'view:analytics',
          'export:data'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Note: We can't create the password hash here without bcrypt
      // The user will need to set their password through the web interface
      console.log('⚠️  Note: User created without password. You need to:');
      console.log('   1. Go to /admin/setup-password');
      console.log('   2. Set the admin password');
      console.log('   3. Then login with username: admin');
      
      const result = await client.create(adminUser);
      console.log(`✅ Admin user created with ID: ${result._id}`);
      
    } else {
      console.log('\n📋 Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.role}) - Active: ${user.isActive}`);
      });
    }
    
    // Check environment variables
    console.log('\n🔧 Environment Check:');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log(`   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION}`);
    console.log(`   Write Token: ${process.env.SANITY_WRITE_TOKEN ? '✅ Set' : '❌ Missing'}`);
    
    // Test authentication query
    console.log('\n🧪 Testing authentication query...');
    try {
      const testUser = await client.fetch('*[_type == "user" && username == "admin"][0]');
      if (testUser) {
        console.log('✅ Authentication query successful');
        console.log(`   User found: ${testUser.username} (${testUser.role})`);
      } else {
        console.log('❌ Authentication query failed - no admin user found');
      }
    } catch (error) {
      console.log('❌ Authentication query error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔑 Authentication failed. Check your SANITY_WRITE_TOKEN');
    } else if (error.message.includes('404')) {
      console.log('\n🌐 Project not found. Check your NEXT_PUBLIC_SANITY_PROJECT_ID');
    } else if (error.message.includes('dataset')) {
      console.log('\n📁 Dataset not found. Check your NEXT_PUBLIC_SANITY_DATASET');
    }
  }
}

checkUsers();
