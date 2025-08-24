# Generated Secrets Summary
# Generated on: 2025-08-24T10:17:37.390Z
# 
# IMPORTANT: These secrets are for reference only.
# Use the actual values in your environment files.
# NEVER commit this file to version control.

NEXTAUTH_SECRET=m6&;cWm)6k!C5acH!v#*z%-WA,(50PdW)28}fIQ;a{a[G8>E$f,5i2I&7>2!)k_,
CSRF_SECRET=_xsxKH:CLR_8#gnko4tYv0UrYk|3p[)zs^@M5^|M+rYh&<sTA4)v-sPde,%m}xS.?B<qeyZ53@2h1mTh7N$o+8}N15G[kKO1DLp&uKY{so7:8mVD=yH!_y1,DolT+qLY
ENCRYPTION_KEY=f_K[VE*v*dv4FFz-zL_4sq6#pAw(jQ}H
JWT_SECRET=apRN.Sn+(|]W_$>rm@L0bQ$yN]8t6wMxG&yI==)&i(UwN]i,c4@*b<Lk93m:!TGQ
API_KEY=CWAoZbFL0IPX7PH4utZ889sgyeJhDQFc
DATABASE_PASSWORD=io!@oJ$cWS$Oe1Fm
SMTP_PASSWORD=XbFb8@K<;qUzx}1{
REDIS_PASSWORD=}.}EO_!qg]*g*2OP
BACKUP_ENCRYPTION_KEY=o_-EeasMg}3bQ0=?<5>GXa?q|c4C!tSw
MONITORING_API_KEY=ZCAP2jX28EicT6FngGb5uRa3JPW9i2uk

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
