-- ============================================================
-- Skillistan — Phase 1 Database Schema (PostgreSQL / Supabase)
-- ============================================================
-- NOTE: The database is NOT connected yet. This file is the
-- single source of truth for the schema and will be executed
-- against Supabase PostgreSQL when the backend phase begins.
-- ============================================================

-- Admin users (email + password auth, hashed server-side)
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Events
create table if not exists events (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text not null unique,
  description          text not null default '',
  event_date           timestamptz not null,
  location             text not null default '',
  image_url            text,
  registration_enabled boolean not null default false,
  status               text not null default 'draft'
                       check (status in ('draft', 'published', 'archived')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Event registrations (public form)
create table if not exists event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events (id) on delete cascade,
  first_name text not null,
  last_name  text not null,
  email      text not null,
  mobile     text not null,
  message    text,
  created_at timestamptz not null default now(),
  unique (event_id, email)
);

-- Stories / blog posts
create table if not exists stories (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  excerpt            text not null default '',
  content            text not null default '',
  featured_image_url text,
  status             text not null default 'draft'
                     check (status in ('draft', 'published', 'archived')),
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Contact messages (public form)
create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name  text not null,
  email      text not null,
  mobile     text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Volunteer applications (public form)
create table if not exists volunteer_applications (
  id         uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name  text not null,
  email      text not null,
  mobile     text not null,
  message    text,
  created_at timestamptz not null default now()
);

-- Newsletter subscribers (public form)
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- Helpful indexes for common queries
create index if not exists idx_events_status_date on events (status, event_date desc);
create index if not exists idx_stories_status_published on stories (status, published_at desc);
create index if not exists idx_registrations_event on event_registrations (event_id);
