-- NM Studio menu builder — run this once in Supabase's SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.menus (
  slug text primary key,
  pin_hash text not null,
  business_name text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menus enable row level security;

-- Anyone can read a menu (needed so a scanned QR code works for any visitor).
drop policy if exists "public read menus" on public.menus;
create policy "public read menus"
  on public.menus for select
  using (true);

-- No direct write access from the public key: every write goes through the
-- functions below, which check the client's PIN themselves.
revoke insert, update, delete on public.menus from anon;

create or replace function public.create_menu(
  p_slug text,
  p_pin text,
  p_business_name text,
  p_data jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.menus where slug = p_slug) then
    raise exception 'slug_taken';
  end if;
  insert into public.menus (slug, pin_hash, business_name, data)
  values (p_slug, crypt(p_pin, gen_salt('bf')), p_business_name, p_data);
end;
$$;

create or replace function public.update_menu(
  p_slug text,
  p_pin text,
  p_business_name text,
  p_data jsonb
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ok boolean;
begin
  select (pin_hash = crypt(p_pin, pin_hash)) into v_ok
  from public.menus where slug = p_slug;

  if v_ok is not true then
    return false;
  end if;

  update public.menus
    set business_name = p_business_name,
        data = p_data,
        updated_at = now()
  where slug = p_slug;

  return true;
end;
$$;

grant execute on function public.create_menu(text, text, text, jsonb) to anon;
grant execute on function public.update_menu(text, text, text, jsonb) to anon;
