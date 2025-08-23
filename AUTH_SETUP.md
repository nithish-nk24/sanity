# Authentication Setup Guide

This project now supports two authentication methods for GitHub:

## Method 1: GitHub OAuth App (Recommended for Production)

### Setup Steps:
1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Configure OAuth App**
   - **Application name**: `YourAppName`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

3. **Get Credentials**
   - Copy the **Client ID** and **Client Secret**
   - Update your `.env` file:
   ```env
   AUTH_GITHUB_ID=your_new_client_id
   AUTH_GITHUB_SECRET=your_new_client_secret
   AUTH_URL=http://localhost:3000
   ```

## Method 2: Personal Access Token (Great for Development)

### Setup Steps:
1. **Create Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `read:user`, `user:email`
   - Copy the generated token

2. **Use the Token**
   - Go to `/auth/signin` in your app
   - Choose "Sign in with Token"
   - Paste your token and sign in

## Environment Variables

Make sure your `.env` file has these variables:

```env
AUTH_SECRET=your_auth_secret
AUTH_GITHUB_ID=your_github_oauth_client_id
AUTH_GITHUB_SECRET=your_github_oauth_client_secret
AUTH_URL=http://localhost:3000
```

## Benefits of Each Method

### OAuth App
- ✅ More secure
- ✅ Better user experience
- ✅ Standard authentication flow
- ✅ Works well in production

### Personal Access Token
- ✅ No OAuth app setup required
- ✅ Great for development/testing
- ✅ Can use any GitHub account
- ✅ No redirect URI issues

## Troubleshooting

### Redirect URI Error
If you get "redirect_uri is not associated with this application":
1. Check your GitHub OAuth app callback URL
2. Make sure it matches exactly: `http://localhost:3000/api/auth/callback/github`
3. For production, add your production domain

### Token Authentication Issues
1. Ensure your token has the correct scopes (`read:user`, `user:email`)
2. Check that the token hasn't expired
3. Verify the token belongs to the account you want to use

## Development vs Production

### Development
- Use `http://localhost:3000` for all URLs
- Personal Access Token method is recommended for quick setup

### Production
- Update all URLs to your production domain
- Use OAuth App method for better security
- Update `AUTH_URL` in environment variables

## Security Notes

- Never commit your `.env` file to version control
- Personal Access Tokens should have minimal required scopes
- OAuth apps are more secure for production use
- Regularly rotate your tokens and secrets
