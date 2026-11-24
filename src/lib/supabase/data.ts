import { supabase, isSupabaseConfigured } from './client';
import {
  SiteSetting,
  Vehicle,
  Route,
  RoutePricing,
  Testimonial,
  FAQ,
} from '@/types/database';
import {
  MOCK_ROUTES,
  MOCK_VEHICLES,
  TESTIMONIALS,
  FAQ_ITEMS,
} from '@/data/mockData';

export interface SiteSettingsMap {
  whatsapp_number: string;
  phone_number: string;
  support_email: string;
  company_name: string;
  founder_name: string;
  hq_address: string;
  sla_response_time: string;
  tga_compliance_text: string;
  hero_heading: string;
  hero_subheading: string;
  [key: string]: string;
}

export const DEFAULT_SETTINGS: SiteSettingsMap = {
  whatsapp_number: '923160424995',
  phone_number: '923160424995',
  support_email: 'dispatch@umrahtaxionline.com',
  company_name: 'Umrah Taxi Online',
  founder_name: 'Haroon Kainth',
  hq_address: 'Ash Shubaikah, Makkah 24231, Kingdom of Saudi Arabia',
  sla_response_time: '1 – 2 Minutes',
  tga_compliance_text: 'Saudi Transport General Authority (TGA) Compliant Chauffeur Network',
  hero_heading: 'Private Umrah Taxi With Zero Advance Deposit',
  hero_subheading:
    'Pre-book your sanitized private chauffeur for Jeddah Airport (KAIA), Makkah, and Madinah transfers. Pay on safe arrival at your hotel with 100% fixed fares, radar flight delay tracking, and free Miqat stopover.',
};

/**
 * Fetch all site settings as a key-value dictionary from Supabase
 */
export async function getSiteSettings(): Promise<SiteSettingsMap> {
  let cached: SiteSettingsMap | null = null;
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('umrah_cached_site_settings');
      if (stored) cached = JSON.parse(stored);
    } catch (e) {}
  }

  if (!isSupabaseConfigured) return cached || DEFAULT_SETTINGS;

  try {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error || !data || data.length === 0) return cached || DEFAULT_SETTINGS;

    const map: SiteSettingsMap = { ...(cached || DEFAULT_SETTINGS) };
    data.forEach((row: { key: string; value: string }) => {
      if (row.value !== undefined && row.value !== null && row.value.trim() !== '') {
        map[row.key] = row.value.trim();
      }
    });

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('umrah_cached_site_settings', JSON.stringify(map));
      } catch (e) {}
    }
    return map;
  } catch (err) {
    console.warn('Fallback to cached/default settings:', err);
    return cached || DEFAULT_SETTINGS;
  }
}

/**
 * Fetch vehicles from Supabase with fallback to mock data
 */
export async function getVehicles(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) return MOCK_VEHICLES;

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return MOCK_VEHICLES;
    return data as Vehicle[];
  } catch (err) {
    console.warn('Fallback to mock vehicles:', err);
    return MOCK_VEHICLES;
  }
}

/**
 * Fetch routes from Supabase with fallback to mock data
 */
export async function getRoutes(): Promise<Route[]> {
  if (!isSupabaseConfigured) return MOCK_ROUTES;

  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return MOCK_ROUTES;
    return data as Route[];
  } catch (err) {
    console.warn('Fallback to mock routes:', err);
    return MOCK_ROUTES;
  }
}

/**
 * Fetch dynamic price matrix from Supabase
 */
export async function getRoutePricing(): Promise<RoutePricing[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase.from('route_pricing').select('*');
    if (error || !data) return [];
    return data as RoutePricing[];
  } catch (err) {
    console.warn('Fallback to pricing:', err);
    return [];
  }
}

/**
 * Fetch FAQs from Supabase with fallback to mock data
 */
export async function getFAQs(): Promise<FAQ[]> {
  if (!isSupabaseConfigured) {
    return FAQ_ITEMS.map((item, idx) => ({
      id: `faq-${idx}`,
      question: item.q,
      answer: item.a,
      is_active: true,
      display_order: idx + 1,
    }));
  }

  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FAQ_ITEMS.map((item, idx) => ({
        id: `faq-${idx}`,
        question: item.q,
        answer: item.a,
        is_active: true,
        display_order: idx + 1,
      }));
    }
    return data as FAQ[];
  } catch (err) {
    return FAQ_ITEMS.map((item, idx) => ({
      id: `faq-${idx}`,
      question: item.q,
      answer: item.a,
      is_active: true,
      display_order: idx + 1,
    }));
  }
}

/**
 * Fetch Testimonials from Supabase with fallback to mock data
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) {
    return TESTIMONIALS.map((t, idx) => ({
      id: `test-${idx}`,
      name: t.name,
      country: t.country,
      rating: t.rating,
      review_text: t.comment,
      trip_date: t.date,
      is_verified: true,
      is_active: true,
      display_order: idx + 1,
    }));
  }

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return TESTIMONIALS.map((t, idx) => ({
        id: `test-${idx}`,
        name: t.name,
        country: t.country,
        rating: t.rating,
        review_text: t.comment,
        trip_date: t.date,
        is_verified: true,
        is_active: true,
        display_order: idx + 1,
      }));
    }
    return data as Testimonial[];
  } catch (err) {
    return TESTIMONIALS.map((t, idx) => ({
      id: `test-${idx}`,
      name: t.name,
      country: t.country,
      rating: t.rating,
      review_text: t.comment,
      trip_date: t.date,
      is_verified: true,
      is_active: true,
      display_order: idx + 1,
    }));
  }
}
