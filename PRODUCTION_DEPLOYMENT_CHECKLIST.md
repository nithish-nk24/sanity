# 🚀 Production Deployment Checklist

## 🔒 **CRITICAL: Fix Authentication Issues First**

### **❌ Current Problem:**
- `CredentialsSignin` error in production
- NextAuth failing to authenticate users
- Missing environment variables in production

---

## 📋 **Step 1: Set Production Environment Variables**

### **🌐 NextAuth Configuration (REQUIRED):**
```bash
NEXTAUTH_URL=https://your-actual-domain.com
NEXTAUTH_SECRET=0,F7ho<8!u|RpUQ+=V?@XQ5JIpX-K+FR5]BOC,w.b_EF,bbYfFi[G,W|Z_iB;Y;i
```

### **🏗️ Sanity Configuration (REQUIRED):**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-08-24
SANITY_WRITE_TOKEN=your-actual-write-token
```

### **🔐 Security (REQUIRED):**
```bash
CSRF_SECRET=4R:r3czNt-pC274+l(p!=qoK^5lvuCHU$7iu5W?,mMrUpO11a}_[RqP%#BpbkcEKU8DVj:[^^IA413AIa+<9CCY!C;=yyoQ:m&r69p>VH)TH9mSQwZ(8F1i!R(@{e[7K
```

---

## 🎯 **Step 2: Platform-Specific Instructions**

### **Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. **Redeploy** your application

### **Railway:**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Go to **Variables** tab
4. Add each variable above
5. **Redeploy** your application

### **Heroku:**
```bash
heroku config:set NEXTAUTH_URL=https://your-domain.com
heroku config:set NEXTAUTH_SECRET=0,F7ho<8!u|RpUQ+=V?@XQ5JIpX-K+FR5]BOC,w.b_EF,bbYfFi[G,W|Z_iB;Y;i
heroku config:set SANITY_WRITE_TOKEN=your-token
# ... add all other variables
```

---

## 🔍 **Step 3: Verify Production Setup**

### **Check Environment Variables:**
```bash
# Run this in your production environment
node scripts/check-production-env.js
```

### **Test Authentication:**
1. Try to login with:
   - **Username:** `admin`
   - **Password:** `;37T%2KTa1(LCCh}OGAh`
2. Check production logs for authentication errors
3. Verify NextAuth is working

---

## 🚨 **Common Production Issues & Solutions**

### **Issue 1: "CredentialsSignin" Error**
**Cause:** Missing or incorrect environment variables
**Solution:** Set all required environment variables above

### **Issue 2: "Project not found" Error**
**Cause:** Wrong `NEXT_PUBLIC_SANITY_PROJECT_ID`
**Solution:** Verify project ID in Sanity dashboard

### **Issue 3: "Unauthorized" Error**
**Cause:** Invalid `SANITY_WRITE_TOKEN`
**Solution:** Generate new write token in Sanity dashboard

### **Issue 4: "Invalid redirect URI" Error**
**Cause:** Wrong `NEXTAUTH_URL`
**Solution:** Set to exact production domain (e.g., `https://myapp.com`)

---

## 📊 **Production Environment Variables Reference**

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `NEXTAUTH_URL` | ✅ | `https://myapp.com` | NextAuth base URL |
| `NEXTAUTH_SECRET` | ✅ | `64-char-secret` | JWT signing secret |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | `abc12345` | Sanity project ID |
| `SANITY_WRITE_TOKEN` | ✅ | `sk...` | Sanity write access |
| `CSRF_SECRET` | ✅ | `128-char-secret` | CSRF protection |

---

## 🔧 **Troubleshooting Commands**

### **Check Production Environment:**
```bash
node scripts/check-production-env.js
```

### **Test Authentication Locally:**
```bash
node scripts/test-auth.js
```

### **Reset Admin Password:**
```bash
node scripts/reset-admin-password.js
```

### **Generate New Secrets:**
```bash
node scripts/generate-secrets.js --env production
```

---

## ✅ **Deployment Checklist**

- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Set `NEXTAUTH_SECRET` (64+ characters)
- [ ] Set `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] Set `SANITY_WRITE_TOKEN`
- [ ] Set `CSRF_SECRET`
- [ ] Redeploy application
- [ ] Test login with admin credentials
- [ ] Check production logs for errors
- [ ] Verify NextAuth session creation

---

## 🎯 **Expected Result After Fix:**

✅ **Authentication works in production**
✅ **Admin can login successfully**
✅ **No more "CredentialsSignin" errors**
✅ **NextAuth sessions are created properly**
✅ **Dashboard access works**

---

## 📞 **If Still Having Issues:**

1. **Check production logs** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Test Sanity connection** in production
4. **Check NextAuth configuration** matches production
5. **Ensure database has admin user** with correct password hash

---

*Last Updated: ${new Date().toISOString()}*
*Status: Ready for Production Deployment*

