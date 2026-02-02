# AIoli Project Info

## Accounts & Deployment

### GitHub
- **Repository:** https://github.com/khanorko/aioli
- **Account:** khanorko
- **Email:** johan.salo.ai@gmail.com

### Vercel
- **Project:** johan-salos-projects/aioli
- **Production URL:** https://aioli.tools
- **Dashboard:** https://vercel.com/johan-salos-projects/aioli

### Deploy Commands
```bash
# Build locally
PATH="/Users/johansalo/.nvm/versions/node/v22.21.1/bin:/usr/bin:/bin:$PATH" npm run build

# Deploy to Vercel (use --archive=tgz to avoid rate limits)
PATH="/Users/johansalo/.nvm/versions/node/v22.21.1/bin:/usr/bin:/bin:$PATH" vercel --prod --archive=tgz

# Git push (must be authenticated as khanorko)
git push origin main
```

### Rate Limit Fix
If you see "Too many requests (5000 limit)", use:
```bash
vercel --prod --archive=tgz
```

This packages files into a single tarball instead of uploading individually.

## Node.js
- **Required version:** 20+ (project uses v22.21.1)
- **Path:** `/Users/johansalo/.nvm/versions/node/v22.21.1/bin`

## Database
- **Provider:** Turso (libSQL)
- **Env vars:** TURSO_DATABASE_URL, TURSO_AUTH_TOKEN

## Auth
- **Provider:** NextAuth.js with Google
- **Env vars:** GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET

## Payments
- **Provider:** Stripe
- **Env vars:** STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
