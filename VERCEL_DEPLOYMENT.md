# Vercel Deployment Guide

## Quick Start

This app is optimized for Vercel deployment with proper routing, static file serving, and serverless function configuration.

## Environment Variables

Set these in your Vercel project settings:

### Required
- `DATABASE_URL` - PostgreSQL connection string (Neon recommended)
- `REPL_ID` - Replit application ID for authentication
- `ISSUER_URL` - OIDC issuer URL for Replit Auth
- `SESSION_SECRET` - Secret key for session encryption

### Optional
- `NODE_ENV` - Set to `production` (automatically set by Vercel)
- `PORT` - Not needed for Vercel (handled automatically)

## Deployment Steps

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Vercel will auto-detect the configuration from `vercel.json`

2. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above

3. **Deploy**
   - Push to your main branch or use Vercel CLI: `vercel --prod`

## Configuration Files

- `vercel.json` - Vercel routing and build configuration
- `api/index.ts` - Serverless function handler for Express API
- `.vercelignore` - Files to exclude from deployment

## Build Process

The build process:
1. Builds the React client with Vite → `dist/public`
2. Bundles the Express server with esbuild → `dist/index.cjs`
3. Vercel serves static files from `dist/public`
4. API routes are handled by serverless function at `api/index.ts`

## Routing

- `/api/*` → Serverless function (Express API)
- `/*` → Static files (React SPA)
- All non-API routes serve `index.html` for client-side routing

## Performance Optimizations

- Code splitting with manual chunks
- Static asset caching (1 year)
- HTML no-cache headers
- Security headers (XSS protection, frame options)
- Optimized bundle sizes

## Troubleshooting

### Download Issue Fixed
The download issue was caused by improper MIME types. This is now fixed with:
- Proper Content-Type headers in static file serving
- Correct routing configuration in `vercel.json`
- SPA fallback to `index.html`

### Build Errors
- Ensure `DATABASE_URL` is set before building
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (20+ recommended)

### API Errors
- Check serverless function logs in Vercel dashboard
- Verify environment variables are set correctly
- Ensure database is accessible from Vercel's IP ranges

