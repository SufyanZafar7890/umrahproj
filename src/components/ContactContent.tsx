'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { getSiteSettings, DEFAULT_SETTINGS, SiteSettingsMap } from '@/lib/supabase/data';
import { cleanWhatsAppNumber, openWhatsAppChat } from '@/lib/whatsapp';

export function ContactContent() {
  const [settings, setSettings] = useState<SiteSettingsMap>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('umrah_cached_site_settings');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    getSiteSettings().then((s) => setSettings(s));
  }, []);

  const hotline = cleanWhatsAppNumber(settings.whatsapp_number);
  const displayPhone = settings.phone_number || '+966 59 120 6299';
  const email = settings.support_email || 'dispatch@makkahmadinahziyarat.com';
  const hqAddress = settings.hq_address || 'Ash Shubaikah, Makkah 24231, Kingdom of Saudi Arabia';

  return (
    <div className="py-16 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            24/7 Live Support
          </span>
          <h1 className="text-4xl font-black text-gray-950 sm:text-5xl mt-3">
            Contact Dispatch Desk
          </h1>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Our operations team is available around the clock to coordinate airport pickups, hotel departures, and holy site excursions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* WhatsApp Direct Card */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 fill-current" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Instant WhatsApp Dispatch</h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Fastest way to book and confirm vehicle availability. Initial dispatch response average is 1 to 2 minutes.
              </p>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${hotline}&text=${encodeURIComponent(
                'Assalam o Alaikum, I need immediate Umrah taxi assistance.'
              )}`}
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppChat(hotline, 'Assalam o Alaikum, I need immediate Umrah taxi assistance.');
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Chat on WhatsApp Now
            </a>
          </div>

          {/* Phone & HQ Card */}
          <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Direct Phone Hotline</h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Call our Makkah operations room directly for urgent arrivals or group coordination.
              </p>
            </div>

            <a
              href={`tel:+${hotline}`}
              className="w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call {displayPhone}
            </a>
          </div>
        </div>

        {/* Operating SLA Table */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Service Level Agreement (SLA) & Dispatch Details
          </h2>

          <div className="divide-y divide-gray-100 text-xs text-gray-600">
            <div className="py-3 flex justify-between">
              <span className="font-semibold text-gray-800">Dispatch Desk Hours:</span>
              <span className="text-emerald-700 font-bold">24 Hours / 7 Days a Week</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="font-semibold text-gray-800">WhatsApp Response Time:</span>
              <span className="font-bold text-gray-900">{settings.sla_response_time || '1 – 2 Minutes'}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="font-semibold text-gray-800">Support Email:</span>
              <span className="font-medium text-gray-700">{email}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="font-semibold text-gray-800">Flight Radar Tracking:</span>
              <span className="font-bold text-emerald-700">Included Free (JED & MED)</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="font-semibold text-gray-800">Physical Address:</span>
              <span className="font-medium text-gray-700">{hqAddress}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="font-semibold text-gray-800">Regulatory Compliance:</span>
              <span className="font-bold text-gray-900">{settings.tga_compliance_text || 'Saudi Transport General Authority (TGA)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
