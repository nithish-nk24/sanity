# Generated Secrets Summary
# Generated on: 2025-08-24T13:37:31.310Z
# 
# IMPORTANT: These secrets are for reference only.
# Use the actual values in your environment files.
# NEVER commit this file to version control.

NEXTAUTH_SECRET=0,F7ho<8!u|RpUQ+=V?@XQ5JIpX-K+FR5]BOC,w.b_EF,bbYfFi[G,W|Z_iB;Y;i
CSRF_SECRET=4R:r3czNt-pC274+l(p!=qoK^5lvuCHU$7iu5W?,mMrUpO11a}_[RqP%#BpbkcEKU8DVj:[^^IA413AIa+<9CCY!C;=yyoQ:m&r69p>VH)TH9mSQwZ(8F1i!R(@{e[7K
ENCRYPTION_KEY=o4Pl3WLXu4887jWl<=J-;W]8zwjsXUG7
JWT_SECRET=oY9%F269Hw+{%UPNKryLFEhQ|zWa^r?=}xqpr*b.N4oV_p74xLpr4LurW<CFvN{E
API_KEY=mlkeuIeNn4vhwjUK56RtmTf2pP88vUvz
DATABASE_PASSWORD=eHq9[6D4VBQ(=Z0r
SMTP_PASSWORD=hg.SSq9x1YPA9E@{
REDIS_PASSWORD=AAt;[0z$b4HP;fw}
BACKUP_ENCRYPTION_KEY=t49EWNcg3-5mHu6?;6?AR%&+6GPq.KN#
MONITORING_API_KEY=5OweTk8019DDtz48f51pUHJ5AlGJCfsU

# Secret Rotation Schedule:
# - NEXTAUTH_SECRET: Every 90 days
# - CSRF_SECRET: Every 30 days
# - ENCRYPTION_KEY: Every 365 days (manual rotation)
# - JWT_SECRET: Every 90 days
# - API_KEY: Every 180 days
# - Database passwords: Every 60 days
# - SMTP passwords: Every 60 days
# - Redis passwords: Every 60 days

# Security Notes:
# - Store secrets securely (use environment variables)
# - Rotate secrets regularly according to schedule
# - Use different secrets for each environment
# - Monitor secret usage and access
# - Implement secret rotation automation
