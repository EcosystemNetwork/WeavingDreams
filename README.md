# Weaving Dreams - Narrative Creation Platform

An AI-powered narrative creation platform designed for crafting complex, non-linear stories for film, TV, and video games.

## Features

- **Visual Story Mapping**: Node-based editor for creating branching narratives
- **AI-Assisted Content Generation**: Generate story continuations, character profiles, and narrative elements
- **World-Building Tools**: Character creation, environment design, and prop management
- **Community Gallery**: Share and discover creative content
- **Dimensions Marketplace**: Collaborative narrative projects
- **Gamification System**: Credits, quests, and achievement badges

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/EcosystemNetwork/WeavingDreams.git
   cd WeavingDreams
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

### Build for Production

```bash
npm run build
npm run start
```

## Deployment

### Vercel Deployment

This application is optimized for deployment on Vercel. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy**:
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Troubleshooting

Encountering deployment issues? Check our comprehensive troubleshooting guide:

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Detailed solutions for common issues:
  - DNS configuration problems
  - Download instead of render issues
  - Cache and build artifact issues
  - Browser-specific problems
  - v0.dev export workflows

### Helpful Scripts

- **DNS Verification**: `./script/verify-dns.sh yourdomain.com`
- **Clear Caches**: `./script/clear-vercel-cache.sh`
- See [script/README.md](./script/README.md) for all available utilities

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Wouter** for client-side routing
- **React Query** for state management
- **Shadcn UI** components with Radix UI
- **Tailwind CSS** for styling
- **ReactFlow** for visual node editor

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES Modules
- **PostgreSQL** with Drizzle ORM
- **Neon** serverless database

### AI Integration
- **Google Gemini API** for AI features
  - Character profile generation
  - Image generation
  - Story continuation

## Project Structure

```
WeavingDreams/
├── client/              # React frontend application
│   ├── public/         # Static assets
│   └── src/            # Source code
├── server/             # Express backend
├── shared/             # Shared types and utilities
├── api/                # Vercel serverless functions
├── script/             # Build and utility scripts
├── attached_assets/    # Project assets
├── vercel.json         # Vercel configuration
├── VERCEL_DEPLOYMENT.md    # Deployment guide
├── TROUBLESHOOTING.md      # Troubleshooting guide
└── package.json        # Dependencies and scripts
```

## Configuration Files

- **`vercel.json`** - Vercel deployment configuration
- **`vite.config.ts`** - Vite build configuration
- **`drizzle.config.ts`** - Database configuration
- **`tsconfig.json`** - TypeScript configuration
- **`.vercelignore`** - Files excluded from deployment

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string

### Optional
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (auto-set by Vercel)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete environment variable documentation.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

### Code Style

- TypeScript with strict mode
- ES Modules
- Path aliases for clean imports
- Consistent component structure

## Common Issues and Solutions

### Browser Downloads Site Instead of Rendering

This is typically caused by incorrect Content-Type headers or DNS configuration.

**Solutions**:
1. Run `./script/verify-dns.sh yourdomain.com`
2. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) DNS section
3. Clear Vercel cache: `./script/clear-vercel-cache.sh`

### Build Failures

**Solutions**:
1. Ensure `DATABASE_URL` is set
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Verify Node.js version: `node --version` (requires v20+)

### DNS Not Resolving

**Solutions**:
1. Verify DNS records match Vercel requirements
2. Wait for DNS propagation (up to 48 hours)
3. Clear local DNS cache
4. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed steps

### v0.dev Export Issues

**Solutions**:
1. Always export code after changes
2. Push to GitHub repository
3. Let Vercel deploy from GitHub
4. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) v0.dev section

## Documentation

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete deployment guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Comprehensive troubleshooting
- [script/README.md](./script/README.md) - Utility scripts documentation
- [replit.md](./replit.md) - Detailed system architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/EcosystemNetwork/WeavingDreams/issues)
- **Documentation**: See docs in this repository
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

## License

MIT License - See LICENSE file for details

---

**Need Help?** Start with [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for solutions to common issues.
