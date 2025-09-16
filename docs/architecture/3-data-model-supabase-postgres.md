# 3) Data Model (Supabase / Postgres)
**Tables**
- `tools`: Core catalog of AI tools and attributes.  
- `clicks`: Outbound click logs, insert-only by anonymous.  
- `submissions` (optional): User-submitted tools awaiting moderation.

**Schema (DDL)**
```sql
-- Enable extensions once per database (if not already):
-- create extension if not exists pg_trgm;
-- create extension if not exists pgcrypto; -- for gen_random_uuid()

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

create table if not exists submissions (
  id bigserial primary key,
  name text not null,
  homepage_url text not null,
  description text,
  email text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamp default now()
);

-- Indexes & FTS
create index if not exists idx_tools_tags_gin on tools using gin(tags);
create index if not exists idx_tools_primary_tag on tools(primary_tag);
create index if not exists idx_tools_pricing on tools(pricing);
create index if not exists idx_tools_status on tools(status);
-- Optional: trigram + FTS over name+description
-- create index if not exists idx_tools_name_trgm on tools using gin (name gin_trgm_ops);
-- create index if not exists idx_tools_fts on tools using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));
```

**RLS Policies (sketch)**
```sql
-- Tools: public read
alter table tools enable row level security;
create policy tools_public_read on tools for select using (true);

-- Clicks: anonymous insert, no select
alter table clicks enable row level security;
create policy clicks_insert_only on clicks for insert with check (true);
create policy clicks_no_select on clicks for select using (false);
```

**Notes**
- Start with `tags text[]` for speed; normalize into join tables post‑MVP.
- Ensure `slug` uniqueness; generate from name when missing.

---
