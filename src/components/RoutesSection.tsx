'use client';

import React, { useState, useEffect } from 'react';
import { Route } from '@/types/database';
import { MapPin, ArrowRight, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { constructWhatsAppLink } from '@/lib/whatsapp';
import { getSiteSettings } from '@/lib/supabase/data';

export function RoutesSection({
  routes,
  whatsappNumber: propNumber,
}: {
  routes: Route[];
  whatsappNumber?: string;
}) {
  const [activeNumber, setActiveNumber] = useState(propNumber || '966591206299');

  useEffect(() => {
    if (propNumber) {
      setActiveNumber(propNumber);
    } else {
      getSiteSettings().then((s) => {
        if (s.whatsapp_number) setActiveNumber(s.whatsapp_number);
      });
    }
  }, [propNumber]);

  const handleRouteBook = (route: Route) => {
    const url = constructWhatsAppLink({
      routeTitle: route.title,
      travelDate: 'Upcoming Date',
      passengers: 2,
      luggage: 2,
      estimatedPriceSar: route.base_price_sar,
      phoneDispatch: activeNumber,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="routes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Fixed Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3">
              Popular Pilgrimage Routes
            </h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              All routes include toll charges, free waiting on flight delays, and complimentary Miqat stops.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="p-6 rounded-2xl bg-white border border-gray-200/80 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {route.origin_city} → {route.destination_city}
                  </span>
                  {route.is_popular && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {route.title}
                </h3>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{route.duration_mins} mins
                  </span>
                  <span>•</span>
                  <span>{route.distance_km} km</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Tolls Included
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 block font-medium">Starting from</span>
                  <span className="text-xl font-black text-gray-950">{route.base_price_sar} SAR</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRouteBook(route)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  Instant Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
