import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files with proper MIME types and caching
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Set proper MIME types for common file extensions
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
      };

      if (mimeTypes[ext]) {
        res.setHeader('Content-Type', mimeTypes[ext]);
      }

      // Cache static assets
      if (ext.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  }));

  // SPA fallback: serve index.html for all non-API routes
  app.get("*", (req, res, next) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"), {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  });
}
