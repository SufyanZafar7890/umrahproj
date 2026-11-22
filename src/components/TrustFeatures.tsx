import React from 'react';
import { ShieldCheck, Clock, Plane, MapPin, CreditCard, Award } from 'lucide-react';

export function TrustFeatures() {
  const features = [
    {
      icon: CreditCard,
      title: 'Zero Advance Deposit',
      desc: 'No credit card or prepayment required. Pay the full fixed fare to your chauffeur upon safe arrival at your hotel.',
      badge: 'Pay on Arrival',
    },
    {
      icon: Plane,
      title: 'Real-Time Flight Tracking',
      desc: 'We track your incoming flight into Jeddah (KAIA) or Madinah (MED). Delayed flights incur zero waiting fees.',
      badge: 'Radar Tracking',
    },
    {
      icon: MapPin,
      title: 'Complimentary Miqat Stop',
      desc: 'Free ritual stopover at official Miqat boundary stations (Abyar Ali, Masjid Aisha) to assume Ihram and pray.',
      badge: 'Free Stop',
    },
    {
      icon: ShieldCheck,
      title: '100% Fixed Rates',
      desc: 'All-inclusive pricing covering highway tolls, airport parking fees, fuel, and luggage help with zero surge spikes.',
      badge: 'All-Inclusive',
    },
    {
      icon: Clock,
      title: '24/7 Rapid Dispatch',
      desc: 'Around-the-clock booking desk with an average 1 to 2 minute response time on direct WhatsApp dispatch.',
      badge: '1-2 Min SLA',
    },
    {
      icon: Award,
      title: 'TGA Compliant Chauffeurs',
      desc: 'Backed by a fleet of over 50 licensed commercial drivers adhering strictly to Saudi Transport General Authority standards.',
      badge: 'Official TGA',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Why Pilgrims Choose Us
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-3 sm:text-4xl">
            Worry-Free Umrah & Hajj Transfers
          </h2>
          <p className="mt-4 text-gray-600 text-base">
            Designed specifically to address the anxieties of international pilgrims arriving in Saudi Arabia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-gray-50 border border-gray-200/70 hover:border-amber-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-gray-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
