# Vercel Deployment Guide

## Quick Start

This app is optimized for Vercel deployment with proper routing, static file serving, and serverless function configuration.

## Environment Variables

Set these in your Vercel project settings:

### Required
- `DATABASE_URL` - PostgreSQL connection string (Neon recommended)

### Optional
- `NODE_ENV` - Set to `production` (automatically set by Vercel)
- `PORT` - Not needed for Vercel (handled automatically)

**Note:** Authentication has been removed. The app uses a mock user system for development.

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

For comprehensive troubleshooting of common deployment issues, see **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

The troubleshooting guide covers:
- **DNS Configuration Issues**: Verify and fix DNS records for custom domains
- **v0.dev Export Issues**: Proper workflow for v0.dev to GitHub to Vercel deployments
- **Cache and Build Artifact Issues**: Clear cache and force fresh deployments
- **Browser and Local Environment Issues**: Browser-specific troubleshooting steps

### Download Issue Fixed
The download issue was caused by missing Content-Type headers. This is now fixed with:
- **Explicit Content-Type headers** in `vercel.json` for HTML, JS, and CSS files
- **`_headers` file** in `client/public` that ensures proper MIME types
- **Correct routing configuration** that excludes static files from SPA rewrites
- **Proper rewrite pattern** that only applies to non-file routes

**Key fixes:**
- Added `Content-Type: text/html; charset=utf-8` for all HTML files
- Added `Content-Type: application/javascript; charset=utf-8` for JS files
- Added `Content-Type: text/css; charset=utf-8` for CSS files
- Fixed rewrite pattern to exclude files with extensions (e.g., `.js`, `.css`, `.png`)

### Build Errors
- Ensure `DATABASE_URL` is set before building
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (20+ recommended)

### API Errors
- Check serverless function logs in Vercel dashboard
- Verify environment variables are set correctly
- Ensure database is accessible from Vercel's IP ranges

### Quick Debug Commands

```bash
# Check DNS records
dig yourdomain.com A
dig www.yourdomain.com CNAME

# Test deployment
curl -I https://your-deployment.vercel.app

# Clear cache and redeploy
vercel --force --prod
```

