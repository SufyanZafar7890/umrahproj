-- ========================================================
-- Seed Data: Vehicles & Popular Routes
-- ========================================================

insert into public.vehicles (name, category, max_passengers, max_luggage, image_url, features, is_active)
values
('Toyota Camry (Sedan)', 'Sedan', 4, 2, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80', array['Air Conditioned', 'Dual Airbags', 'Spacious Legroom'], true),
('Hyundai Staria (Family MPV)', 'MPV', 7, 5, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', array['Captain Seats', 'Dual Zone Climate Control', 'High Roof'], true),
('Toyota HiAce (Group Van)', 'Minibus', 10, 8, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80', array['High Ceiling', 'Individual Rear AC Vents', 'Family Seating'], true),
('GMC Yukon XL (VIP Luxury)', 'VIP SUV', 7, 6, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80', array['VIP Executive Leather', 'Privacy Tint', 'Ultra Smooth Ride'], true)
on conflict do nothing;

insert into public.routes (slug, title, origin_city, destination_city, distance_km, duration_mins, is_popular, base_price_sar, is_active)
values
('jeddah-airport-to-makkah-hotel', 'Jeddah Airport (KAIA) to Makkah Hotel', 'Jeddah', 'Makkah', 95.0, 75, true, 250, true),
('makkah-hotel-to-madinah-hotel', 'Makkah Hotel to Madinah Hotel', 'Makkah', 'Madinah', 435.0, 270, true, 500, true),
('madinah-hotel-to-madinah-airport', 'Madinah Hotel to Madinah Airport (MED)', 'Madinah', 'Madinah Airport', 25.0, 30, true, 150, true),
('makkah-ziyarat-tour', 'Makkah Full Day Ziyarat Tour', 'Makkah', 'Makkah Holy Sites', 60.0, 180, true, 250, true),
('madinah-ziyarat-tour', 'Madinah Full Day Ziyarat Tour', 'Madinah', 'Madinah Holy Sites', 50.0, 180, false, 250, true),
('makkah-to-jeddah-airport', 'Makkah Hotel to Jeddah Airport (KAIA)', 'Makkah', 'Jeddah', 95.0, 75, true, 250, true),
('makkah-to-taif-day-trip', 'Makkah to Taif Mountain Day Excursion', 'Makkah', 'Taif', 110.0, 90, false, 450, true)
on conflict do nothing;
