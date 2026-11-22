# Project Specification & Architecture Blueprint: Umrah Taxi Web Platform

> **Target Reference Site**: [https://umrahtaxionline.com/](https://umrahtaxionline.com/)  
> **Target Framework**: Next.js 15 (App Router, TypeScript) + Supabase (PostgreSQL / Auth) + Tailwind CSS + shadcn/ui  
> **Deployment Target**: Vercel  
> **Author / Generator**: Antigravity Assistant  

---

## 1. Executive Summary & Product Vision

This document serves as the comprehensive implementation blueprint for building a high-performance, SEO-optimized, and conversion-focused web platform for private pilgrim transport across the Kingdom of Saudi Arabia (Jeddah, Makkah, Madinah, and Taif).

### Core Differentiators & Value Proposition
* **Zero Advance Deposit / Pay on Arrival**: Customers pay in cash (SAR, USD, GBP) or local transfer directly to the chauffeur upon arrival at their destination hotel.
* **100% Fixed Fares**: Fares include highway tolls (Haramain Expressway), airport parking, fuel, and luggage assistance with zero surge pricing.
* **Flight Radar Tracking**: Incoming flights into King Abdulaziz International Airport (JED) and Prince Mohammad Bin Abdulaziz International Airport (MED) are tracked with free extended wait times for delays.
* **Complimentary Miqat Stopover**: Free ritual stop at designated Miqat boundary stations (Abyar Ali, Masjid Aisha / Tan'eem, Al-Juhfah, Qarn al-Manazil) for pilgrims to assume *Ihram* and perform prayer.
* **Dual Conversion Flow**: Direct client-side WhatsApp intent dispatch with automated lead persistence in a Supabase backend.

---

## 2. Technology Stack

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND LAYER                       │
│  Next.js 15 (App Router, Server Components, SSR / SSG) │
│  TypeScript, Tailwind CSS, shadcn/ui (Radix UI)        │
│  Lucide React Icons, React Hook Form + Zod             │
└───────────────────────────┬────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
   ┌───────────────────────┐ ┌───────────────────────┐
   │    CLIENT ACTIONS     │ │    BACKEND / DB       │
   │  WhatsApp Deep Link   │ │  Supabase (PostgreSQL)│
   │  Mobile Native Intent │ │  Supabase Auth & RLS  │
   │  Meta Pixel + GA4     │ │  Next.js Route Handler│
   └───────────────────────┘ └───────────────────────┘
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Static pre-rendering (SSG) for SEO route pages, Server Actions for mutations. |
| **Language** | **TypeScript 5.x** | End-to-end type safety between database schemas and frontend UI. |
| **Styling** | **Tailwind CSS v3 / v4** | Utility-first, mobile-responsive layout matching the yellow/dark palette. |
| **UI Components** | **shadcn/ui** (Radix UI) | Accessible, unstyled primitives: Popover, Calendar, Dialog, Combobox, Accordion. |
| **Database** | **Supabase (PostgreSQL)** | Persistent storage for routes, fleet tiers, pricing matrices, and booking leads. |
| **Authentication** | **Supabase Auth** | Secure login for the administrative dispatch dashboard. |
| **Validation** | **Zod + React Hook Form** | Runtime schema validation for customer contact details, dates, and luggage limits. |
| **Content / Blog** | **MDX / Contentlayer** | Fast, statically compiled pilgrim guides and Ziyarat itineraries for high organic rank. |
| **Deployment** | **Vercel** | Global Edge CDN, automated SSL, zero-maintenance infrastructure. |

---

## 3. Supabase Database Schema (DDL)

Run the following SQL migration script in your Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. VEHICLES TABLE
create table public.vehicles (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null, -- e.g., 'Toyota Camry', 'GMC Yukon XL'
    category text not null, -- 'Sedan', 'MPV', 'Minibus', 'VIP SUV', 'Bus'
    max_passengers integer not null,
    max_luggage integer not null,
    image_url text,
    is_active boolean default true not null
);

-- 2. ROUTES TABLE
create table public.routes (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    slug text unique not null, -- e.g., 'jeddah-airport-to-makkah-hotel'
    title text not null, -- 'Jeddah Airport to Makkah Hotel'
    origin_city text not null,
    destination_city text not null,
    distance_km numeric(6, 1),
    duration_mins integer,
    is_popular boolean default false not null,
    is_active boolean default true not null
);

-- 3. ROUTE PRICING MATRIX
create table public.route_pricing (
    id uuid primary key default uuid_generate_v4(),
    route_id uuid references public.routes(id) on delete cascade not null,
    vehicle_id uuid references public.vehicles(id) on delete cascade not null,
    price_sar numeric(8, 2) not null,
    unique(route_id, vehicle_id)
);

-- 4. DRIVERS TABLE
create table public.drivers (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    phone_number text not null,
    vehicle_plate text,
    license_number text,
    is_active boolean default true not null
);

-- 5. BOOKINGS / LEADS TABLE
create type booking_status as enum ('pending', 'confirmed', 'dispatched', 'completed', 'cancelled');

create table public.bookings (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    booking_reference text unique not null, -- e.g., 'UTO-84920'
    route_id uuid references public.routes(id),
    vehicle_id uuid references public.vehicles(id),
    customer_name text not null,
    customer_phone text not null,
    travel_date date not null,
    pickup_time text,
    flight_number text,
    passengers integer not null default 1,
    luggage integer not null default 1,
    estimated_price_sar numeric(8, 2),
    status booking_status default 'pending' not null,
    assigned_driver_id uuid references public.drivers(id),
    notes text
);

-- Row Level Security (RLS)
alter table public.vehicles enable row level security;
alter table public.routes enable row level security;
alter table public.route_pricing enable row level security;
alter table public.bookings enable row level security;
alter table public.drivers enable row level security;

-- Public can read active routes, vehicles, and pricing
create policy "Allow public read on vehicles" on public.vehicles for select using (is_active = true);
create policy "Allow public read on routes" on public.routes for select using (is_active = true);
create policy "Allow public read on pricing" on public.route_pricing for select using (true);

-- Public can insert new bookings (leads)
create policy "Allow public insert on bookings" on public.bookings for insert with check (true);

-- Authenticated staff can view and manage all bookings
create policy "Allow staff full access on bookings" on public.bookings for all using (auth.role() = 'authenticated');
create policy "Allow staff full access on drivers" on public.drivers for all using (auth.role() = 'authenticated');
```

---

## 4. Directory Structure (Next.js 15 App Router)

```text
umrah-taxi-web/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Homepage with Hero Booking Wizard
│   │   ├── about-us/page.tsx           # Company, Team & Drivers Bio
│   │   ├── contact-us/page.tsx         # SLA Table, Physical Address, Map
│   │   ├── fleet/page.tsx              # Vehicle specs (Camry, Staria, HiAce, GMC)
│   │   ├── [routeSlug]/page.tsx        # Dynamic route SEO landing pages (43+ routes)
│   │   └── blog/
│   │       ├── page.tsx                # Blog index (Ziyarat & travel guides)
│   │       └── [postSlug]/page.tsx     # MDX post details
│   ├── admin/                          # Authenticated Dispatch Dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Bookings list & filter
│   │   ├── pricing/page.tsx            # Price matrix editor
│   │   └── drivers/page.tsx            # Driver management
│   ├── api/
│   │   ├── bookings/route.ts           # Booking lead creation handler
│   │   └── meta-capi/route.ts          # Server-side Conversions API proxy
│   ├── globals.css
│   └── layout.tsx                      # Root layout, fonts, analytics scripts
├── components/
│   ├── booking/
│   │   ├── BookingWidget.tsx           # The Hero interactive booking card
│   │   ├── RouteSelect.tsx             # Searchable route dropdown
│   │   ├── DatePickerModal.tsx         # Lightweight calendar picker
│   │   ├── CounterInput.tsx            # Clamped passenger/luggage counter
│   │   └── PriceDisplay.tsx            # Real-time calculated SAR fare badge
│   ├── common/
│   │   ├── Navbar.tsx                  # Desktop horizontal nav + mobile drawer
│   │   ├── Footer.tsx                  # Legal links, TGA info, contact
│   │   └── WhatsAppFloatingBtn.tsx     # Native floating WhatsApp badge
│   └── ui/                             # shadcn/ui components (button, dialog, popover, etc.)
├── content/
│   └── blog/                           # MDX blog posts
│       ├── makkah-ziyarat-guide.mdx
│       └── jeddah-to-makkah-transport.mdx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Client-side Supabase client
│   │   └── server.ts                   # Server-side / Server Actions client
│   ├── utils.ts                        # cn() helper, text sanitizers
│   └── whatsapp.ts                     # WhatsApp URL builder with intent detection
├── types/
│   └── index.ts                        # TypeScript interfaces (Route, Vehicle, Booking)
└── public/
    ├── images/vehicles/                # Vehicle photos
    └── images/team/                    # Staff & driver portraits
```

---

## 5. Critical Component Implementation Blueprints

### A. WhatsApp URL Generator with Device Intent Routing (`lib/whatsapp.ts`)

```typescript
export interface WhatsAppBookingPayload {
  routeTitle: string;
  travelDate: string;
  passengers: number;
  luggage: number;
  estimatedPriceSar?: number;
  phoneDispatch?: string; // Default: '966591206299'
}

export function constructWhatsAppLink(payload: WhatsAppBookingPayload): string {
  const phone = payload.phoneDispatch || '966591206299';
  
  const text = [
    '*Assalam o Alaikum, New Umrah Taxi Request*',
    `*Route:* ${payload.routeTitle}`,
    `*Travel Date:* ${payload.travelDate}`,
    `*Passengers:* ${payload.passengers}`,
    `*Luggage Pieces:* ${payload.luggage}`,
    payload.estimatedPriceSar ? `*Estimated Fare:* ${payload.estimatedPriceSar} SAR (Pay on Arrival)` : null,
    '',
    'Please confirm vehicle availability and chauffeur details.'
  ]
    .filter(Boolean)
    .join('\n');

  const encodedText = encodeURIComponent(text);

  // Checks user agent on client side
  if (typeof window !== 'undefined') {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      return `whatsapp://send?phone=${phone}&text=${encodedText}`;
    }
  }

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
}
```

---

### B. Hero Booking Widget (`components/booking/BookingWidget.tsx`)

```tsx
'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Briefcase, MapPin, MessageSquare } from 'lucide-react';
import { constructWhatsAppLink } from '@/lib/whatsapp';

interface RouteOption {
  id: string;
  title: string;
  slug: string;
  basePrice: number; // e.g. 250 SAR for standard sedan
}

export function BookingWidget({ routes }: { routes: RouteOption[] }) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);
  const [luggage, setLuggage] = useState<number>(1);
  const [isSubmitting, startTransition] = useTransition();

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  const handleBookingClick = () => {
    if (!selectedRoute || !travelDate) return;

    // 1. Fire Analytics
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'taxi_booking_whatsapp_click',
        route: selectedRoute.title,
        date: travelDate,
        passengers,
        luggage,
      });
    }

    // 2. Open WhatsApp Intent
    const url = constructWhatsAppLink({
      routeTitle: selectedRoute.title,
      travelDate,
      passengers,
      luggage,
      estimatedPriceSar: selectedRoute.basePrice,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isFormValid = Boolean(selectedRouteId && travelDate);

  return (
    <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-amber-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="text-amber-500 w-5 h-5" />
        Book Private Chauffeur
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 ml-auto">
          Pay on Arrival
        </span>
      </h3>

      {/* Honeypot Spam Trap */}
      <input type="text" name="bot_trap" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-4">
        {/* Route Dropdown */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
            Select Pilgrimage Route
          </label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-800"
          >
            <option value="">-- Choose your route --</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.title} (From {route.basePrice} SAR)
              </option>
            ))}
          </select>
        </div>

        {/* Travel Date */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
            Travel Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-800"
          />
        </div>

        {/* Passenger & Luggage Counters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-500" /> Pax
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPassengers((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-5 text-center font-bold text-gray-800">{passengers}</span>
              <button
                type="button"
                onClick={() => setPassengers((prev) => Math.min(30, prev + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-gray-500" /> Bags
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLuggage((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-5 text-center font-bold text-gray-800">{luggage}</span>
              <button
                type="button"
                onClick={() => setLuggage((prev) => Math.min(40, prev + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Price Preview */}
        {selectedRoute && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-800 font-medium">Estimated Starting Fare:</p>
              <p className="text-lg font-extrabold text-amber-950">
                {selectedRoute.basePrice} SAR <span className="text-xs font-normal text-gray-600">(Sedan)</span>
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded-md">
              Free Miqat Stop Included
            </span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="button"
          disabled={!isFormValid}
          onClick={handleBookingClick}
          className="w-full py-6 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          BOOK VIA WHATSAPP (INSTANT CONFIRMATION)
        </Button>
      </div>
    </div>
  );
}
```

---

## 6. Implementation Checklist for Antigravity IDE

1. **Step 1: Project Initialization**
   * Run `pnpm create next-app@latest . --typescript --tailwind --eslint --app`
   * Run `pnpm dlx shadcn@latest init`
   * Install dependencies: `pnpm add @supabase/supabase-js @supabase/ssr lucide-react zod react-hook-form @hookform/resolvers date-fns`
2. **Step 2: Database Setup**
   * Create a Supabase project and execute the SQL schema from Section 3.
   * Add `.env.local` containing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **Step 3: Component & Widget Implementation**
   * Create `lib/whatsapp.ts` and `components/booking/BookingWidget.tsx`.
   * Add the hero section, fleet comparison table, and FAQ accordions to `app/(public)/page.tsx`.
4. **Step 4: Dynamic Route Generation (SSG)**
   * Implement `app/(public)/[routeSlug]/page.tsx` utilizing `generateStaticParams` to statically pre-render all 43 pilgrimage routes at build time.
5. **Step 5: Admin Panel & Dispatch CRM**
   * Build `app/admin/page.tsx` with Supabase Auth to view incoming leads and assign drivers.
6. **Step 6: Vercel Deployment & Domain Configuration**
   * Push repository to GitHub/GitLab and link to Vercel.
   * Configure root domain and add the missing `www` CNAME record pointing to `cname.vercel-dns.com`.
