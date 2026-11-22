import React from 'react';
import { MOCK_ROUTES, MOCK_VEHICLES } from '@/data/mockData';
import { RoutesSection } from '@/components/RoutesSection';
import { BookingWidget } from '@/components/BookingWidget';
import { FAQSection } from '@/components/FAQSection';

export const metadata = {
  title: 'Umrah Taxi Routes & Fixed Pricing | Jeddah, Makkah, Madinah',
  description: 'View 100% fixed taxi fares between Jeddah Airport, Makkah hotels, and Madinah hotels. No surge pricing, highway tolls included.',
};

export default function RoutesPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h1 className="text-4xl font-black text-gray-950 sm:text-5xl">
          Fixed-Rate Pilgrimage Routes & Tours
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base">
          All prices are fixed and settled upon arrival at your hotel. Zero advance deposits and zero surge charges on the Haramain Expressway.
        </p>
      </div>

      <RoutesSection routes={MOCK_ROUTES} />

      <div className="max-w-4xl mx-auto px-4 my-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Book Your Route Instantly</h2>
          <p className="text-xs text-gray-500 mt-1">Select your route and get instant WhatsApp confirmation</p>
        </div>
        <BookingWidget routes={MOCK_ROUTES} vehicles={MOCK_VEHICLES} />
      </div>

      <FAQSection />
    </div>
  );
}
