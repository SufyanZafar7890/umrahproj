import React from 'react';
import { ShieldCheck, Users, MapPin, Award, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'About Umrah Taxi Online | Trusted Pilgrim Transportation',
  description: 'Learn about Umrah Taxi Online, founded by Haroon Kainth, operating 50+ commercial chauffeurs across Makkah and Madinah.',
};

export default function AboutUsPage() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Our Mission & Legacy
          </span>
          <h1 className="text-4xl font-black text-gray-950 sm:text-5xl mt-3">
            Serving the Guests of Allah
          </h1>
          <p className="mt-4 text-gray-600 text-base leading-relaxed">
            Headquartered in Ash Shubaikah, Makkah, adjacent to the Holy Mosque, Umrah Taxi Online was founded to eliminate the anxiety and price gouging international pilgrims encounter upon landing in Saudi Arabia.
          </p>
        </div>

        {/* Story Section */}
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200/80 mb-12 space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900">Our Founding Story</h2>
          <p>
            Founded by <strong>Haroon Kainth</strong>, Umrah Taxi Online started with a simple belief: pilgrims arriving from long international flights deserve peace of mind, honest upfront pricing, and hospitable chauffeurs who understand the sanctity of their journey.
          </p>
          <p>
            Unlike automated ride apps that apply high surge pricing during peak Ramadan and Hajj seasons or cancel on passengers with heavy luggage, our service operates with pre-scheduled, guaranteed commercial drivers and fixed all-inclusive fares.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-16">
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-200">
            <span className="text-3xl font-black text-amber-600 block">50+</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">TGA Verified Drivers</span>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-200">
            <span className="text-3xl font-black text-emerald-600 block">0</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">Advance Deposit (SAR)</span>
          </div>
          <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-200">
            <span className="text-3xl font-black text-blue-600 block">10,000+</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">Pilgrims Transported</span>
          </div>
          <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-200">
            <span className="text-3xl font-black text-purple-600 block">1-2 Min</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">WhatsApp Response SLA</span>
          </div>
        </div>

        {/* Core Principles */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Pilgrim Commitments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">No Advance Financial Risk</h3>
                <p className="text-xs text-gray-600 mt-1">Never pay before you arrive safely at your hotel door.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Radar Flight Monitoring</h3>
                <p className="text-xs text-gray-600 mt-1">Free chauffeur wait times when flights are delayed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Complimentary Miqat Stopover</h3>
                <p className="text-xs text-gray-600 mt-1">Adequate prayer time at designated Miqat boundaries.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Clean & Sanitized Fleet</h3>
                <p className="text-xs text-gray-600 mt-1">High-roof, air-conditioned vehicles for family comfort.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
