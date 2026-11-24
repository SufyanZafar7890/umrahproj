'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, MapPin, Award, CheckCircle } from 'lucide-react';
import { getSiteSettings, DEFAULT_SETTINGS, SiteSettingsMap } from '@/lib/supabase/data';

export function AboutContent() {
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

  const founderName = settings.founder_name || 'Sufyan Zafar';
  const companyName = settings.company_name || 'Umrah Taxi Online';
  const hqAddress = settings.hq_address || 'Ash Shubaikah, Makkah 24231, Kingdom of Saudi Arabia';
  const missionTitle = settings.about_mission_title || 'Serving the Guests of Allah';
  const missionText =
    settings.about_mission_text ||
    `Headquartered in ${hqAddress}, adjacent to the Holy Mosque, ${companyName} was founded to eliminate the anxiety and price gouging international pilgrims encounter upon landing in Saudi Arabia.`;
  const storyTitle = settings.about_story_title || 'Our Founding Story';
  const storyText1 =
    settings.about_story_text_1 ||
    `Founded by ${founderName}, ${companyName} started with a simple belief: pilgrims arriving from long international flights deserve peace of mind, honest upfront pricing, and hospitable chauffeurs who understand the sanctity of their journey.`;
  const storyText2 =
    settings.about_story_text_2 ||
    'Unlike automated ride apps that apply high surge pricing during peak Ramadan and Hajj seasons or cancel on passengers with heavy luggage, our service operates with pre-scheduled, guaranteed commercial drivers and fixed all-inclusive fares.';
  const statDrivers = settings.about_stat_drivers || '50+';
  const statPilgrims = settings.about_stat_pilgrims || '10,000+';
  const slaResponse = settings.sla_response_time || '1 – 2 Minutes';

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Our Mission &amp; Legacy
          </span>
          <h1 className="text-4xl font-black text-gray-950 sm:text-5xl mt-3">
            {missionTitle}
          </h1>
          <p className="mt-4 text-gray-600 text-base leading-relaxed">
            {missionText}
          </p>
        </div>

        {/* Story Section */}
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200/80 mb-12 space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900">{storyTitle}</h2>
          <p>
            {storyText1.includes(founderName) ? (
              storyText1
            ) : (
              <>
                Founded by <strong className="text-gray-900 font-bold">{founderName}</strong>, {storyText1}
              </>
            )}
          </p>
          <p>
            {storyText2}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-16">
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-200">
            <span className="text-3xl font-black text-amber-600 block">{statDrivers}</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">TGA Verified Drivers</span>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-200">
            <span className="text-3xl font-black text-emerald-600 block">0</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">Advance Deposit (SAR)</span>
          </div>
          <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-200">
            <span className="text-3xl font-black text-blue-600 block">{statPilgrims}</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">Pilgrims Transported</span>
          </div>
          <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-200">
            <span className="text-3xl font-black text-purple-600 block">{slaResponse}</span>
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
                <h3 className="font-bold text-sm text-gray-900">Clean &amp; Sanitized Fleet</h3>
                <p className="text-xs text-gray-600 mt-1">High-roof, air-conditioned vehicles for family comfort.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
