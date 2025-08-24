"use server";

import bcrypt from "bcryptjs";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { validateInput, validateForm } from "@/lib/validation";

// Security constants
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// User queries
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

const USER_BY_ID_QUERY = `*[_type == "user" && _id == $id][0]{
  _id,
  username,
  email,
  name,
  role,
  isActive,
  lastLogin,
  permissions
}`;

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const validatePassword = async (password: string): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  // Use the new validation system
  const passwordValidation = validateInput(password, 'password', { required: true });
  
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.error || 'Password validation failed');
    return { isValid: false, errors };
  }
  
  // Additional password strength requirements
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// User management
export const createUser = async (userData: {
  username: string;
  email: string;
  name: string;
  password: string;
  role: string;
  permissions?: string[];
}) => {
  try {
    // Comprehensive form validation
    const validationRules = {
      username: { type: 'username' as const, required: true },
      email: { type: 'email' as const, required: true },
      name: { type: 'name' as const, required: true },
      password: { type: 'password' as const, required: true }
    };
    
    const formValidation = validateForm(userData, validationRules);
    if (!formValidation.isValid) {
      return {
        success: false,
        error: "Form validation failed",
        details: Object.values(formValidation.errors)
      };
    }
    
    // Validate password strength
    const passwordValidation = await validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: "Password validation failed",
        details: passwordValidation.errors
      };
    }

    // Check if username already exists
    const existingUser = await client.fetch(USER_BY_USERNAME_QUERY, { 
      username: userData.username 
    });
    
    if (existingUser) {
      return {
        success: false,
        error: "Username already exists"
      };
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user with sanitized data
    const newUser = {
      _type: "user",
      username: formValidation.sanitizedData.username,
      email: formValidation.sanitizedData.email,
      name: formValidation.sanitizedData.name,
      passwordHash,
      role: userData.role,
      isActive: true,
      loginAttempts: 0,
      permissions: userData.permissions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await writeClient.create(newUser);

    return {
      success: true,
      user: {
        _id: result._id,
        username: result.username,
        email: result.email,
        name: result.name,
        role: result.role,
        permissions: result.permissions
      }
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Failed to create user"
    };
  }
};

export const authenticateUser = async (username: string, password: string) => {
  try {
    // Get user by username
    const user = await client.fetch(USER_BY_USERNAME_QUERY, { username });
    
    if (!user) {
      return {
        success: false,
        error: "Invalid credentials"
      };
    }

    // Check if account is active
    if (!user.isActive) {
      return {
        success: false,
        error: "Account is deactivated"
      };
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const lockoutTime = new Date(user.lockedUntil);
      const remainingTime = Math.ceil((lockoutTime.getTime() - Date.now()) / 1000 / 60);
      return {
        success: false,
        error: `Account is locked. Try again in ${remainingTime} minutes`
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      // Increment failed login attempts
      const newLoginAttempts = (user.loginAttempts || 0) + 1;
      let lockedUntil = null;
      
      if (newLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCKOUT_DURATION).toISOString();
      }

      await writeClient
        .patch(user._id)
        .set({
          loginAttempts: newLoginAttempts,
          lockedUntil,
          updatedAt: new Date().toISOString()
        })
        .commit();

      if (newLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        return {
          success: false,
          error: `Account locked due to too many failed attempts. Try again in ${Math.ceil(LOCKOUT_DURATION / 1000 / 60)} minutes`
        };
      }

      return {
        success: false,
        error: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newLoginAttempts} attempts remaining`
      };
    }

    // Reset login attempts and update last login
    await writeClient
      .patch(user._id)
      .set({
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .commit();

    return {
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || []
      }
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      success: false,
      error: "Authentication failed"
    };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await client.fetch(USER_BY_ID_QUERY, { id });
    if (!user) {
      return null;
    }
    
    // Don't return sensitive information
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserPassword = async (userId: string, newPassword: string) => {
  try {
    // Validate new password
    const passwordValidation = await validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: "Password validation failed",
        details: passwordValidation.errors
      };
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user
    await writeClient
      .patch(userId)
      .set({
        passwordHash,
        updatedAt: new Date().toISOString()
      })
      .commit();

    return {
      success: true,
      message: "Password updated successfully"
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: "Failed to update password"
    };
  }
};

export const deactivateUser = async (userId: string) => {
  try {
    await writeClient
      .patch(userId)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString()
      })
      .commit();

    return {
      success: true,
      message: "User deactivated successfully"
    };
  } catch (error) {
    console.error("Error deactivating user:", error);
    return {
      success: false,
      error: "Failed to deactivate user"
    };
  }
};

// Permission checking
export const hasPermission = async (userPermissions: string[], requiredPermission: string): Promise<boolean> => {
  return userPermissions.includes(requiredPermission);
};

export const hasRole = async (userRole: string, requiredRole: string): Promise<boolean> => {
  const roleHierarchy = {
    admin: 4,
    editor: 3,
    author: 2,
    viewer: 1
  };
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy];
};

// Rate limiting (simple in-memory implementation - consider Redis for production)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const checkRateLimit = async (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): Promise<boolean> => {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);
  
  if (!attempts || now - attempts.lastAttempt > windowMs) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (attempts.count >= maxAttempts) {
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  return true;
};
