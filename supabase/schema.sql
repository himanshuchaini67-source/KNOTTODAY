-- ============================================================
-- WEDDING EVENT MANAGER — Database Schema
-- ============================================================
-- This schema is for future Supabase integration.
-- It is NOT used in the current frontend-only build.
-- Run this in your Supabase SQL editor when ready to connect.
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: weddings
-- ============================================================
create table if not exists public.weddings (
  id uuid primary key default uuid_generate_v4(),
  bride_name text not null,
  groom_name text not null,
  wedding_date timestamptz not null,
  location text,
  couple_initials text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: wedding_events
-- ============================================================
create table if not exists public.wedding_events (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  date text,
  time text,
  location text,
  description text,
  dress_code text,
  responsible_person text,
  notes text,
  status text default 'Upcoming' check (status in ('Upcoming', 'In Progress', 'Completed')),
  image_url text,
  is_custom boolean default false,
  stage_number integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: tasks
-- ============================================================
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  category text,
  due_date text,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  status text default 'Pending' check (status in ('Pending', 'In Progress', 'Completed')),
  assigned_person text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: guests
-- ============================================================
create table if not exists public.guests (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  side text check (side in ('Bride', 'Groom')),
  number_of_guests integer default 1,
  rsvp text default 'Pending' check (rsvp in ('Confirmed', 'Pending', 'Declined')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: vendors
-- ============================================================
create table if not exists public.vendors (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references public.weddings(id) on delete cascade,
  name text not null,
  category text not null,
  location text,
  rating numeric default 0,
  price_range text,
  description text,
  image_url text,
  phone text,
  whatsapp text,
  services text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: bookings
-- ============================================================
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  customer_name text not null,
  event_date date,
  event_type text,
  notes text,
  status text default 'Pending' check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: jewellery
-- ============================================================
create table if not exists public.jewellery (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  for_whom text check (for_whom in ('Bride', 'Groom')),
  rental_price numeric not null,
  security_deposit numeric not null,
  availability text default 'Available' check (availability in ('Available', 'Limited', 'Booked')),
  rental_duration text,
  description text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: jewellery_rentals
-- ============================================================
create table if not exists public.jewellery_rentals (
  id uuid primary key default uuid_generate_v4(),
  jewellery_id uuid not null references public.jewellery(id) on delete cascade,
  wedding_id uuid references public.weddings(id) on delete cascade,
  customer_name text not null,
  rental_date date not null,
  return_date date not null,
  rental_price numeric,
  security_deposit numeric,
  notes text,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Active', 'Returned', 'Cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: clothes
-- ============================================================
create table if not exists public.clothes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  for_whom text check (for_whom in ('Bride', 'Groom')),
  size text,
  color text,
  rental_price numeric not null,
  security_deposit numeric not null,
  availability text default 'Available' check (availability in ('Available', 'Limited', 'Booked')),
  rental_duration text,
  description text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: clothes_rentals
-- ============================================================
create table if not exists public.clothes_rentals (
  id uuid primary key default uuid_generate_v4(),
  clothes_id uuid not null references public.clothes(id) on delete cascade,
  wedding_id uuid references public.weddings(id) on delete cascade,
  customer_name text not null,
  size text,
  rental_date date not null,
  return_date date not null,
  rental_price numeric,
  security_deposit numeric,
  notes text,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Active', 'Returned', 'Cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: sangeet_performances
-- ============================================================
create table if not exists public.sangeet_performances (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  song text,
  side text check (side in ('Bride', 'Groom')),
  participants text,
  practice_date text,
  practice_time text,
  duration text,
  status text default 'Planned' check (status in ('Planned', 'Practicing', 'Ready', 'Completed')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: budget_items
-- ============================================================
create table if not exists public.budget_items (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  category text not null,
  description text,
  planned numeric default 0,
  spent numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: notifications
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  message text,
  type text default 'info' check (type in ('info', 'success', 'warning', 'reminder')),
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE: support_requests
-- ============================================================
create table if not exists public.support_requests (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references public.weddings(id) on delete cascade,
  name text not null,
  phone text,
  issue text,
  description text,
  preferred_contact text check (preferred_contact in ('Call', 'WhatsApp', 'Email')),
  status text default 'Open' check (status in ('Open', 'In Progress', 'Resolved')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_wedding_events_wedding_id on public.wedding_events(wedding_id);
create index if not exists idx_tasks_wedding_id on public.tasks(wedding_id);
create index if not exists idx_guests_wedding_id on public.guests(wedding_id);
create index if not exists idx_vendors_wedding_id on public.vendors(wedding_id);
create index if not exists idx_bookings_wedding_id on public.bookings(wedding_id);
create index if not exists idx_jewellery_rentals_jewellery_id on public.jewellery_rentals(jewellery_id);
create index if not exists idx_clothes_rentals_clothes_id on public.clothes_rentals(clothes_id);
create index if not exists idx_sangeet_wedding_id on public.sangeet_performances(wedding_id);
create index if not exists idx_budget_items_wedding_id on public.budget_items(wedding_id);
create index if not exists idx_notifications_wedding_id on public.notifications(wedding_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) RECOMMENDATIONS
-- ============================================================
-- Enable RLS on all tables:
--   alter table public.<table_name> enable row level security;
--
-- Recommended policies (per table):
--
--   SELECT: Users can only see rows for their own wedding.
--     create policy "Select own wedding data" on public.<table>
--       for select using (
--         wedding_id in (
--           select id from public.weddings
--           where owner_id = auth.uid()
--         )
--       );
--
--   INSERT: Users can only insert rows for their own wedding.
--     create policy "Insert own wedding data" on public.<table>
--       for insert with check (
--         wedding_id in (
--           select id from public.weddings
--           where owner_id = auth.uid()
--         )
--       );
--
--   UPDATE: Users can only update rows for their own wedding.
--     create policy "Update own wedding data" on public.<table>
--       for update using (
--         wedding_id in (
--           select id from public.weddings
--           where owner_id = auth.uid()
--         )
--       );
--
--   DELETE: Users can only delete rows for their own wedding.
--     create policy "Delete own wedding data" on public.<table>
--       for delete using (
--         wedding_id in (
--           select id from public.weddings
--           where owner_id = auth.uid()
--         )
--       );
--
-- NOTE: Add an `owner_id uuid references auth.users(id)` column
-- to the `weddings` table before enabling the above policies.

-- ============================================================
-- STORAGE BUCKETS (for future image uploads)
-- ============================================================
-- Create these buckets in Supabase Storage when ready:
--   - jewellery-images
--   - clothing-images
--   - vendor-images
--   - photography-images
--   - profile-images
--   - documents
--
-- RLS for storage: only authenticated users can read/write
-- to their own wedding's image folders.
