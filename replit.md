# Weaving Dreams - Narrative Creation Platform

## Overview

Weaving Dreams is an AI-powered narrative creation platform designed for crafting complex, non-linear stories for film, TV, and video games. The application provides visual story mapping through a node-based editor, AI-assisted content generation, and comprehensive world-building tools including character creation, environment design, and prop management. Users can create branching narratives with multiple paths and outcomes, leveraging AI to generate story continuations, character profiles, and narrative elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter for lightweight navigation without page reloads.

**State Management**: React Query (@tanstack/react-query) for server state management, including data fetching, caching, and synchronization. Local component state managed with React hooks.

**UI Component Library**: Shadcn UI components built on Radix UI primitives, providing accessible and customizable interface elements. The design system uses the "new-york" style variant with Tailwind CSS for styling.

**Flow Editor**: ReactFlow library powers the visual node-based narrative editor, enabling users to create and visualize branching story paths through an interactive canvas.

**Form Management**: React Hook Form with Zod for schema validation, ensuring type-safe form handling throughout the application.

**Styling**: Tailwind CSS with custom design tokens and CSS variables for theming. Supports light/dark mode through CSS custom properties.

### Backend Architecture

**Runtime**: Node.js with Express.js framework handling HTTP requests and serving the application.

**Language**: TypeScript with ES Modules, compiled and bundled via esbuild for production.

**API Design**: RESTful API endpoints following resource-based routing patterns. Authentication middleware protects routes requiring user authentication.

**Development Mode**: Vite dev server proxies API requests to Express backend during development. Production mode serves pre-built static assets from Express.

**Build Process**: Custom build script bundles server code with esbuild and client code with Vite, creating optimized production artifacts in the `dist` directory. Select dependencies are bundled with server code to reduce cold start times.

**Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple. Sessions configured with secure HTTP-only cookies and 1-week TTL.

### Data Storage

**Database**: PostgreSQL accessed through Neon serverless driver for connection pooling and WebSocket support.

**ORM**: Drizzle ORM for type-safe database queries and schema management. Schema defined in TypeScript with automated type inference.

**Schema Design**: 
- Users table stores authentication data from Replit Auth
- Characters, Environments, and Props tables store user-generated world-building content with foreign key relationships to users
- Sessions table managed by connect-pg-simple for session persistence
- GalleryItems and GalleryLikes tables for Community Gallery feature
- NarrativeProjects and NarrativeContributions tables for Dimensions marketplace
- CreditAccounts and CreditTransactions for gamification economy
- QuestTemplates and UserDailyQuests for quest system
- Badges and UserBadges for achievement tracking
- All content tables include user ownership via userId foreign key for data isolation

**Migrations**: Drizzle Kit manages database schema migrations with configuration pointing to PostgreSQL dialect.

### Authentication and Authorization

**Provider**: Replit Authentication using OpenID Connect (OIDC) protocol via Passport.js strategy.

**Flow**: Authorization code flow with PKCE for secure token exchange. User claims stored in session after successful authentication.

**Session Storage**: PostgreSQL-backed sessions provide persistence across server restarts and horizontal scaling.

**Authorization**: Middleware functions verify authentication status before allowing access to protected routes. User ID extracted from session claims for resource ownership validation.

**User Management**: Users automatically created/updated on login through upsert pattern, storing profile data from OIDC claims.

### AI Integration

**Kie AI (Gemini)**: AI features powered by Google's Gemini API through Replit AI Integrations.

**Models Used**:
- gemini-2.5-flash: Text generation for character profiles, story content
- gemini-2.5-flash-preview-05-20: Image generation for character portraits

**Features**: 
- Character profile generation (name, archetype, background, personality, motivation, flaw, traits)
- Character image generation using Gemini's image model
- Story continuation suggestions
- Narrative choices and branching

**Cost**: Character generation costs 10 credits per use. Environments and props are free.

## External Dependencies

### Core Services

**Neon Database**: Serverless PostgreSQL database with connection pooling. Requires `DATABASE_URL` environment variable for connection string.

**Replit Authentication**: OIDC authentication service. Requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables.

### Third-Party Libraries

**UI Components**: Radix UI provides accessible, unstyled component primitives. Lucide React for icon library.

**Data Visualization**: ReactFlow for interactive node-based editor with minimap and controls.

**Validation**: Zod for runtime type validation and schema definition. Drizzle-zod bridges Drizzle schemas to Zod validators.

**Date Handling**: date-fns for date manipulation and formatting.

**HTTP Client**: Native fetch API with custom wrapper in queryClient for standardized error handling.

### Development Tools

**Build Tools**: Vite for frontend bundling, esbuild for backend bundling, PostCSS with Tailwind CSS for styling.

**Replit Integrations**: Vite plugins for Replit-specific features including runtime error modal, development banner, and code cartographer.

**Type Checking**: TypeScript compiler for static type analysis. Configured with strict mode and path aliases for clean imports.

### Asset Management

**Images**: Stored in `attached_assets` directory with Vite alias for imports. OpenGraph images in `client/public` for social media sharing.

**Custom Vite Plugin**: Meta images plugin dynamically updates OpenGraph meta tags with correct Replit deployment URLs.