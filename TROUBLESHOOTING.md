# Vercel Deployment Troubleshooting Guide

This guide addresses common issues when deploying to Vercel, particularly when the browser attempts to download the application instead of rendering it.

## Table of Contents
1. [DNS Configuration Issues](#dns-configuration-issues)
2. [v0.dev Export Issues](#v0dev-export-issues)
3. [Cache and Build Artifact Issues](#cache-and-build-artifact-issues)
4. [Browser and Local Environment Issues](#browser-and-local-environment-issues)

---

## DNS Configuration Issues

### Problem
Vercel expects specific DNS records (A or CNAME) to correctly route traffic to your deployed application. If these records are incorrect or outdated at your DNS provider, your browser might not correctly resolve the domain to your Vercel deployment, leading to a download attempt.

### Resolution Steps

1. **Verify DNS Records in Vercel Dashboard**
   - Go to your Vercel project
   - Navigate to **Settings** → **Domains**
   - Note the DNS records Vercel expects (typically A and CNAME records)
   - Common Vercel DNS records:
     - **A Record**: Points to Vercel's IP address (e.g., `76.76.21.21`)
     - **CNAME Record**: Points to `cname.vercel-dns.com`

2. **Check Your DNS Provider Settings**
   - Log in to your domain registrar or DNS provider
   - Verify that the A and CNAME records match Vercel's requirements
   - Remove any conflicting or outdated records
   - Ensure there are no duplicate records for the same domain

3. **Verify DNS Propagation**
   
   Use the following commands in your terminal to check DNS records:

   **Check A Record:**
   ```bash
   dig yourdomain.com A
   # or
   nslookup yourdomain.com
   ```

   **Check CNAME Record:**
   ```bash
   dig www.yourdomain.com CNAME
   # or
   nslookup www.yourdomain.com
   ```

   **Detailed DNS Query:**
   ```bash
   dig yourdomain.com +trace
   ```

4. **Wait for DNS Propagation**
   - DNS changes can take up to 48 hours to propagate globally
   - Use online tools like [DNS Checker](https://dnschecker.org/) to verify propagation
   - Clear your local DNS cache:
     - **Windows**: `ipconfig /flushdns`
     - **macOS**: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
     - **Linux**: `sudo systemd-resolve --flush-caches`

5. **Common DNS Configurations**

   **For Root Domain (yourdomain.com):**
   - Type: A
   - Name: @ (or blank)
   - Value: Vercel's IP address from dashboard
   - TTL: 3600 (or automatic)

   **For www Subdomain (www.yourdomain.com):**
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
   - TTL: 3600 (or automatic)

### Verification

After updating DNS records, verify the setup:
```bash
# Check if domain resolves to Vercel
curl -I https://yourdomain.com

# Verify SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

---

## v0.dev Export Issues

### Problem
If you are using v0.dev to generate code and deploy to Vercel, a common issue arises if you rely on direct Vercel deploys from v0.dev without manually exporting and pushing the code to a GitHub repository.

### Resolution Steps

1. **Export Code from v0.dev**
   - Open your v0.dev project
   - Click the **Export** or **Download** button
   - Save the exported code to your local machine
   - Extract the files if downloaded as a ZIP archive

2. **Set Up Git Repository**
   ```bash
   # Navigate to your project directory
   cd /path/to/your/project

   # Initialize git if not already done
   git init

   # Add all files
   git add .

   # Create initial commit
   git commit -m "Initial commit from v0.dev"
   ```

3. **Push to GitHub**
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

4. **Connect GitHub to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Configure build settings (Vercel usually auto-detects)
   - Click **Deploy**

5. **Establish Workflow**
   - Make changes in v0.dev
   - Export updated code after each working version
   - Update your GitHub repository
   - Vercel will automatically redeploy on push to main branch

### Best Practices

- **Always export working versions** from v0.dev before making significant changes
- **Use version control** with meaningful commit messages
- **Set up automatic deployments** via GitHub integration
- **Test locally** before pushing to main branch:
  ```bash
  npm install
  npm run build
  npm run dev
  ```

---

## Cache and Build Artifact Issues

### Problem
In some cases, Vercel might be deploying an older, corrupted version of your application from its cache, causing the browser to misinterpret the served content as a file to be downloaded.

### Resolution Steps

1. **Clear Vercel Cache**
   
   **Via Vercel Dashboard:**
   - Go to your project in Vercel Dashboard
   - Navigate to **Settings** → **General**
   - Scroll to **Build & Development Settings**
   - Click **Clear Cache**
   - Redeploy your application

   **Via Vercel CLI:**
   ```bash
   # Install Vercel CLI if needed
   npm install -g vercel

   # Login to Vercel
   vercel login

   # Clear cache and redeploy
   vercel --force
   ```

2. **Clear Local Build Cache**
   ```bash
   # Remove node_modules and package-lock.json
   rm -rf node_modules package-lock.json

   # Remove build artifacts
   rm -rf dist .vercel

   # Reinstall dependencies
   npm install

   # Rebuild
   npm run build
   ```

3. **Force Fresh Deployment**
   
   Create a new deployment without cache:
   ```bash
   # Using Vercel CLI
   vercel --force --prod

   # Or trigger via git
   git commit --allow-empty -m "Force rebuild"
   git push
   ```

4. **Disconnect and Reconnect Repository**
   
   If issues persist:
   - Go to Vercel Dashboard → **Settings** → **Git**
   - Click **Disconnect** next to your GitHub repository
   - Wait a few moments
   - Click **Connect Git Repository**
   - Select your repository again
   - Redeploy

5. **Check Build Output Directory**
   
   Ensure `vercel.json` has the correct output directory:
   ```json
   {
     "outputDirectory": "dist/public",
     "buildCommand": "npm run build"
   }
   ```

6. **Verify .vercelignore**
   
   Make sure you're not accidentally including unnecessary files:
   ```
   node_modules
   .local
   .env.local
   .env*.local
   *.log
   .DS_Store
   dist
   .vscode
   .idea
   ```

### Verification

After clearing cache:
```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Inspect deployment
vercel inspect [deployment-url]
```

---

## Browser and Local Environment Issues

### Problem
Less commonly, local browser settings or extensions could interfere with how the browser handles certain content types, causing it to initiate a download instead of rendering the web page.

### Resolution Steps

1. **Test in Different Browsers**
   
   Try accessing your Vercel deployment in multiple browsers:
   - Chrome
   - Firefox
   - Safari
   - Edge
   - Brave

2. **Use Incognito/Private Mode**
   
   Open your site in incognito/private browsing mode:
   - **Chrome**: Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
   - **Firefox**: Ctrl+Shift+P (Windows) or Cmd+Shift+P (Mac)
   - **Safari**: Cmd+Shift+N (Mac)
   - **Edge**: Ctrl+Shift+N (Windows)

3. **Test on Different Device**
   
   Access your deployment from:
   - Another computer
   - Mobile phone
   - Tablet
   - Different network connection

4. **Disable Browser Extensions**
   
   Extensions that might interfere:
   - Ad blockers
   - Privacy tools
   - Content modifiers
   - Download managers
   - VPN extensions

   Steps:
   - Open browser settings
   - Go to Extensions/Add-ons
   - Disable all extensions
   - Refresh the Vercel deployment
   - Re-enable extensions one by one to identify the culprit

5. **Clear Browser Cache and Cookies**
   
   **Chrome:**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "All time"
   - Check "Cached images and files" and "Cookies"
   - Click "Clear data"

   **Firefox:**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "Everything"
   - Check "Cookies" and "Cache"
   - Click "Clear Now"

6. **Check Browser Console**
   
   Open browser developer tools (F12) and check:
   - **Console tab**: Look for JavaScript errors
   - **Network tab**: Check response headers and status codes
   - **Sources tab**: Verify files are loading correctly

7. **Verify Content-Type Headers**
   
   In browser developer tools (F12):
   - Go to **Network** tab
   - Reload the page
   - Click on the main document request
   - Check **Headers** → **Response Headers**
   - Verify `Content-Type: text/html; charset=utf-8`

8. **Check for MIME Type Issues**
   
   Ensure your `vercel.json` has proper headers:
   ```json
   {
     "headers": [
       {
         "source": "/index.html",
         "headers": [
           {
             "key": "Content-Type",
             "value": "text/html; charset=utf-8"
           }
         ]
       }
     ]
   }
   ```

### Verification

Test with curl to see actual response:
```bash
# Check headers
curl -I https://your-deployment.vercel.app

# Get full response
curl -v https://your-deployment.vercel.app

# Save response to file for inspection
curl -o response.html https://your-deployment.vercel.app
```

Expected response should include:
```
HTTP/2 200
content-type: text/html; charset=utf-8
```

---

## General Debugging Tips

### Check Vercel Deployment Logs

1. Via Dashboard:
   - Go to your project
   - Click on the deployment
   - View **Build Logs** and **Function Logs**

2. Via CLI:
   ```bash
   vercel logs [deployment-url]
   ```

### Inspect Network Traffic

Use browser developer tools (F12):
- Check **Network** tab for failed requests
- Look for 404, 500, or other error status codes
- Verify all assets are loading correctly

### Test API Endpoints Separately

If your app has API routes:
```bash
# Test API endpoint
curl https://your-deployment.vercel.app/api/health

# Test with verbose output
curl -v https://your-deployment.vercel.app/api/endpoint
```

### Review Vercel Configuration

Ensure `vercel.json` is properly configured:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index"
    },
    {
      "source": "/((?!api|_next|.*\\.).*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Quick Checklist

When encountering download issues, check in this order:

- [ ] Verify DNS records match Vercel requirements
- [ ] Check Content-Type headers in browser dev tools
- [ ] Clear Vercel cache and redeploy
- [ ] Test in incognito mode / different browser
- [ ] Clear local browser cache
- [ ] Verify vercel.json configuration
- [ ] Check for outdated cached deployments
- [ ] Test on different device/network
- [ ] Review Vercel build logs for errors
- [ ] Ensure code is pushed to GitHub (not direct v0.dev deploy)

---

## Getting Help

If issues persist after following this guide:

1. **Check Vercel Status**: [status.vercel.com](https://status.vercel.com)
2. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
3. **Community Forums**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
4. **Documentation**: [vercel.com/docs](https://vercel.com/docs)

When asking for help, include:
- Your domain name or deployment URL
- Browser and version
- Error messages from console
- Screenshots of the issue
- Steps you've already tried
