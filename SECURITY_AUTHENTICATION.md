# 🔐 Secure Authentication System

This document outlines the new secure authentication system that replaces the hardcoded credentials vulnerability.

## 🚨 **Security Fixes Implemented**

### ✅ **Removed Hardcoded Credentials**
- **Before**: Username `cyfotokTeam` and password `Cyfotok/24` were hardcoded in source code
- **After**: Secure user management system with hashed passwords stored in database

### ✅ **Password Security**
- **Bcrypt hashing** with 12 salt rounds
- **Strong password validation** (8+ chars, uppercase, lowercase, numbers, special chars)
- **No plain text passwords** stored anywhere

### ✅ **Account Protection**
- **Rate limiting** on login attempts
- **Account lockout** after 5 failed attempts (15-minute lockout)
- **Failed attempt tracking** with automatic reset on success

### ✅ **User Management**
- **Role-based access control** (Admin, Editor, Author, Viewer)
- **Granular permissions** for specific actions
- **Account status management** (active/inactive)

## 🏗️ **System Architecture**

### **Database Schema**
```typescript
// User document structure
{
  _id: string,
  username: string,        // Unique login identifier
  email: string,           // User's email address
  name: string,            // Full name
  passwordHash: string,    // Bcrypt hashed password
  role: "admin" | "editor" | "author" | "viewer",
  isActive: boolean,       // Account status
  lastLogin: datetime,     // Last successful login
  loginAttempts: number,   // Failed attempts counter
  lockedUntil: datetime,   // Account lockout timestamp
  permissions: string[],    // Custom permissions array
  createdAt: datetime,
  updatedAt: datetime
}
```

### **Security Layers**
1. **Input Validation** - Client and server-side validation
2. **Rate Limiting** - Prevents brute force attacks
3. **Password Hashing** - Bcrypt with high salt rounds
4. **Account Lockout** - Temporary suspension after failed attempts
5. **Session Management** - Secure session handling
6. **Permission Checking** - Role and permission-based access control

## 🚀 **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install bcryptjs @types/bcryptjs
```

### **2. Deploy Sanity Schema**
```bash
npx sanity deploy
```

### **3. Create Initial Admin User**
```bash
node scripts/setup-admin.js
```

### **4. Set Admin Password**
- Start your development server: `npm run dev`
- Navigate to `/admin`
- Use the password reset functionality to set the admin password

## 🔧 **Usage Examples**

### **User Authentication**
```typescript
import { login, secureLogin } from "@/lib/auth";

// Standard login (with GitHub OAuth redirect)
const result = await login(username, password);

// Direct authentication (returns user object)
const authResult = await secureLogin(username, password);
```

### **Permission Checking**
```typescript
import { hasPermission, hasRole } from "@/lib/auth-utils";

// Check specific permission
if (hasPermission(user.permissions, "create:blog")) {
  // User can create blogs
}

// Check role hierarchy
if (hasRole(user.role, "editor")) {
  // User has editor or higher role
}
```

### **Creating New Users**
```typescript
import { createUser } from "@/lib/auth-utils";

const newUser = await createUser({
  username: "editor1",
  email: "editor@example.com",
  name: "John Editor",
  password: "SecurePass123!",
  role: "editor",
  permissions: ["create:blog", "edit:blog"]
});
```

## 🛡️ **Security Features**

### **Password Requirements**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### **Account Lockout**
- **5 failed attempts** trigger lockout
- **15-minute lockout** duration
- **Automatic reset** on successful login
- **Attempt counter** tracking

### **Rate Limiting**
- **Per-username** rate limiting
- **15-minute window** for attempts
- **5 attempts maximum** per window
- **Automatic cleanup** of expired attempts

### **Session Security**
- **Secure cookies** with proper flags
- **Session timeout** after 24 hours
- **CSRF protection** via NextAuth.js
- **Secure redirects** to prevent open redirects

## 🔍 **Monitoring & Logging**

### **Security Events Logged**
- Login attempts (success/failure)
- Account lockouts
- Password changes
- User creation/deactivation
- Permission changes

### **Audit Trail**
- All authentication events timestamped
- User actions tracked with user ID
- Failed attempts logged with IP context
- Account status changes recorded

## 🚨 **Security Best Practices**

### **For Developers**
1. **Never log passwords** or sensitive data
2. **Use environment variables** for all secrets
3. **Validate all inputs** on both client and server
4. **Implement proper error handling** without information leakage
5. **Regular security audits** of authentication flows

### **For Administrators**
1. **Regular password rotation** for admin accounts
2. **Monitor failed login attempts**
3. **Review user permissions** regularly
4. **Deactivate unused accounts**
5. **Keep dependencies updated**

### **For Users**
1. **Use strong, unique passwords**
2. **Never share credentials**
3. **Log out from shared devices**
4. **Report suspicious activity**
5. **Enable 2FA when available**

## 🔄 **Migration from Old System**

### **What Changed**
- ❌ Hardcoded credentials removed
- ❌ Simple boolean login response removed
- ✅ Secure password hashing implemented
- ✅ User management system added
- ✅ Role-based access control added
- ✅ Account protection features added

### **Breaking Changes**
- Login function now returns object with `success` and `user` properties
- Username field changed from `userId` to `username`
- Password requirements are now enforced
- Account lockout after failed attempts

### **Update Required**
- Update any code that calls the old `login` function
- Update form field names from `userId` to `username`
- Handle new response format from authentication functions
- Implement proper error handling for new error messages

## 🧪 **Testing Security**

### **Test Cases**
1. **Valid login** with correct credentials
2. **Invalid login** with wrong password
3. **Account lockout** after 5 failed attempts
4. **Rate limiting** for rapid login attempts
5. **Password validation** for weak passwords
6. **Permission checking** for different user roles
7. **Session management** and timeout
8. **CSRF protection** for forms

### **Security Testing Tools**
- **OWASP ZAP** for vulnerability scanning
- **Burp Suite** for manual testing
- **Postman** for API testing
- **Browser DevTools** for client-side security

## 📚 **Additional Resources**

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Bcrypt Security](https://en.wikipedia.org/wiki/Bcrypt)
- [NextAuth.js Security](https://next-auth.js.org/configuration/security)
- [Sanity Security Best Practices](https://www.sanity.io/docs/security)

## 🆘 **Support & Issues**

If you encounter any issues with the new authentication system:

1. **Check the logs** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Ensure Sanity schema** is deployed and up to date
4. **Check user permissions** and role assignments
5. **Review rate limiting** and lockout settings

For security-related issues, please report them immediately and do not post sensitive information in public channels.

---

**⚠️ Security Notice**: This system implements industry-standard security practices. However, security is an ongoing process. Regular updates, monitoring, and audits are essential for maintaining a secure environment.
