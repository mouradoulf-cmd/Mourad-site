-- Menu Sabai — database schema for Supabase (Postgres)
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create extension if not exists "pgcrypto";

-- One row per merchant account, linked 1:1 to a Supabase Auth user.
create table if not exists merchants (
  id uuid primary key references auth.users(id) on delete cascade,
  restaurant_name text not null default 'Mon restaurant',
  tagline text not null default '',
  slug text unique not null,
  plan text not null default 'standard' check (plan in ('standard', 'premium', 'elite')),
  subscription_status text not null default 'inactive' check (subscription_status in ('active', 'inactive', 'past_due')),
  line_user_id text,
  created_at timestamptz not null default now()
);

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  name text not null,
  name_en text not null default '',
  name_th text not null default '',
  desc_fr text not null default '',
  desc_en text not null default '',
  desc_th text not null default '',
  category text not null default 'Plats',
  price numeric not null default 0,
  photo_url text,
  is_bestseller boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  items jsonb not null,
  total numeric not null,
  table_label text,
  status text not null default 'new' check (status in ('new', 'preparing', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists dishes_merchant_idx on dishes (merchant_id);
create index if not exists orders_merchant_idx on orders (merchant_id);

alter table merchants enable row level security;
alter table dishes enable row level security;
alter table orders enable row level security;

-- Merchants manage only their own account row.
create policy "merchant reads own row" on merchants
  for select using (auth.uid() = id);
create policy "merchant updates own row" on merchants
  for update using (auth.uid() = id);
create policy "merchant creates own row on signup" on merchants
  for insert with check (auth.uid() = id);

-- Anyone (including logged-out visitors scanning a QR code) can read a merchant's
-- public storefront fields once their subscription is active.
create policy "public reads active merchant storefronts" on merchants
  for select using (subscription_status = 'active');

-- Merchants manage only their own dishes.
create policy "merchant manages own dishes" on dishes
  for all using (auth.uid() = merchant_id) with check (auth.uid() = merchant_id);

-- Anyone can read the dishes of an active merchant (the public menu page).
create policy "public reads dishes of active merchants" on dishes
  for select using (
    exists (
      select 1 from merchants
      where merchants.id = dishes.merchant_id
      and merchants.subscription_status = 'active'
    )
  );

-- Merchants read only their own incoming orders.
create policy "merchant reads own orders" on orders
  for select using (auth.uid() = merchant_id);
create policy "merchant updates own orders" on orders
  for update using (auth.uid() = merchant_id);

-- Anyone can place an order against an active merchant (the customer never logs in).
create policy "public inserts orders for active merchants" on orders
  for insert with check (
    exists (
      select 1 from merchants
      where merchants.id = orders.merchant_id
      and merchants.subscription_status = 'active'
    )
  );

-- Dish photos, public read (menu pages), owner-only write.
insert into storage.buckets (id, name, public)
values ('dish-photos', 'dish-photos', true)
on conflict (id) do nothing;

create policy "public reads dish photos" on storage.objects
  for select using (bucket_id = 'dish-photos');
create policy "merchant uploads own dish photos" on storage.objects
  for insert with check (bucket_id = 'dish-photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "merchant replaces own dish photos" on storage.objects
  for update using (bucket_id = 'dish-photos' and auth.uid()::text = (storage.foldername(name))[1]);
