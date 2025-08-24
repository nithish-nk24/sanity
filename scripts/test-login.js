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

// Simulate the authenticateUser function
async function authenticateUser(username, password) {
  try {
    console.log(`🔐 Authenticating user: ${username}`);
    
    // Get user by username (same query as auth-utils)
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
    
    const user = await client.fetch(USER_BY_USERNAME_QUERY, { username });
    
    if (!user) {
      console.log("❌ User not found");
      return {
        success: false,
        error: "Invalid credentials"
      };
    }

    console.log(`✅ User found: ${user.username} (${user.role})`);

    // Check if account is active
    if (!user.isActive) {
      console.log("❌ Account is deactivated");
      return {
        success: false,
        error: "Account is deactivated"
      };
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const lockoutTime = new Date(user.lockedUntil);
      const remainingTime = Math.ceil((lockoutTime.getTime() - Date.now()) / 1000 / 60);
      console.log(`❌ Account is locked for ${remainingTime} minutes`);
      return {
        success: false,
        error: `Account is locked. Try again in ${remainingTime} minutes`
      };
    }

    // Verify password
    console.log("🔑 Verifying password...");
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      console.log("❌ Password verification failed");
      return {
        success: false,
        error: "Invalid credentials"
      };
    }

    console.log("✅ Password verification successful");
    
    return {
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    };
    
  } catch (error) {
    console.error("❌ Authentication error:", error);
    return {
      success: false,
      error: "Authentication failed"
    };
  }
}

// Simulate the checkRateLimit function
function checkRateLimit(identifier) {
  console.log(`🔄 Checking rate limit for: ${identifier}`);
  // Simple implementation - always return true for testing
  return true;
}

// Simulate the login function
async function login(username, password) {
  console.log("🔐 Login function called with username:", username);
  
  try {
    // Input validation
    if (!username || !password) {
      console.log("❌ Missing username or password");
      return {
        success: false,
        error: "Username and password are required"
      };
    }

    console.log("✅ Input validation passed");
    
    // Check rate limiting
    console.log("🔄 Checking rate limit...");
    const rateLimitResult = checkRateLimit(username);
    console.log("📊 Rate limit result:", rateLimitResult);
    
    if (!rateLimitResult) {
      console.log("❌ Rate limit exceeded");
      return {
        success: false,
        error: "Too many login attempts. Please try again later."
      };
    }

    console.log("✅ Rate limit check passed");

    // Authenticate user with secure system
    console.log("🔑 Authenticating user...");
    const authResult = await authenticateUser(username, password);
    console.log("🔐 Authentication result:", authResult);
    
    if (authResult && authResult.success) {
      console.log("✅ Authentication successful");
      return {
        success: true,
        user: authResult.user,
        message: "Login successful"
      };
    } else {
      console.log("❌ Authentication failed:", authResult?.error || "Unknown error");
      return {
        success: false,
        error: authResult?.error || "Authentication failed"
      };
    }
  } catch (error) {
    console.error("❌ Login function error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login"
    };
  }
}

// Test the login function
async function testLogin() {
  console.log("🧪 Testing login function...\n");
  
  // Test 1: Valid credentials
  console.log("1️⃣ Test with valid credentials:");
  const result1 = await login("admin", "Admin@2024!");
  console.log("Result:", result1);
  
  // Test 2: Invalid credentials
  console.log("\n2️⃣ Test with invalid credentials:");
  const result2 = await login("admin", "wrongpassword");
  console.log("Result:", result2);
  
  // Test 3: Missing credentials
  console.log("\n3️⃣ Test with missing credentials:");
  const result3 = await login("", "");
  console.log("Result:", result3);
  
  console.log("\n✅ Login function test completed");
}

testLogin();
