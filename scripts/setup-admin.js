#!/usr/bin/env node

/**
 * Setup script to create the initial admin user
 * Run this script after setting up your Sanity project
 * 
 * Usage: node scripts/setup-admin.js
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-27',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Admin user configuration
const ADMIN_USER = {
  username: 'admin',
  email: 'admin@cyfotok.com',
  name: 'Cyfotok Admin',
  role: 'admin',
  permissions: [
    'create:blog',
    'edit:blog', 
    'delete:blog',
    'manage:users',
    'view:analytics',
    'export:data'
  ]
};

async function createAdminUser() {
  try {
    console.log('🚀 Setting up initial admin user...');
    
    // Check if admin user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && username == $username][0]`,
      { username: ADMIN_USER.username }
    );

    if (existingUser) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user (password will be set via the web interface)
    const newUser = {
      _type: 'user',
      username: ADMIN_USER.username,
      email: ADMIN_USER.email,
      name: ADMIN_USER.name,
      passwordHash: '', // This will be set when admin changes password
      role: ADMIN_USER.role,
      isActive: true,
      loginAttempts: 0,
      permissions: ADMIN_USER.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await client.create(newUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📝 User ID:', result._id);
    console.log('👤 Username:', ADMIN_USER.username);
    console.log('🔑 Role:', ADMIN_USER.role);
    console.log('');
    console.log('⚠️  IMPORTANT: Set the admin password through the web interface');
    console.log('   The admin user cannot login until a password is set');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Go to /admin in your browser');
    console.log('   3. Use the password reset functionality to set admin password');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the setup
createAdminUser();
