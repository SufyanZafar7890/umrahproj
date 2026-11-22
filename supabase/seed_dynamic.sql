-- ====================================================================
-- SEED DATA: DYNAMIC SITE SETTINGS, FLEET, ROUTES, PRICING, TESTIMONIALS & FAQS
-- ====================================================================

-- 1. Insert Site Settings (WhatsApp number, HQ Address, Hotline, SLA, etc.)
insert into public.site_settings (key, value, label, category)
values
('whatsapp_number', '966591206299', 'WhatsApp Dispatch Number (with country code)', 'contact'),
('phone_number', '966591206299', 'Hotline Phone Number', 'contact'),
('support_email', 'dispatch@umrahtaxionline.com', 'Dispatch Support Email', 'contact'),
('company_name', 'Umrah Taxi Online', 'Brand Name', 'general'),
('founder_name', 'Haroon Kainth', 'Founder Name', 'general'),
('hq_address', 'Ash Shubaikah, Makkah 24231, Kingdom of Saudi Arabia', 'Makkah Physical Headquarters', 'contact'),
('sla_response_time', '1 – 2 Minutes', 'WhatsApp Response SLA Time', 'service'),
('tga_compliance_text', 'Saudi Transport General Authority (TGA) Compliant Chauffeur Network', 'Regulatory Badge Text', 'service'),
('hero_heading', 'Private Umrah Taxi With Zero Advance Deposit', 'Main Hero Title', 'homepage'),
('hero_subheading', 'Pre-book your sanitized private chauffeur for Jeddah Airport (KAIA), Makkah, and Madinah transfers. Pay on safe arrival at your hotel with 100% fixed fares, radar flight delay tracking, and free Miqat stopover.', 'Main Hero Subtitle', 'homepage')
on conflict (key) do update set value = excluded.value, label = excluded.label;

