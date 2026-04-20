create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text,
  email text,
  phone text,
  role text default 'user',
  created_at timestamptz default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  category text,
  type text,
  description text,
  price text,
  parish text,
  district text,
  community text,
  contact_phone text,
  image_url text,
  status text default 'pending',
  featured boolean default false,
  featured_expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.favorite_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  listing_id uuid references public.listings(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  reported_by uuid,
  reason text,
  created_at timestamptz default now()
);

create table if not exists public.featured_payments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  user_id uuid,
  tier_name text,
  amount numeric,
  currency text default 'JMD',
  status text default 'pending',
  provider text default 'wipay',
  provider_reference text,
  created_at timestamptz default now()
);

alter table public.listings enable row level security;
alter table public.favorite_listings enable row level security;
alter table public.featured_payments enable row level security;

drop policy if exists "public can read approved listings" on public.listings;
create policy "public can read approved listings"
on public.listings for select
using (status = 'approved');

drop policy if exists "authenticated can insert listings" on public.listings;
create policy "authenticated can insert listings"
on public.listings for insert
to authenticated
with check (true);

drop policy if exists "users can view own favorites" on public.favorite_listings;
create policy "users can view own favorites"
on public.favorite_listings for select
to authenticated
using (true);

drop policy if exists "users can add favorites" on public.favorite_listings;
create policy "users can add favorites"
on public.favorite_listings for insert
to authenticated
with check (true);
