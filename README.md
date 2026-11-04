# hollou

This project is a Next.js 16 application in a TypeScript Turborepo.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - App Router framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## UI Customization

The web app uses shared shadcn/ui primitives from `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@hollou/ui/components/button";
```

## Deployment

### Vercel Services

The root `vercel.json` uses [Vercel Services](https://vercel.com/docs/services). Import this repository as one Vercel project and keep the project's Root Directory at the repository root. The `web` service builds the Next.js app in `apps/web` and handles every public path, including `/api/auth/*` and `/_next/*`.

The folders in `packages/` contain shared code, not servers. They are included in the web app's build. There are no internal services or service bindings in the current setup. The web app connects to an external Neon database through `DATABASE_URL`.

Set these project environment variables for each Vercel environment:

- `DATABASE_URL`: The Neon PostgreSQL connection URL.
- `BETTER_AUTH_SECRET`: A secret with at least 32 characters.
- `BETTER_AUTH_URL`: The public origin of that environment's web app, including `https://`. Hollou also uses this origin for canonical links, share previews, and the sitemap.

The home page is included in `/sitemap.xml`. All pages use `noindex` metadata. Keep them accessible to crawlers so the `noindex` tag can be read; `/robots.txt` blocks only `/api/` and points to the sitemap.

Test the service routing from the repository root with a current Vercel CLI:

```bash
npx vercel@latest dev
```

For local testing without a Vercel login, use `npx vercel@latest dev -L`. Keep local environment variables in `apps/web/.env` and set `BETTER_AUTH_URL` to the local origin printed by the command.

If you add another server, add it to `services`. For calls between services, declare a binding on the calling service and read its generated URL in server code at request time. Do not set binding variables yourself or use them during builds or in middleware. Add a public rewrite only if the new service needs public access, and put it before the web catch-all.

### Docker Compose

- Target: web + server
- Config: `docker-compose.yml` (app Dockerfiles live in `apps/*/Dockerfile`)
- Build images: bun run docker:build
- Start: bun run docker:up
- Logs: bun run docker:logs
- Stop: bun run docker:down

Environment variables are read from each app's `.env` file (baked into web builds for public variables) and overridden in `docker-compose.yml` for container networking.

For more details, see the guide on [Deploying with Docker Compose](https://www.better-t-stack.dev/docs/guides/docker).

## Git Hooks and Formatting

- Run checks: `bun run check`

## Project Structure

```
hollou/
├── apps/
│   ├── web/         # Next.js app
│   └── jobs/        # Python data jobs (NISAR ingestion)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Oxlint and Oxfmt
- `bun run docker:build`: Build the Docker Compose images
- `bun run docker:up`: Build and start the Docker Compose stack
- `bun run docker:logs`: Tail logs from the Docker Compose stack
- `bun run docker:down`: Stop the Docker Compose stack
