import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { seedGenerationBadges } from "../server/seedBadges";

// Create Express app instance (cached for serverless)
let appInstance: express.Application | null = null;
let handlerInstance: any = null;
let appPromise: Promise<express.Application> | null = null;

async function createApp(): Promise<express.Application> {
  if (appInstance) {
    return appInstance;
  }

  if (appPromise) {
    return appPromise;
  }

  appPromise = (async () => {
    const app = express();

    // Trust proxy for Vercel
    app.set("trust proxy", 1);

    app.use(
      express.json({
        verify: (req, _res, buf) => {
          (req as any).rawBody = buf;
        },
      }),
    );

    app.use(express.urlencoded({ extended: false }));

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Seed badges (only once, with error handling)
    try {
      await seedGenerationBadges();
    } catch (error) {
      console.error("Error seeding badges:", error);
    }

    // Register routes (returns HTTP server, but we only need the app for Vercel)
    await registerRoutes(app);

    appInstance = app;
    return app;
  })();

  return appPromise;
}

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Create handler on first invocation
  if (!handlerInstance) {
    const app = await createApp();
    handlerInstance = serverless(app, {
      binary: ['image/*', 'application/octet-stream'],
    });
  }

  return handlerInstance(req, res);
}

