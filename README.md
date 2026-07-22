# IT Ticket Dashboard

An internal IT support ticket management dashboard built on [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack).

## Features Implemented

- **Full Ticket CRUD**: Create, read, update, and delete tickets.
- **Dynamic Stats**: Quick metrics for Total, Open, In Progress, and High Priority tickets.
- **Advanced Filtering & Sorting**: Filter by status, priority, or perform a text search across title, assignee, and notes.
- **Visual Status & Priority**: Color-coded badges for easy scanning.
- **Responsive Design**: Adapts from a desktop data table to mobile-friendly cards.

## Technologies Used

- **Frontend**: React 19, TanStack Router, TanStack Query, Tailwind CSS v4, shadcn UI (Base UI).
- **Backend**: Hono, tRPC, Drizzle ORM, Turso (SQLite).
- **Tooling**: Bun, Biome, Husky, Turborepo.

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses SQLite with Drizzle ORM. Local development uses a local file `local.db`.

Apply the schema to your database:

```bash
bun run db:push
```

## Run the Application

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the dashboard.
The API is running at [http://localhost:3000](http://localhost:3000).

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

## Deployment

### Vercel Services

- Target: web + server
- Config: `vercel.json`
- Link the project first: `bun run deploy:setup`
- Preview deploy: `bun run deploy`
- Production deploy: `bun run deploy:prod`

For Vercel environment variables, use the sync commands (`env:preview`, `env:production`) to push your local `.env` settings.
