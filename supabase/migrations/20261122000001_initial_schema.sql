-- ========================================================
-- Umrah Taxi Web Platform: PostgreSQL DDL Schema
-- ========================================================

create extension if not exists "uuid-ossp";

-- 1. VEHICLES TABLE
create table if not exists public.vehicles (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    category text not null,
    max_passengers integer not null,
    max_luggage integer not null,
    image_url text,
    features text[] default array[]::text[],
    is_active boolean default true not null
);

-- 2. ROUTES TABLE
create table if not exists public.routes (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    slug text unique not null,
    title text not null,
    origin_city text not null,
    destination_city text not null,
    distance_km numeric(6, 1),
    duration_mins integer,
    is_popular boolean default false not null,
    base_price_sar numeric(8, 2) not null default 250,
    is_active boolean default true not null
);

-- 3. ROUTE PRICING MATRIX
create table if not exists public.route_pricing (
    id uuid primary key default uuid_generate_v4(),
    route_id uuid references public.routes(id) on delete cascade not null,
    vehicle_id uuid references public.vehicles(id) on delete cascade not null,
    price_sar numeric(8, 2) not null,
    unique(route_id, vehicle_id)
);

-- 4. DRIVERS TABLE
create table if not exists public.drivers (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    phone_number text not null,
    vehicle_plate text,
    license_number text,
    is_active boolean default true not null
);

-- 5. BOOKINGS / LEADS TABLE
do $$ begin
    create type booking_status as enum ('pending', 'confirmed', 'dispatched', 'completed', 'cancelled');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.bookings (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    booking_reference text unique not null,
    route_id text not null,
    route_title text not null,
    vehicle_name text,
    customer_name text not null,
    customer_phone text not null,
    travel_date date not null,
    pickup_time text,
    flight_number text,
    passengers integer not null default 1,
    luggage integer not null default 1,
    estimated_price_sar numeric(8, 2),
    status booking_status default 'pending' not null,
    notes text
);

-- Row Level Security (RLS)
alter table public.vehicles enable row level security;
alter table public.routes enable row level security;
alter table public.route_pricing enable row level security;
alter table public.bookings enable row level security;
alter table public.drivers enable row level security;

-- Policies for public reading
create policy "Allow public read on vehicles" on public.vehicles for select using (is_active = true);
create policy "Allow public read on routes" on public.routes for select using (is_active = true);
create policy "Allow public read on pricing" on public.route_pricing for select using (true);

-- Policy for public inserting leads
create policy "Allow public insert on bookings" on public.bookings for insert with check (true);

-- Authenticated staff permissions
create policy "Allow staff full access on bookings" on public.bookings for all using (auth.role() = 'authenticated');
create policy "Allow staff full access on drivers" on public.drivers for all using (auth.role() = 'authenticated');
