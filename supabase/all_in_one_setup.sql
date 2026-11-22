-- ====================================================================
-- UMRAH TAXI ONLINE: ALL-IN-ONE COMPLETE SUPABASE SETUP
-- (Tables + RLS Policies + Default Data in One Single Script)
-- ====================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ====================================================================
-- 2. CREATE ALL TABLES
-- ====================================================================

-- TABLE 1: SITE SETTINGS (WhatsApp, Phone, Address, Email, SLA, etc.)
create table if not exists public.site_settings (
    id uuid primary key default uuid_generate_v4(),
    key text unique not null,
    value text not null,
    label text,
    category text default 'general',
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TABLE 2: VEHICLES (Camry, Staria, HiAce, GMC Yukon)
create table if not exists public.vehicles (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    category text not null,
    max_passengers integer not null default 4,
    max_luggage integer not null default 2,
    image_url text not null,
    features text[] not null default array[]::text[],
    display_order integer default 0,
    is_active boolean default true not null
);

-- TABLE 3: ROUTES (Pilgrim Transfers & Ziyarat Excursions)
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

-- TABLE 4: ROUTE PRICING MATRIX (Exact SAR rate per route + vehicle)
create table if not exists public.route_pricing (
    id uuid primary key default uuid_generate_v4(),
    route_id uuid references public.routes(id) on delete cascade not null,
    vehicle_id uuid references public.vehicles(id) on delete cascade not null,
    price_sar numeric(8, 2) not null,
    unique(route_id, vehicle_id)
);

-- TABLE 5: TESTIMONIALS (Customer Reviews & Ratings)
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

-- TABLE 6: FAQS (Dynamic Frequently Asked Questions)
create table if not exists public.faqs (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    question text not null,
    answer text not null,
    category text default 'general',
    display_order integer default 0,
    is_active boolean default true not null
);

-- TABLE 7: BOOKINGS (Customer Leads & Chauffeur Allocations)
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
    status text not null default 'pending',
    notes text
);

-- ====================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
alter table public.site_settings enable row level security;
alter table public.vehicles enable row level security;
alter table public.routes enable row level security;
alter table public.route_pricing enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.bookings enable row level security;

-- Drop previous policies to prevent duplicate errors
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

-- Create Policies
create policy "Public can read site settings" on public.site_settings for select using (true);
create policy "Authenticated staff full access settings" on public.site_settings for all using (auth.role() = 'authenticated');

create policy "Public can read active vehicles" on public.vehicles for select using (is_active = true);
create policy "Authenticated staff full access vehicles" on public.vehicles for all using (auth.role() = 'authenticated');

create policy "Public can read active routes" on public.routes for select using (is_active = true);
create policy "Authenticated staff full access routes" on public.routes for all using (auth.role() = 'authenticated');

create policy "Public can read route pricing" on public.route_pricing for select using (true);
create policy "Authenticated staff full access pricing" on public.route_pricing for all using (auth.role() = 'authenticated');

create policy "Public can read active testimonials" on public.testimonials for select using (is_active = true);
create policy "Authenticated staff full access testimonials" on public.testimonials for all using (auth.role() = 'authenticated');

create policy "Public can read active faqs" on public.faqs for select using (is_active = true);
create policy "Authenticated staff full access faqs" on public.faqs for all using (auth.role() = 'authenticated');

create policy "Public can insert bookings" on public.bookings for insert with check (true);
create policy "Authenticated staff full access bookings" on public.bookings for all using (auth.role() = 'authenticated');

-- ====================================================================
-- 4. INSERT DEFAULT DATA (Settings, Vehicles, Routes, Pricing, FAQs)
-- ====================================================================

-- 1. Site Settings
insert into public.site_settings (key, value, label, category)
values
('whatsapp_number', '966591206299', 'WhatsApp Dispatch Number', 'contact'),
('phone_number', '966591206299', 'Hotline Phone Number', 'contact'),
('support_email', 'dispatch@umrahtaxionline.com', 'Dispatch Support Email', 'contact'),
('company_name', 'Umrah Taxi Online', 'Brand Name', 'general'),
('founder_name', 'Haroon Kainth', 'Founder Name', 'general'),
('hq_address', 'Ash Shubaikah, Makkah 24231, Kingdom of Saudi Arabia', 'Physical HQ Address', 'contact'),
('sla_response_time', '1 – 2 Minutes', 'WhatsApp Response SLA Time', 'service'),
('tga_compliance_text', 'Saudi Transport General Authority (TGA) Compliant Chauffeur Network', 'TGA Compliance Text', 'service'),
('hero_heading', 'Private Umrah Taxi With Zero Advance Deposit', 'Main Hero Title', 'homepage'),
('hero_subheading', 'Pre-book your sanitized private chauffeur for Jeddah Airport (KAIA), Makkah, and Madinah transfers. Pay on safe arrival at your hotel with 100% fixed fares, radar flight delay tracking, and free Miqat stopover.', 'Main Hero Subtitle', 'homepage')
on conflict (key) do update set value = excluded.value, label = excluded.label;

