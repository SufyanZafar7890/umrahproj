-- ====================================================================
-- UMRAH TAXI ONLINE: FIX ALL RLS POLICIES FOR FULL ADMIN READ/WRITE
-- (Run this script in Supabase SQL Editor to allow Admin Updates)
-- ====================================================================

-- 1. SITE SETTINGS (Allow Full Read, Insert, Update, Delete)
drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Authenticated staff full access settings" on public.site_settings;
drop policy if exists "Allow all access to site_settings" on public.site_settings;
create policy "Allow all access to site_settings"
    on public.site_settings for all
    using (true)
    with check (true);

-- 2. VEHICLES (Allow Full Read, Insert, Update, Delete)
drop policy if exists "Public can read active vehicles" on public.vehicles;
drop policy if exists "Authenticated staff full access vehicles" on public.vehicles;
drop policy if exists "Allow all access to vehicles" on public.vehicles;
create policy "Allow all access to vehicles"
    on public.vehicles for all
    using (true)
    with check (true);

-- 3. ROUTES (Allow Full Read, Insert, Update, Delete)
drop policy if exists "Public can read active routes" on public.routes;
drop policy if exists "Authenticated staff full access routes" on public.routes;
drop policy if exists "Allow all access to routes" on public.routes;
create policy "Allow all access to routes"
    on public.routes for all
    using (true)
    with check (true);

-- 4. ROUTE PRICING (Allow Full Read, Insert, Update, Delete)
drop policy if exists "Public can read route pricing" on public.route_pricing;
drop policy if exists "Authenticated staff full access pricing" on public.route_pricing;
drop policy if exists "Allow all access to route_pricing" on public.route_pricing;
create policy "Allow all access to route_pricing"
    on public.route_pricing for all
    using (true)
    with check (true);

-- 5. TESTIMONIALS (Allow Full Read, Insert, Update, Delete)
drop policy if exists "Public can read active testimonials" on public.testimonials;
drop policy if exists "Authenticated staff full access testimonials" on public.testimonials;
drop policy if exists "Allow all access to testimonials" on public.testimonials;
create policy "Allow all access to testimonials"
    on public.testimonials for all
    using (true)
    with check (true);

-- 6. FAQS (Allow Full Read, Insert, Update, Delete)
drop policy if exists "Public can read active faqs" on public.faqs;
drop policy if exists "Authenticated staff full access faqs" on public.faqs;
drop policy if exists "Allow all access to faqs" on public.faqs;
create policy "Allow all access to faqs"
    on public.faqs for all
    using (true)
    with check (true);

-- 7. BOOKINGS (Allow Full Read, Insert, Update, Delete)
drop policy if exists "Public can insert bookings" on public.bookings;
drop policy if exists "Authenticated staff full access bookings" on public.bookings;
drop policy if exists "Allow all access to bookings" on public.bookings;
create policy "Allow all access to bookings"
    on public.bookings for all
    using (true)
    with check (true);

-- 8. ADMIN USERS (Allow Login & Updates)
create table if not exists public.admin_users (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    username text unique not null,
    password text not null,
    role text not null default 'superadmin',
    is_active boolean not null default true
);

alter table public.admin_users enable row level security;
drop policy if exists "Allow select for admin authentication" on public.admin_users;
drop policy if exists "Allow all access to admin_users" on public.admin_users;
create policy "Allow all access to admin_users"
    on public.admin_users for all
    using (true)
    with check (true);

-- Insert/Update Default Admin User
insert into public.admin_users (username, password, role, is_active)
values ('admin', 'umrah@admin2026', 'superadmin', true)
on conflict (username) do update
set password = excluded.password,
    is_active = true;

-- Verification Check
select tablename, rowsecurity from pg_tables where schemaname = 'public';
