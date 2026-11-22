import React from 'react';
import { MOCK_ROUTES, MOCK_VEHICLES } from '@/data/mockData';
import { BookingWidget } from '@/components/BookingWidget';
import { TrustFeatures } from '@/components/TrustFeatures';
import { FleetSection } from '@/components/FleetSection';
import { RoutesSection } from '@/components/RoutesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FAQSection } from '@/components/FAQSection';
import { ShieldCheck, Star, Clock, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[640px] lg:min-h-[720px] bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-white pt-12 pb-20 overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-amber-200/30 to-orange-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Saudi Arabia's Premier Pilgrim Transport</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.15]">
                Private Umrah Taxi With{' '}
                <span className="text-amber-600 underline decoration-amber-300">
                  Zero Advance Deposit
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Pre-book your sanitized private chauffeur for Jeddah Airport (KAIA), Makkah, and Madinah transfers. Pay on safe arrival at your hotel with 100% fixed fares, radar flight delay tracking, and free Miqat stopover.
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

            {/* Right Column: Hero Booking Widget */}
            <div className="lg:col-span-5 w-full">
              <BookingWidget routes={MOCK_ROUTES} vehicles={MOCK_VEHICLES} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <TrustFeatures />

      {/* Fleet Section */}
      <FleetSection vehicles={MOCK_VEHICLES} />

      {/* Routes & Pricing */}
      <RoutesSection routes={MOCK_ROUTES} />

      {/* Reviews & Social Proof */}
      <TestimonialsSection />

      {/* FAQs */}
      <FAQSection />
    </div>
  );
}
