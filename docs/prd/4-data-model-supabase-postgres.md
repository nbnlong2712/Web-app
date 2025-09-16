# 4) Data Model (Supabase / Postgres)
> To **minimize MVP**, use `tags text[]` instead of join tables; normalize later.

**tables.tools**
- `id uuid pk default gen_random_uuid()`
- `name text not null`
- `slug text unique not null`
- `description text`
- `homepage_url text`
- `affiliate_url text`  — UTM appended on server during redirect
- `primary_tag text`    — e.g., 'image-generation', 'text-to-video'
- `tags text[]`         — e.g., {'images','image-generator'}
- `pricing text`        — 'free'|'freemium'|'paid'
- `platform text`       — 'web'|'api'|'desktop'
- `language text[]`     — {'en','vi'} (optional)
- `no_signup boolean default false`
- `status text default 'live'` — 'live'|'beta'|'deprecated'
- `last_updated date`
- `created_at timestamp default now()`

**tables.clicks**
- `id bigint pk generated always as identity`
- `tool_id uuid references tools(id)`
- `clicked_at timestamp default now()`
- `referrer text`
- `utm_source text`
- `utm_medium text`
- `utm_campaign text`
- `ip inet`            — optional (Edge)

**Indexes / FTS**
- `GIN` on `to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,''))`
- `GIN` on `tags`
- `GIN` trigram on `name` (pg_trgm)
- `BTREE` on `primary_tag`, `pricing`, `status`

**RLS Policies (suggested)**
- `tools`: `SELECT` allowed for `anon` (public read). `INSERT/UPDATE/DELETE` only for `service_role`.
- `clicks`: allow `INSERT` by `anon`, but **deny `SELECT`** (protect data). Optionally limit columns via `WITH CHECK`.
