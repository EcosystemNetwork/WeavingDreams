import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Configure WebSocket for different environments
// In Vercel serverless and other edge environments, WebSocket is available globally
// In Node.js environments (local development), we need the ws module
if (typeof WebSocket !== 'undefined') {
  // Serverless/edge environment with native WebSocket support (Vercel, Cloudflare, etc.)
  neonConfig.webSocketConstructor = WebSocket as any;
} else {
  // Node.js environment - import ws module
  try {
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  } catch (e) {
    // If ws is not available, Neon will fall back to HTTP fetch
    console.warn('WebSocket constructor not available, using HTTP fetch for database connection');
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
