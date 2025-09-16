# AI Tools Library - Project Documentation

## Project Overview

The AI Tools Library is a web application that allows users to discover AI tools through natural language queries. Users can describe their needs in English or Vietnamese and receive 1-3 suitable AI tools in ≤2 interactions, optimized for affiliate click-outs with a target CTR of ≥8%.

## Core Features

1. **Natural Language Search**: Chat-style input on the home page where users can describe their needs
2. **Tool Discovery**: Card grid display of AI tools with filtering capabilities
3. **Tool Details**: Detailed view of tools with affiliate tracking
4. **Admin Interface**: Tool management and CSV import functionality
5. **Analytics**: Click tracking and performance metrics

## Technology Stack

- **Frontend**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components and Framer Motion for animations
- **UI Theme**: Neo-Glassmorphism (dark gradient background, glass cards and modals)
- **Backend**: Supabase (PostgreSQL with Row Level Security)
- **Deployment**: Vercel
- **Analytics**: Plausible or Google Analytics 4

## Project Structure

```
ai-tools-library/
├─ app/                          # Next.js app directory
│  ├─ layout.tsx                 # Root layout
│  ├─ page.tsx                   # Home page (SSR search)
│  ├─ library/
│  │  └─ page.tsx               # Library page (ISR)
│  ├─ t/
│  │  └─ [slug]/
│  │     └─ page.tsx            # Tool detail page (ISR)
│  ├─ go/
│  │  └─ [slug]/
│  │     └─ route.ts            # Edge redirect + click log
│  ├─ api/
│  │  ├─ suggest/
│  │  │  └─ route.ts            # (opt) chips/autocomplete
│  │  └─ log-click/
│  │     └─ route.ts            # click logging (server role)
│  └─ admin/
│     └─ import/
│        └─ page.tsx            # (opt) CSV import UI (env/role gated)
├─ components/                   # React components
│  ├─ ui/                       # shadcn/ui components
│  ├─ ToolCard.tsx
│  ├─ ToolDetail.tsx
│  ├─ Filters.tsx
│  ├─ SearchBox.tsx
│  └─ Skeletons.tsx
├─ lib/                         # Business logic and utilities
│  ├─ supabase/
│  │  ├─ client.ts             # anon client (browser/server components)
│  │  └─ admin.ts              # service role client (server only)
│  ├─ intent/
│  │  ├─ parse.ts              # non-LLM intent mapping (EN/VI)
│  │  └─ synonyms.ts           # tag & synonym dictionaries
│  ├─ db/
│  │  ├─ queries.ts            # typed SQL/RPC helpers
│  │  └─ types.ts              # DB types
│  ├─ analytics.ts             # Plausible/GA wrappers
│  ├─ config.ts                # constants (budgets, feature flags)
│  └─ utils.ts                 # misc helpers
├─ styles/                      # Global styles
│  ├─ globals.css
│  └─ tailwind.css
├─ public/                      # Static assets
│  └─ og/                      # dynamic/static OG assets
├─ supabase/                    # Database migrations and seed data
│  ├─ migrations/              # SQL migrations: tools, clicks, submissions
│  ├─ seed/
│  │  └─ tools.csv             # initial dataset (optional)
│  └─ init.sql                 # extensions + policies bootstrap
├─ scripts/                     # Utility scripts
│  ├─ import-csv.ts            # bulk import script
│  └─ revalidate.ts            # on-demand ISR revalidate
├─ tests/                       # Test files
│  ├─ unit/
│  │  └─ intent-parser.test.ts
│  ├─ e2e/
│  └─ utils/
├─ .env.example
├─ next.config.mjs
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

## Data Model

### Tools Table
```sql
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  homepage_url text,
  affiliate_url text,
  primary_tag text,
  tags text[],
  pricing text check (pricing in ('free','freemium','paid')),
  platform text check (platform in ('web','api','desktop')),
  language text[],
  no_signup boolean default false,
  status text default 'live',
  last_updated date,
  created_at timestamp default now()
);
```

### Clicks Table
```sql
create table if not exists clicks (
  id bigserial primary key,
  tool_id uuid references tools(id) on delete set null,
  clicked_at timestamp default now(),
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip inet
);
```

### Submissions Table (Optional)
```sql
create table if not exists submissions (
  id bigserial primary key,
  name text not null,
  homepage_url text not null,
  description text,
  email text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamp default now()
);
```

## Key User Stories

1. **US-01** (P0): As a visitor, I want a chat-style input on the home page to describe my need in natural language so that the system can quickly suggest suitable tools.

2. **US-03** (P0): As a visitor, I want to filter by category, tags, price (free/paid), output type (Text/Image/Video/Code), use case so that I can narrow the results.

3. **US-04** (P0): As a visitor, I want a card grid with image, name, short description, tags, and an Open ↗ button so that I can scan quickly.

4. **US-05** (P0): As a visitor, I want a tool detail modal/page with description, pricing, tags, last_updated, and a Visit (affiliate) button so that I can decide to use it.

5. **US-06** (P0): As a product owner, I want to track outbound clicks from the Visit button (attach UTM/ID) so that I can measure CTR and affiliate revenue.

6. **US-07** (P0): As an admin/editor, I want to add/edit tools (name, slug, description, link, affiliate_id, pricing, category, tags, last_updated) so that I can seed the initial 100–200 tools.

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_ACCESS_KEY=choose-a-strong-random
```

## Performance Targets

- Home TTFB (SSR) ≤ 500ms
- Filter response time ≤ 300ms
- Lighthouse Performance ≥ 85
- Lighthouse Accessibility ≥ 90

## Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "import:csv": "ts-node ./scripts/import-csv.ts",
    "revalidate": "ts-node ./scripts/revalidate.ts",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Deployment

The application is designed to be deployed on Vercel with Supabase as the backend. The deployment process includes:

1. Setting up environment variables
2. Running database migrations
3. Seeding initial data
4. Configuring custom domains and SSL certificates

## Future Enhancements

1. Normalize tags into separate tables with admin UI
2. Implement embeddings and reranking for semantic search
3. Add user accounts with bookmarks/collections
4. Develop a lightweight crawler for updating last_updated fields and checking dead links