'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { getSiteSettings } from '@/lib/supabase/data';
import { cleanWhatsAppNumber } from '@/lib/whatsapp';

interface FooterProps {
  hotline?: string;
  address?: string;
  email?: string;
  companyName?: string;
}

export function Footer({
  hotline: propHotline,
  address: propAddress,
  email: propEmail,
  companyName: propCompanyName,
}: FooterProps) {
  const [hotline, setHotline] = useState<string>(() => {
    if (propHotline) return cleanWhatsAppNumber(propHotline);
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

  const [address, setAddress] = useState(
    propAddress || 'Ash Shubaikah, Makkah 24231, Kingdom of Saudi Arabia (Near Haram)'
  );
  const [email, setEmail] = useState(propEmail || 'dispatch@makkahmadinahziyarat.com');
  const [companyName, setCompanyName] = useState(propCompanyName || 'Umrah Taxi Online');

  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s.whatsapp_number && !propHotline) setHotline(cleanWhatsAppNumber(s.whatsapp_number));
      if (s.hq_address && !propAddress) setAddress(s.hq_address);
      if (s.support_email && !propEmail) setEmail(s.support_email);
      if (s.company_name && !propCompanyName) setCompanyName(s.company_name);
    });
  }, [propHotline, propAddress, propEmail, propCompanyName]);

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-gray-950 font-black flex items-center justify-center text-xl">
                UT
              </div>
              <span className="text-xl font-extrabold text-white">
                {companyName.split(' ')[0]} <span className="text-amber-500">{companyName.split(' ').slice(1).join(' ')}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Premium private pilgrim chauffeur network compliant with Saudi Transport General Authority (TGA). Serving Makkah, Madinah, Jeddah KAIA, and Taif.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Licensed Commercial Chauffeur Network</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Pilgrim Routes
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/routes" className="hover:text-amber-400 transition-colors">
                  Jeddah Airport to Makkah Hotel
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-amber-400 transition-colors">
                  Makkah to Madinah Hotel
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-amber-400 transition-colors">
                  Madinah Hotel to KAIA Airport
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-amber-400 transition-colors">
                  Makkah Holy Sites Ziyarat Tour
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-amber-400 transition-colors">
                  Madinah Holy Sites Ziyarat Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fleet & Policies */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Fleet & Policies
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/fleet" className="hover:text-amber-400 transition-colors">
                  Toyota Camry (Sedan 4 Pax)
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-amber-400 transition-colors">
                  Hyundai Staria (Family MPV 7 Pax)
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-amber-400 transition-colors">
                  Toyota HiAce (Group Van 10 Pax)
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-amber-400 transition-colors">
                  GMC Yukon XL (VIP Luxury 7 Pax)
                </Link>
              </li>
              <li>
                <span className="text-emerald-400">Zero Advance Deposit Policy</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Dynamic Contact HQ from Supabase */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact & HQ
            </h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`tel:+${hotline}`} className="hover:text-white transition-colors">
                  +{hotline} (24/7 Dispatch)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 {companyName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Umrah & Hajj Pilgrims with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
