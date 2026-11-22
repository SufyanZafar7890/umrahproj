'use client';

import React, { useState, useEffect } from 'react';
import {
  getSiteSettings,
  getVehicles,
  getRoutes,
  getRoutePricing,
  getTestimonials,
  getFAQs,
  DEFAULT_SETTINGS,
  SiteSettingsMap,
} from '@/lib/supabase/data';
import { MOCK_ROUTES, MOCK_VEHICLES } from '@/data/mockData';
import {
  Vehicle,
  Route,
  RoutePricing,
  Testimonial,
  FAQ,
} from '@/types/database';
import { BookingWidget } from '@/components/BookingWidget';
import { TrustFeatures } from '@/components/TrustFeatures';
import { FleetSection } from '@/components/FleetSection';
import { RoutesSection } from '@/components/RoutesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FAQSection } from '@/components/FAQSection';
import { ShieldCheck, Star, Clock, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettingsMap>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('umrah_cached_site_settings');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [pricing, setPricing] = useState<RoutePricing[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Load 100% dynamic data from Supabase tables
  useEffect(() => {
    async function loadDynamicSupabaseData() {
      try {
        const [
          loadedSettings,
          loadedVehicles,
          loadedRoutes,
          loadedPricing,
          loadedTestimonials,
          loadedFaqs,
        ] = await Promise.all([
          getSiteSettings(),
          getVehicles(),
          getRoutes(),
          getRoutePricing(),
          getTestimonials(),
          getFAQs(),
        ]);

        setSettings(loadedSettings);
        setVehicles(loadedVehicles);
        setRoutes(loadedRoutes);
        setPricing(loadedPricing);
        setTestimonials(loadedTestimonials);
        setFaqs(loadedFaqs);
      } catch (err) {
        console.warn('Supabase dynamic load note:', err);
      }
    }

    loadDynamicSupabaseData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[640px] lg:min-h-[720px] bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-white pt-12 pb-20 overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-amber-200/30 to-orange-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Dynamic Hero Content from Supabase */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{settings.tga_compliance_text}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.15]">
                {settings.hero_heading}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                {settings.hero_subheading}
              </p>

              {/* Trust Badges Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Pay on Hotel Arrival</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Free Flight Delay Wait</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span>4.9 / 5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Dynamic Booking Widget */}
            <div className="lg:col-span-5 w-full">
              <BookingWidget
                routes={routes}
                vehicles={vehicles}
                pricing={pricing}
                whatsappNumber={settings.whatsapp_number}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <TrustFeatures />

      {/* Dynamic Fleet Section */}
      <FleetSection vehicles={vehicles} whatsappNumber={settings.whatsapp_number} />

      {/* Dynamic Routes & Pricing */}
      <RoutesSection routes={routes} whatsappNumber={settings.whatsapp_number} />

      {/* Dynamic Reviews & Social Proof */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Dynamic FAQs */}
      <FAQSection faqs={faqs} />
    </div>
  );
}
