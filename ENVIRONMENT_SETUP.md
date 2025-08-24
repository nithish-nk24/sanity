# Environment & Configuration Setup Guide

This guide covers the complete setup of environment variables, configuration management, and security best practices for the Cyfotok Academy application.

## 🚀 Quick Start

### 1. Generate Strong Secrets
```bash
npm run generate:secrets
```
This will create:
- `.env.local.template` - Template for your local environment
- `config/environments/` - Environment-specific configurations
- `SECRETS_SUMMARY.md` - Reference for generated secrets

### 2. Set Up Local Environment
```bash
cp .env.local.template .env.local
# Edit .env.local with your actual values
```

### 3. Validate Configuration
```bash
npm run validate:config
```

### 4. Security Audit
```bash
npm run security:audit
```

## 📋 Environment Variables

### Required Variables

#### Sanity Configuration
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-27
SANITY_WRITE_TOKEN=your_sanity_write_token
```

#### Authentication & Security
```bash
NEXTAUTH_SECRET=64+_character_strong_secret
NEXTAUTH_URL=http://localhost:3000
CSRF_SECRET=128+_character_strong_secret
```

#### Payment Gateway
```bash
RAZORPAY_KEY_ID=rzp_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Optional Variables

#### Content Security Policy
```bash
CSP_VIOLATION_WEBHOOK=your_webhook_url
CSP_MODE=development|production|strict
CSP_REPORT_ONLY=true|false
```

#### API Security
```bash
SECURITY_WEBHOOK_URL=your_security_webhook
SLACK_WEBHOOK_URL=your_slack_webhook
```

#### Rate Limiting
```bash
RATE_LIMIT_GENERAL_MAX=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_BLOG_MAX=10
RATE_LIMIT_UPLOAD_MAX=20
```

#### Monitoring & Logging
```bash
ENABLE_SECURITY_LOGGING=true
ENABLE_REQUEST_LOGGING=true
LOG_LEVEL=debug|info|warn|error
```

#### HTTPS Enforcement
```bash
FORCE_HTTPS=true|false
```

#### File Upload
```bash
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

#### Feature Flags
```bash
ENABLE_REGISTRATION=true
ENABLE_COMMENTS=true
ENABLE_ANALYTICS=false
ENABLE_NOTIFICATIONS=false
```

#### Third-party Integrations
```bash
GOOGLE_ANALYTICS_ID=your_ga_id
FACEBOOK_PIXEL_ID=your_fb_pixel_id
HOTJAR_ID=your_hotjar_id
```

#### Error Reporting
```bash
SENTRY_DSN=your_sentry_dsn
LOGROCKET_ID=your_logrocket_id
```

## 🔐 Secret Management

### Secret Requirements

| Secret | Minimum Length | Complexity | Rotation Interval |
|--------|----------------|------------|-------------------|
| `NEXTAUTH_SECRET` | 64 chars | Uppercase, lowercase, numbers, symbols | 90 days |
| `CSRF_SECRET` | 128 chars | Uppercase, lowercase, numbers, symbols | 30 days |
| `ENCRYPTION_KEY` | 32 chars | Uppercase, lowercase, numbers, symbols | 365 days |
| `JWT_SECRET` | 64 chars | Uppercase, lowercase, numbers, symbols | 90 days |
| `API_KEY` | 32 chars | Uppercase, lowercase, numbers | 180 days |
| `DATABASE_PASSWORD` | 16 chars | Uppercase, lowercase, numbers, symbols | 60 days |
| `SMTP_PASSWORD` | 16 chars | Uppercase, lowercase, numbers, symbols | 60 days |
| `REDIS_PASSWORD` | 16 chars | Uppercase, lowercase, numbers, symbols | 60 days |

### Secret Generation

The `generate-secrets.js` script creates cryptographically strong secrets with:
- Random character selection
- Guaranteed complexity requirements
- Proper length validation
- Environment-specific configurations

### Secret Rotation

#### Automatic Rotation
```bash
# Check rotation status
npm run rotate:secrets -- --dry-run

# Rotate secrets that need rotation
npm run rotate:secrets