-- 2. Vehicles
insert into public.vehicles (id, name, category, max_passengers, max_luggage, image_url, features, display_order, is_active)
values
('a1111111-1111-1111-1111-111111111111', 'Toyota Camry (Sedan)', 'Sedan', 4, 2, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80', array['Air Conditioned', 'Dual Airbags', 'Spacious Legroom', 'Complimentary Bottled Water'], 1, true),
('a2222222-2222-2222-2222-222222222222', 'Hyundai Staria (Family MPV)', 'MPV', 7, 5, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', array['Captain Seats', 'Dual Zone Climate Control', 'High Roof', 'Extra Luggage Deck'], 2, true),
('a3333333-3333-3333-3333-333333333333', 'Toyota HiAce (Group Van)', 'Minibus', 10, 8, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80', array['High Ceiling', 'Individual Rear AC Vents', 'Family Group Seating', 'Ample Bag Capacity'], 3, true),
('a4444444-4444-4444-4444-444444444444', 'GMC Yukon XL (VIP Luxury)', 'VIP SUV', 7, 6, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80', array['VIP Executive Leather', 'Privacy Tint', 'Ultra Smooth Ride', 'Premium Chauffeur Service'], 4, true)
on conflict (id) do nothing;

-- 3. Routes
insert into public.routes (id, slug, title, origin_city, destination_city, distance_km, duration_mins, is_popular, display_order, is_active)
values
('b1111111-1111-1111-1111-111111111111', 'jeddah-airport-to-makkah-hotel', 'Jeddah Airport (KAIA) to Makkah Hotel', 'Jeddah', 'Makkah', 95.0, 75, true, 1, true),
('b2222222-2222-2222-2222-222222222222', 'makkah-hotel-to-madinah-hotel', 'Makkah Hotel to Madinah Hotel', 'Makkah', 'Madinah', 435.0, 270, true, 2, true),
('b3333333-3333-3333-3333-333333333333', 'madinah-hotel-to-madinah-airport', 'Madinah Hotel to Madinah Airport (MED)', 'Madinah', 'Madinah Airport', 25.0, 30, true, 3, true),
('b4444444-4444-4444-4444-444444444444', 'makkah-ziyarat-tour', 'Makkah Full Day Ziyarat Tour', 'Makkah', 'Makkah Holy Sites', 60.0, 180, true, 4, true),
('b5555555-5555-5555-5555-555555555555', 'madinah-ziyarat-tour', 'Madinah Full Day Ziyarat Tour', 'Madinah', 'Madinah Holy Sites', 50.0, 180, false, 5, true),
('b6666666-6666-6666-6666-666666666666', 'makkah-to-jeddah-airport', 'Makkah Hotel to Jeddah Airport (KAIA)', 'Makkah', 'Jeddah', 95.0, 75, true, 6, true),
('b7777777-7777-7777-7777-777777777777', 'makkah-to-taif-day-trip', 'Makkah to Taif Mountain Day Excursion', 'Makkah', 'Taif', 110.0, 90, false, 7, true),
('b8888888-8888-8888-8888-888888888888', 'madinah-to-makkah-direct', 'Madinah Hotel to Makkah Hotel (via Abyar Ali Miqat)', 'Madinah', 'Makkah', 435.0, 280, true, 8, true)
on conflict (id) do nothing;

-- 4. Route Pricing Matrix (SAR Rates per Route + Vehicle)
insert into public.route_pricing (route_id, vehicle_id, price_sar)
values
-- Jeddah -> Makkah
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 250.00), -- Camry
('b1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 350.00), -- Staria
('b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 450.00), -- HiAce
('b1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 550.00), -- GMC Yukon XL
-- Makkah -> Madinah
('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 500.00),
('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 650.00),
('b2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 850.00),
('b2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 1100.00),
-- Madinah Hotel -> Madinah Airport
('b3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 150.00),
('b3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 200.00),
('b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 280.00),
('b3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', 350.00),
-- Makkah Ziyarat Tour
('b4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 250.00),
('b4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', 350.00),
('b4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', 450.00),
('b4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 600.00)
on conflict do nothing;

-- 5. Testimonials
insert into public.testimonials (name, country, rating, review_text, trip_date, is_verified, display_order, is_active)
values
('Tariq Al-Mansoor', 'United Kingdom', 5, 'Alhamdulillah exceptional service! Landed at Terminal 1 Jeddah, chauffeur was waiting with a sign. The car was spotless and stopped at Miqat patiently. Zero advance fee gave total peace of mind.', 'February 2026', true, 1, true),
('Brother Farhan & Family', 'Canada', 5, 'Booked Hyundai Staria for our family of 6 with 6 large bags. Excellent driver, courteous and safe driving on the Makkah-Madinah highway. Paid driver in cash in Madinah.', 'January 2026', true, 2, true),
('Haji Muhammad Rizwan', 'Pakistan', 5, 'Best Umrah transport service in Saudi Arabia. Very fast WhatsApp response within 2 minutes. The price was fixed with zero hidden charges. Highly recommended for families.', 'February 2026', true, 3, true)
on conflict do nothing;

-- 6. FAQs
insert into public.faqs (question, answer, category, display_order, is_active)
values
('Do I need to pay any advance deposit before arrival?', 'No! We operate on a 100% Zero Advance Deposit policy. You settle the full fare in cash (SAR, USD, GBP) or card directly with your chauffeur upon safe arrival at your destination hotel.', 'payment', 1, true),
('What happens if my flight to Jeddah or Madinah is delayed?', 'We monitor all flights in real-time via radar dispatch. Even if your flight is delayed by several hours, your chauffeur will be waiting outside the terminal with no extra penalty charges.', 'service', 2, true),
('Is there a stop at the Miqat for Ihram included in the fare?', 'Yes, absolutely. For all transfers from Madinah to Makkah or other applicable routes, a complimentary stopover at the designated Miqat station (such as Abyar Ali or Masjid Aisha) is fully included.', 'service', 3, true),
('Are tolls, taxes, and airport parking fees included in the fare?', 'Yes. All quoted prices are 100% all-inclusive. You will never encounter hidden tolls, parking fees, or surge pricing on the Haramain Expressway.', 'pricing', 4, true),
('How fast do you dispatch after WhatsApp booking?', 'Our dispatch team is operational 24 hours a day, 7 days a week with an average initial response SLA of 1 to 2 minutes on WhatsApp.', 'booking', 5, true)
on conflict do nothing;
