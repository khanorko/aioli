# AIoli Project Rules

## Tech Stack

- **Framework**: Next.js 16.1.0 (App Router)
- **React**: 19.2.3
- **Node.js**: Use version 20 or 22 (NOT 18!)
- **CSS**: Tailwind CSS v4
- **Database**: Turso (libSQL)
- **Auth**: NextAuth.js with Google provider
- **Payments**: Stripe
- **AI**: Groq SDK for suggestions
- **PDF**: html2pdf.js + jsPDF

## Important Commands

**CRITICAL: Node.js 20+ required! Always prefix commands with PATH:**

```bash
# Build
PATH="/Users/johansalo/.nvm/versions/node/v22.21.1/bin:/usr/bin:/bin:$PATH" npm run build

# Dev server
PATH="/Users/johansalo/.nvm/versions/node/v22.21.1/bin:/usr/bin:/bin:$PATH" npm run dev

# Lint
PATH="/Users/johansalo/.nvm/versions/node/v22.21.1/bin:/usr/bin:/bin:$PATH" npm run lint
```

Verify Node version with:
```bash
PATH="/Users/johansalo/.nvm/versions/node/v22.21.1/bin:/usr/bin:/bin:$PATH" node --version
# Should output: v22.21.1
```

## Language

- **English only** - All UI text, API messages, and code comments must be in English
- Swedish translation file (`src/translations/sv.json`) exists but is not actively used
- Groq prompts must request English output

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── analyze/       # Main analysis endpoint
│   │   ├── stripe/        # Payment endpoints
│   │   └── user/          # User data endpoints
│   ├── analysis/[id]/     # Single analysis results page
│   ├── scan/[id]/         # Multi-page scan results
│   └── history/           # User's analysis history
├── components/            # React components
├── lib/
│   ├── analyzers/         # SEO and LLM analysis logic
│   ├── db.ts             # Database operations (Turso)
│   ├── auth.ts           # NextAuth configuration
│   ├── stripe.ts         # Stripe configuration
│   └── sitemap.ts        # Page discovery/crawling
└── types/                # TypeScript types
```

## Key Files

- `/public/logo.png` - Main logo file
- `src/lib/analyzers/seo.ts` - SEO analysis logic
- `src/lib/analyzers/llm-readiness.ts` - AI visibility analysis
- `src/lib/analyzers/suggestions.ts` - Improvement suggestions
- `src/components/PrintView.tsx` - PDF report template
- `src/components/GenerateReportButton.tsx` - PDF generation

## PDF Generation Notes

- Uses html2pdf.js which relies on html2canvas
- **Avoid Tailwind color classes** in PrintView - use inline hex colors instead
- Tailwind v4 uses `lab()` and `oklch()` color functions which html2canvas doesn't support
- Use inline styles for colors: `style={{ color: "#059669" }}`

## Database

- Turso (libSQL) hosted database
- Environment variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Init script: `npm run db:init`

## Credits System

- Users buy credits to unlock analysis details
- 1 credit = 1 page analysis unlock
- Packages: Starter (1), Website (5), Agency (15)
- Admins bypass credit requirements

## AI Readiness & SEO Best Practices

**IMPORTANT**: This site analyzes AI visibility and SEO - it must lead by example!

When creating new pages or components:

1. **Schema.org Markup** - Add appropriate JSON-LD structured data:
   - Use `FAQPage` for pages with FAQ sections
   - Use `Article` for blog/learn articles
   - Use `CollectionPage` for index/listing pages
   - Use `WebPage` or `Quiz` for specialized pages

2. **Meta Tags** - Every page needs:
   - Title: 50-60 characters, descriptive
   - Description: 150-160 characters
   - Canonical URL
   - OpenGraph tags

3. **Content Structure**:
   - Clear H1 (one per page)
   - Logical heading hierarchy (H2, H3)
   - FAQ sections where relevant (both visible and in schema)
   - Citable facts and statistics

4. **PDF Compatibility**:
   - Use inline hex colors (not Tailwind classes) in PrintView
   - Tailwind v4's `lab()`/`oklch()` colors break html2canvas

Example schema pattern:
```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [...]
};

// In component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

## Environment Variables

Required:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GROQ_API_KEY`
