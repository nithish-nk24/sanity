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

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetting admin password...\n');
    
    // New password to set - Much more secure
    const newPassword = ';37T%2KTa1(LCCh}OGAh';
    
    // Hash the new password
    console.log('🔑 Hashing new password...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    console.log('✅ Password hashed successfully');
    
    // Find the admin user
    console.log('🔍 Finding admin user...');
    const adminUser = await client.fetch('*[_type == "user" && username == "admin"][0]');
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log(`✅ Admin user found: ${adminUser.username} (${adminUser.role})`);
    
    // Update the password
    console.log('📝 Updating password...');
    const result = await client
      .patch(adminUser._id)
      .set({
        passwordHash,
        updatedAt: new Date().toISOString()
      })
      .commit();
    
    console.log('✅ Password updated successfully');
    console.log(`\n🔑 New login credentials:`);
    console.log(`   Username: admin`);
    console.log(`   Password: ${newPassword}`);
    console.log(`\n⚠️  IMPORTANT: Save this password securely!`);
    console.log(`   You can now login with these credentials.`);
    
    // Test the new password
    console.log('\n🧪 Testing new password...');
    const isPasswordValid = await bcrypt.compare(newPassword, passwordHash);
    if (isPasswordValid) {
      console.log('✅ Password verification successful');
    } else {
      console.log('❌ Password verification failed');
    }
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  }
}

resetAdminPassword();