# Force rotation of all secrets
npm run rotate:secrets -- --force
```

#### Manual Rotation
1. Run the rotation script
2. Update external services (databases, APIs, etc.)
3. Restart the application
4. Verify functionality

## 🌍 Environment-Specific Configurations

### Development
- Debug mode enabled
- CSP in report-only mode
- HTTPS not enforced
- Detailed logging
- Fast cache TTL (5 minutes)

### Staging
- Debug mode disabled
- CSP in report-only mode
- HTTPS enforced
- Moderate logging
- Medium cache TTL (30 minutes)

### Production
- Debug mode disabled
- CSP enforced
- HTTPS enforced
- Minimal logging
- Long cache TTL (1 hour)

## 🔒 Security Best Practices

### 1. Never Commit Secrets
```bash
# Add to .gitignore
.env.local
.env.production
.env.staging
SECRETS_SUMMARY.md
*.backup.*
config-validation-report.json
secret-rotation-report.json
```

### 2. Use Strong Secrets
- Minimum 64 characters for authentication secrets
- Include uppercase, lowercase, numbers, and symbols
- Generate unique secrets for each environment

### 3. Regular Rotation
- Authentication secrets: Every 90 days
- CSRF tokens: Every 30 days
- Database passwords: Every 60 days
- API keys: Every 180 days

### 4. Environment Isolation
- Use different secrets for each environment
- Never use production secrets in development
- Separate staging and production configurations

### 5. Access Control
- Limit access to environment files
- Use environment variables in deployment platforms
- Implement secret rotation automation

## 🛠️ Scripts Reference

### Secret Generation
```bash
npm run generate:secrets
```
Generates strong secrets and environment templates.

### Configuration Validation
```bash
npm run validate:config
npm run validate:config .env.production
```
Validates environment configuration and security settings.

### Secret Rotation
```bash
npm run rotate:secrets
npm run rotate:secrets -- --dry-run
npm run rotate:secrets -- --force
```
Manages secret rotation with backup and validation.

### Security Audit
```bash
npm run security:audit
```
Runs configuration validation and linting checks.

### Complete Setup
```bash
npm run security:setup
```
Generates secrets and validates configuration.

## 📊 Monitoring & Alerts

### Security Events
- Failed authentication attempts
- Rate limit violations
- CSP violations
- Secret rotation events
- Configuration changes

### Alert Channels
- Webhook notifications
- Slack integration
- Email alerts
- Log aggregation

### Metrics
- Secret age tracking
- Rotation compliance
- Security incident rates
- Configuration drift

## 🚨 Troubleshooting

### Common Issues

#### Missing Environment Variables
```bash
npm run validate:config
# Fix missing variables in .env.local
```

#### Weak Secrets
```bash
npm run generate:secrets
# Update .env.local with new secrets
```

#### Configuration Errors
```bash
npm run validate:config .env.local
# Review error messages and fix issues
```

#### Secret Rotation Failures
```bash
npm run rotate:secrets -- --dry-run
# Check rotation requirements and fix issues
```

### Validation Errors

| Error | Solution |
|-------|----------|
| Missing required variable | Add to .env.local |
| Secret too weak | Regenerate with proper complexity |
| Invalid URL format | Fix URL syntax |
| Invalid number range | Adjust to allowed range |
| Production security issues | Fix before deployment |

## 📚 Additional Resources

### Documentation
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Sanity Configuration](https://www.sanity.io/docs/configuration)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)

### Security References
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

### Tools
- [Secret Scanner](https://github.com/zricethezav/gitleaks)
- [Environment Validator](https://github.com/evanshortiss/env-validate)
- [Secret Rotation](https://github.com/aws/aws-secrets-manager-rotation-lambdas)

## 🔄 Maintenance Schedule

### Daily
- Monitor security logs
- Check for failed authentications
- Review rate limit violations

### Weekly
- Validate configuration
- Check secret rotation status
- Review security metrics

### Monthly
- Rotate short-term secrets
- Update security policies
- Review access controls

### Quarterly
- Rotate authentication secrets
- Security audit review
- Update documentation

### Annually
- Rotate encryption keys
- Comprehensive security review
- Update rotation policies

## 📞 Support

For issues with environment setup:
1. Check the troubleshooting section
2. Run validation scripts
3. Review error logs
4. Consult security documentation

Remember: Security is everyone's responsibility. Keep secrets secure and rotate them regularly!
