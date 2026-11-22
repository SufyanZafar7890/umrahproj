'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/types/database';
import { Users, Briefcase, Check, MessageSquare } from 'lucide-react';
import { constructWhatsAppLink, cleanWhatsAppNumber } from '@/lib/whatsapp';
import { getSiteSettings } from '@/lib/supabase/data';

export function FleetSection({
  vehicles,
  whatsappNumber: propNumber,
}: {
  vehicles: Vehicle[];
  whatsappNumber?: string;
}) {
  const [activeNumber, setActiveNumber] = useState<string>(() => {
    if (propNumber) return cleanWhatsAppNumber(propNumber);
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('umrah_cached_site_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.whatsapp_number) return cleanWhatsAppNumber(parsed.whatsapp_number);
        }
      } catch (e) {}
    }
    return '923086819634';
  });

  useEffect(() => {
    if (propNumber) {
      setActiveNumber(cleanWhatsAppNumber(propNumber));
    } else {
      getSiteSettings().then((s) => {
        if (s.whatsapp_number) setActiveNumber(cleanWhatsAppNumber(s.whatsapp_number));
      });
    }
  }, [propNumber]);

  const handleDirectVehicleBooking = (vehicle: Vehicle) => {
    const url = constructWhatsAppLink({
      routeTitle: 'Pilgrim Transfer Inquiry',
      travelDate: 'Upcoming Trip',
      passengers: vehicle.max_passengers,
      luggage: vehicle.max_luggage,
      vehicleName: vehicle.name,
      phoneDispatch: activeNumber,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="fleet" className="py-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
            Comfort & Reliability
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3">
            Our Commercial Chauffeur Fleet
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Modern, climate-controlled, and sanitized vehicles operated by certified commercial chauffeurs for individual pilgrims, families, and larger delegations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={v.image_url}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-gray-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {v.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-amber-600 transition-colors">
                    {v.name}
                  </h3>

                  {/* Specs */}
                  <div className="flex items-center gap-4 mt-3 pb-4 border-b border-gray-100 text-xs font-bold text-gray-600">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      Up to {v.max_passengers} Pax
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                      <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                      {v.max_luggage} Luggage
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="mt-4 space-y-2">
                    {v.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleDirectVehicleBooking(v)}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  Book {v.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
