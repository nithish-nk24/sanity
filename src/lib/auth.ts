"use server";

import { auth, signIn, signOut } from "@/auth";
import { UserSession } from "./types";
import { authenticateUser, checkRateLimit } from "./auth-utils";

export const login = async (username: string, password: string) => {
  try {
    // Check rate limiting
    if (!(await checkRateLimit(username))) {
      return {
        success: false,
        error: "Too many login attempts. Please try again later."
      };
    }

    // Authenticate user with secure system
    const authResult = await authenticateUser(username, password);
    
    if (authResult.success) {
      // Return success with user data - no redirect needed
      return {
        success: true,
        user: authResult.user,
        message: "Login successful"
      };
    } else {
      return {
        success: false,
        error: authResult.error
      };
    }
  } catch (error) {
    console.error("Login error:", error);
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
