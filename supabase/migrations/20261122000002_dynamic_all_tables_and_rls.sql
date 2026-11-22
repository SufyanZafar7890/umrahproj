-- ====================================================================
-- UMRAH TAXI ONLINE: COMPLETE DYNAMIC SUPABASE DATABASE SCHEMA & POLICIES
-- ====================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ====================================================================
-- TABLE 1: SITE SETTINGS (Dynamic WhatsApp, Phone, Address, SLA, etc.)
-- ====================================================================
create table if not exists public.site_settings (
    id uuid primary key default uuid_generate_v4(),
    key text unique not null,
    value text not null,
    label text,
    category text default 'general',
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- TABLE 2: VEHICLES (Fleet Specifications & Amenities)
-- ====================================================================
create table if not exists public.vehicles (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    category text not null, -- 'Sedan', 'MPV', 'Minibus', 'VIP SUV'
    max_passengers integer not null default 4,
    max_luggage integer not null default 2,
    image_url text not null,
    features text[] not null default array[]::text[],
    display_order integer default 0,
    is_active boolean default true not null
);

-- ====================================================================
-- TABLE 3: ROUTES (Pilgrim Transfers & Ziyarat Excursions)
-- ====================================================================
create table if not exists public.routes (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    slug text unique not null,
    title text not null,
    origin_city text not null,
    destination_city text not null,
    distance_km numeric(6, 1) not null,
    duration_mins integer not null,
    is_popular boolean default false not null,
    display_order integer default 0,
    is_active boolean default true not null
);

-- ====================================================================
-- TABLE 4: ROUTE PRICING (Dynamic Matrix: Route + Vehicle -> Rate in SAR)
-- ====================================================================
create table if not exists public.route_pricing (
    id uuid primary key default uuid_generate_v4(),
    route_id uuid references public.routes(id) on delete cascade not null,
    vehicle_id uuid references public.vehicles(id) on delete cascade not null,
    price_sar numeric(8, 2) not null,
    unique(route_id, vehicle_id)
);

-- ====================================================================
-- TABLE 5: TESTIMONIALS (Pilgrim Feedback & Ratings)
-- ====================================================================
create table if not exists public.testimonials (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    country text not null,
    rating integer not null default 5,
    review_text text not null,
    trip_date text,
    is_verified boolean default true not null,
    display_order integer default 0,
    is_active boolean default true not null
);

-- ====================================================================
-- TABLE 6: FAQS (Dynamic Questions & Answers)
-- ====================================================================
create table if not exists public.faqs (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    question text not null,
    answer text not null,
    category text default 'general',
    display_order integer default 0,
    is_active boolean default true not null
);

-- ====================================================================
-- TABLE 7: BOOKINGS (Customer Leads & Chauffeur Allocations)
-- ====================================================================
create table if not exists public.bookings (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    booking_reference text unique not null,
    route_id text not null,
    route_title text not null,
    vehicle_name text not null,
    customer_name text not null,
    customer_phone text not null,
    travel_date date not null,
    pickup_time text,
    flight_number text,
    passengers integer not null default 1,
    luggage integer not null default 1,
    estimated_price_sar numeric(8, 2) not null,
    status text not null default 'pending', -- 'pending', 'confirmed', 'dispatched', 'completed', 'cancelled'
    notes text
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
alter table public.site_settings enable row level security;
alter table public.vehicles enable row level security;
alter table public.routes enable row level security;
alter table public.route_pricing enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.bookings enable row level security;

-- Drop existing policies if any to avoid duplication errors
drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Public can read active vehicles" on public.vehicles;
drop policy if exists "Public can read active routes" on public.routes;
drop policy if exists "Public can read route pricing" on public.route_pricing;
drop policy if exists "Public can read active testimonials" on public.testimonials;
drop policy if exists "Public can read active faqs" on public.faqs;
drop policy if exists "Public can insert bookings" on public.bookings;
drop policy if exists "Authenticated staff full access settings" on public.site_settings;
drop policy if exists "Authenticated staff full access vehicles" on public.vehicles;
drop policy if exists "Authenticated staff full access routes" on public.routes;
drop policy if exists "Authenticated staff full access pricing" on public.route_pricing;
drop policy if exists "Authenticated staff full access testimonials" on public.testimonials;
drop policy if exists "Authenticated staff full access faqs" on public.faqs;
drop policy if exists "Authenticated staff full access bookings" on public.bookings;

-- 1. Site Settings Policies
create policy "Public can read site settings" on public.site_settings for select using (true);
create policy "Authenticated staff full access settings" on public.site_settings for all using (auth.role() = 'authenticated');

-- 2. Vehicles Policies
create policy "Public can read active vehicles" on public.vehicles for select using (is_active = true);
create policy "Authenticated staff full access vehicles" on public.vehicles for all using (auth.role() = 'authenticated');

-- 3. Routes Policies
create policy "Public can read active routes" on public.routes for select using (is_active = true);
create policy "Authenticated staff full access routes" on public.routes for all using (auth.role() = 'authenticated');

-- 4. Route Pricing Policies
create policy "Public can read route pricing" on public.route_pricing for select using (true);
create policy "Authenticated staff full access pricing" on public.route_pricing for all using (auth.role() = 'authenticated');

-- 5. Testimonials Policies
create policy "Public can read active testimonials" on public.testimonials for select using (is_active = true);
create policy "Authenticated staff full access testimonials" on public.testimonials for all using (auth.role() = 'authenticated');

-- 6. FAQs Policies
create policy "Public can read active faqs" on public.faqs for select using (is_active = true);
create policy "Authenticated staff full access faqs" on public.faqs for all using (auth.role() = 'authenticated');

-- 7. Bookings Policies (Public can submit leads, Staff can view/edit all)
create policy "Public can insert bookings" on public.bookings for insert with check (true);
create policy "Authenticated staff full access bookings" on public.bookings for all using (auth.role() = 'authenticated');