-- 2. Insert Vehicles (Fleet)
delete from public.vehicles;
insert into public.vehicles (id, name, category, max_passengers, max_luggage, image_url, features, display_order, is_active)
values
('a1111111-1111-1111-1111-111111111111', 'Toyota Camry (Sedan)', 'Sedan', 4, 2, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80', array['Air Conditioned', 'Dual Airbags', 'Spacious Legroom', 'Complimentary Bottled Water'], 1, true),
('a2222222-2222-2222-2222-222222222222', 'Hyundai Staria (Family MPV)', 'MPV', 7, 5, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', array['Captain Seats', 'Dual Zone Climate Control', 'High Roof', 'Extra Luggage Deck'], 2, true),
('a3333333-3333-3333-3333-333333333333', 'Toyota HiAce (Group Van)', 'Minibus', 10, 8, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80', array['High Ceiling', 'Individual Rear AC Vents', 'Family Group Seating', 'Ample Bag Capacity'], 3, true),
('a4444444-4444-4444-4444-444444444444', 'GMC Yukon XL (VIP Luxury)', 'VIP SUV', 7, 6, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80', array['VIP Executive Leather', 'Privacy Tint', 'Ultra Smooth Ride', 'Premium Chauffeur Service'], 4, true)
on conflict (id) do nothing;

-- 3. Insert Routes
delete from public.routes;
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

-- 4. Insert Dynamic Route Pricing Matrix (Exact SAR rates per route & vehicle)
delete from public.route_pricing;
insert into public.route_pricing (route_id, vehicle_id, price_sar)
values
-- Route 1: Jeddah KAIA -> Makkah
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 250.00), -- Camry
('b1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 350.00), -- Staria
('b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 450.00), -- HiAce
('b1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 550.00), -- GMC Yukon XL

-- Route 2: Makkah -> Madinah
('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 500.00), -- Camry
('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 650.00), -- Staria
('b2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 850.00), -- HiAce
('b2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 1100.00), -- GMC Yukon XL

-- Route 3: Madinah Hotel -> Madinah Airport
('b3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 150.00),
('b3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 200.00),
('b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 280.00),
('b3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', 350.00),

-- Route 4: Makkah Ziyarat Tour
('b4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 250.00),
('b4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', 350.00),
('b4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', 450.00),
('b4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 600.00),

-- Route 5: Madinah Ziyarat Tour
('b5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 250.00),
('b5555555-5555-5555-5555-555555555555', 'a2222222-2222-2222-2222-222222222222', 350.00),
('b5555555-5555-5555-5555-555555555555', 'a3333333-3333-3333-3333-333333333333', 450.00),
('b5555555-5555-5555-5555-555555555555', 'a4444444-4444-4444-4444-444444444444', 600.00),

-- Route 6: Makkah Hotel -> Jeddah KAIA
('b6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', 250.00),
('b6666666-6666-6666-6666-666666666666', 'a2222222-2222-2222-2222-222222222222', 350.00),
('b6666666-6666-6666-6666-666666666666', 'a3333333-3333-3333-3333-333333333333', 450.00),
('b6666666-6666-6666-6666-666666666666', 'a4444444-4444-4444-4444-444444444444', 550.00),

-- Route 7: Makkah -> Taif Day Trip
('b7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', 450.00),
('b7777777-7777-7777-7777-777777777777', 'a2222222-2222-2222-2222-222222222222', 600.00),
('b7777777-7777-7777-7777-777777777777', 'a3333333-3333-3333-3333-333333333333', 800.00),
('b7777777-7777-7777-7777-777777777777', 'a4444444-4444-4444-4444-444444444444', 950.00),

-- Route 8: Madinah -> Makkah Direct (via Abyar Ali)
('b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 500.00),
('b8888888-8888-8888-8888-888888888888', 'a2222222-2222-2222-2222-222222222222', 650.00),
('b8888888-8888-8888-8888-888888888888', 'a3333333-3333-3333-3333-333333333333', 850.00),
('b8888888-8888-8888-8888-888888888888', 'a4444444-4444-4444-4444-444444444444', 1100.00);

-- 5. Insert Testimonials
delete from public.testimonials;
insert into public.testimonials (name, country, rating, review_text, trip_date, is_verified, display_order, is_active)
values
('Tariq Al-Mansoor', 'United Kingdom', 5, 'Alhamdulillah exceptional service! Landed at Terminal 1 Jeddah, chauffeur was waiting with a sign. The car was spotless and stopped at Miqat patiently. Zero advance fee gave total peace of mind.', 'February 2026', true, 1, true),
('Brother Farhan & Family', 'Canada', 5, 'Booked Hyundai Staria for our family of 6 with 6 large bags. Excellent driver, courteous and safe driving on the Makkah-Madinah highway. Paid driver in cash in Madinah.', 'January 2026', true, 2, true),
('Haji Muhammad Rizwan', 'Pakistan', 5, 'Best Umrah transport service in Saudi Arabia. Very fast WhatsApp response within 2 minutes. The price was fixed with zero hidden charges. Highly recommended for families.', 'February 2026', true, 3, true);

-- 6. Insert FAQs
delete from public.faqs;
insert into public.faqs (question, answer, category, display_order, is_active)
values
('Do I need to pay any advance deposit before arrival?', 'No! We operate on a 100% Zero Advance Deposit policy. You settle the full fare in cash (SAR, USD, GBP) or card directly with your chauffeur upon safe arrival at your destination hotel.', 'payment', 1, true),
('What happens if my flight to Jeddah or Madinah is delayed?', 'We monitor all flights in real-time via radar dispatch. Even if your flight is delayed by several hours, your chauffeur will be waiting outside the terminal with no extra penalty charges.', 'service', 2, true),
('Is there a stop at the Miqat for Ihram included in the fare?', 'Yes, absolutely. For all transfers from Madinah to Makkah or other applicable routes, a complimentary stopover at the designated Miqat station (such as Abyar Ali or Masjid Aisha) is fully included.', 'service', 3, true),
('Are tolls, taxes, and airport parking fees included in the fare?', 'Yes. All quoted prices are 100% all-inclusive. You will never encounter hidden tolls, parking fees, or surge pricing on the Haramain Expressway.', 'pricing', 4, true),
('How fast do you dispatch after WhatsApp booking?', 'Our dispatch team is operational 24 hours a day, 7 days a week with an average initial response SLA of 1 to 2 minutes on WhatsApp.', 'booking', 5, true);
