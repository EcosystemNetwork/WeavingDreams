# Scripts Directory

This directory contains utility scripts for building, deploying, and troubleshooting the application.

## Available Scripts

### Build Script

**File**: `build.ts`

The main build script that compiles and bundles the application for production deployment.

**Usage**:
```bash
npm run build
```

This script:
- Builds the React client with Vite → `dist/public`
- Bundles the Express server with esbuild → `dist/index.cjs`
- Prepares assets for Vercel deployment

### DNS Verification Script

**File**: `verify-dns.sh`

A comprehensive DNS verification tool that checks your domain configuration for Vercel deployment.

**Usage**:
```bash
# With domain as argument
./script/verify-dns.sh yourdomain.com

# Interactive mode (will prompt for domain)
./script/verify-dns.sh
```

**What it checks**:
- A records for root domain
- CNAME records for www subdomain
- HTTP response status and Content-Type headers
- SSL certificate validity
- DNS propagation status

**Requirements**:
- `dig` (dnsutils package)
- `curl`
- `openssl` (optional, for SSL checks)

**Installation of dependencies**:
```bash
# Ubuntu/Debian
sudo apt-get install dnsutils curl openssl

# macOS
brew install bind curl openssl

# Windows
# Use WSL or install via package manager
```

### Cache Clearing Script

**File**: `clear-vercel-cache.sh`

A utility script to clear local and Vercel caches and force a fresh deployment.

**Usage**:
```bash
./script/clear-vercel-cache.sh
```

**What it does**:
1. Removes `node_modules` directory
2. Deletes `package-lock.json`
3. Clears `dist` build directory
4. Removes `.vercel` cache directory
5. Reinstalls dependencies with `npm install`
6. Rebuilds the project with `npm run build`
7. Optionally deploys to Vercel with `--force` flag

**Requirements**:
- `npm` (Node Package Manager)
- `vercel` CLI (optional, for deployment step)

**Installation of Vercel CLI**:
```bash
npm install -g vercel
```

## Common Workflows

### After DNS Changes

When you update DNS records for your domain:

1. Wait for DNS propagation (up to 48 hours)
2. Run the DNS verification script:
   ```bash
   ./script/verify-dns.sh yourdomain.com
   ```
3. Check the output for any errors or warnings
4. Refer to [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) if issues are found

### When Experiencing Download Issues

If your site downloads instead of rendering:

1. Clear all caches:
   ```bash
   ./script/clear-vercel-cache.sh
   ```
2. Verify DNS configuration:
   ```bash
   ./script/verify-dns.sh yourdomain.com
   ```
3. Check browser console for Content-Type errors
4. See [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) for detailed steps

### After v0.dev Export

When you export code from v0.dev:

1. Update your local repository with the new code
2. Clear caches to ensure a fresh build:
   ```bash
   ./script/clear-vercel-cache.sh
   ```
3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update from v0.dev export"
   git push
   ```
4. Vercel will automatically deploy the changes

### Regular Maintenance

To ensure optimal deployment:

1. **Monthly**: Run DNS verification to catch any configuration drift
   ```bash
   ./script/verify-dns.sh yourdomain.com
   ```

2. **After major updates**: Clear caches and rebuild
   ```bash
   ./script/clear-vercel-cache.sh
   ```

3. **Before production deploys**: Test locally first
   ```bash
   npm run build
   npm run start
   ```

## Troubleshooting

If scripts fail to run:

1. **Permission denied**:
   ```bash
   chmod +x script/verify-dns.sh
   chmod +x script/clear-vercel-cache.sh
   ```

2. **Command not found**:
   - Install missing dependencies (see requirements above)
   - Ensure you're in the project root directory

3. **Build failures**:
   - Check that `DATABASE_URL` is set (can be a dummy value for build)
   - Verify all dependencies are installed: `npm install`
   - Check Node.js version: `node --version` (requires v20+)

## Additional Resources

- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Comprehensive troubleshooting guide
- [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) - Vercel deployment guide
- [Vercel Documentation](https://vercel.com/docs)
- [DNS Checker Tool](https://dnschecker.org/)

## Contributing

When adding new scripts:

1. Add appropriate shebang line (`#!/bin/bash` for bash scripts)
2. Make scripts executable: `chmod +x script/your-script.sh`
3. Document the script in this README
4. Add comments explaining complex operations
5. Include error handling with clear messages
6. Use color-coded output for better UX
