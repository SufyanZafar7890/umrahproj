import React from 'react';
import { MOCK_VEHICLES } from '@/data/mockData';
import { FleetSection } from '@/components/FleetSection';
import { TrustFeatures } from '@/components/TrustFeatures';

export const metadata = {
  title: 'Our Pilgrim Fleet | Toyota Camry, Staria, HiAce & GMC Yukon | Umrah Taxi Online',
  description: 'Explore our fleet of private pilgrim vehicles in Saudi Arabia. From sedans to luxury VIP SUVs and family vans, all compliant with TGA standards.',
};

export default function FleetPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h1 className="text-4xl font-black text-gray-950 sm:text-5xl">
          Certified Commercial Pilgrim Fleet
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base">
          Every vehicle is rigorously inspected, thoroughly sanitized before each transfer, and driven by an experienced Saudi Transport Authority (TGA) verified chauffeur.
        </p>
      </div>

      <FleetSection vehicles={MOCK_VEHICLES} />
      <TrustFeatures />
    </div>
  );
}
