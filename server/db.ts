import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Configure WebSocket for different environments
// In Vercel serverless and other edge environments, WebSocket is available globally
// In Node.js environments (local development), we import the ws module
let wsConfigured = false;

if (typeof WebSocket !== 'undefined') {
  // Serverless/edge environment with native WebSocket support (Vercel, Cloudflare, etc.)
  neonConfig.webSocketConstructor = WebSocket as any;
  wsConfigured = true;
}

// For Node.js environments, try to import ws dynamically
// This only runs in local development since Vercel has global WebSocket
if (!wsConfigured) {
  import('ws').then(({ default: ws }) => {
    neonConfig.webSocketConstructor = ws;
  }).catch(() => {
    // If ws is not available, Neon will use HTTP fetch mode
    console.warn('WebSocket not available, Neon will use HTTP fetch mode');
  });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
