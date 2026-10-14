-- ============================================================================
-- للتبريد والتكييف — CMS schema (PRD §13, Supabase edition)
-- Content management ONLY. There are deliberately NO bookings, customers,
-- leads or tracking tables: the booking flow goes directly to WhatsApp (D1).
-- ============================================================================
create extension if not exists "pgcrypto";

-- ── Content tables ──────────────────────────────────────────────────────────
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name jsonb not null check (name ? 'ar' and name ? 'en'),
  short_description jsonb not null,
  long_description jsonb not null default '{}'::jsonb,
  problems_covered jsonb not null default '[]'::jsonb,
  technician_checks jsonb not null default '[]'::jsonb,
  icon text not null default 'ac',
  seo jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sub_services (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references services(slug) on delete cascade,
  slug text not null,
  name jsonb not null check (name ? 'ar' and name ? 'en'),
  short_description jsonb not null default '{}'::jsonb,
  is_problem boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_slug, slug)
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question jsonb not null check (question ? 'ar' and question ? 'en'),
  answer jsonb not null check (answer ? 'ar' and answer ? 'en'),
  category_slug text references services(slug) on delete set null,
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null check (title ? 'ar' and title ? 'en'),
  excerpt jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  main_image_url text,
  published_at timestamptz,
  seo jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  text jsonb not null check (text ? 'ar' and text ? 'en'),
  photo_url text,
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption jsonb not null default '{}'::jsonb,
  tag text not null check (tag in ('ac','refrigerator','washing-machine','shop')),
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists areas (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null check (name ? 'ar' and name ? 'en'),
  info jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pages (
  key text primary key check (key in ('about','privacy','terms')),
  title jsonb not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text not null,
  bucket text not null default 'media',
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists activity (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id text,
  title text not null default '',
  at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  entity_ref text,
  read boolean not null default false,
  at timestamptz not null default now()
);

-- ── Row Level Security ─────────────────────────────────────────────────────
-- Public (anon): read published rows only. Writes: service-role only
-- (bypasses RLS; the server action layer re-verifies the allow-listed
-- admin on every mutation). No anon inserts/updates/deletes anywhere.
alter table services      enable row level security;
alter table sub_services  enable row level security;
alter table faqs          enable row level security;
alter table blogs         enable row level security;
alter table reviews       enable row level security;
alter table photos        enable row level security;
alter table areas         enable row level security;
alter table pages         enable row level security;
alter table settings      enable row level security;
alter table media         enable row level security;
alter table activity      enable row level security;
alter table notifications enable row level security;

create policy "public read published services"     on services      for select using (status = 'published');
create policy "public read published sub_services" on sub_services  for select using (status = 'published');
create policy "public read published faqs"         on faqs          for select using (status = 'published');
create policy "public read published blogs"        on blogs         for select using (status = 'published');
create policy "public read published reviews"      on reviews       for select using (status = 'published');
create policy "public read published photos"       on photos        for select using (status = 'published');
create policy "public read published areas"        on areas         for select using (status = 'published');
create policy "public read published pages"        on pages         for select using (status = 'published');
create policy "public read settings"               on settings      for select using (true);
create policy "public read media"                  on media         for select using (true);
-- activity/notifications: no anon policies (server/admin only)

-- Authenticated (the single admin, when using user session instead of
-- service role): full CRUD on content tables.
create policy "admin write services"      on services      for all to authenticated using (true) with check (true);
create policy "admin write sub_services"  on sub_services  for all to authenticated using (true) with check (true);
create policy "admin write faqs"          on faqs          for all to authenticated using (true) with check (true);
create policy "admin write blogs"         on blogs         for all to authenticated using (true) with check (true);
create policy "admin write reviews"       on reviews       for all to authenticated using (true) with check (true);
create policy "admin write photos"        on photos        for all to authenticated using (true) with check (true);
create policy "admin write areas"         on areas         for all to authenticated using (true) with check (true);
create policy "admin write pages"         on pages         for all to authenticated using (true) with check (true);
create policy "admin write settings"      on settings      for all to authenticated using (true) with check (true);
create policy "admin write media"         on media         for all to authenticated using (true) with check (true);
create policy "admin write activity"      on activity      for all to authenticated using (true) with check (true);
create policy "admin write notifications" on notifications for all to authenticated using (true) with check (true);

-- ── Storage bucket for the media library (public read, admin write) ────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
