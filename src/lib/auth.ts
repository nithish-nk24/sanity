"use server";

import { auth, signIn, signOut } from "@/auth";
import { UserSession } from "./types";
import { authenticateUser, checkRateLimit } from "./auth-utils";

export const login = async (username: string, password: string) => {
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
    const rateLimitResult = await checkRateLimit(username);
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
      // Return success with user data - no redirect needed
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
};

export const logout = async () => {
  return await signOut({ redirectTo: "/admin" });
};

export const authSession = async (): Promise<UserSession | null> => {
  try {
    const session = await auth();
    return session as UserSession | null;
  } catch (error) {
    console.error("Failed to authenticate session", error);
    return null;
  }
};

// New secure authentication functions
export const secureLogin = async (username: string, password: string) => {
  return await authenticateUser(username, password);
};

export const validateCredentials = async (username: string, password: string): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  if (!username || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  }
  
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
