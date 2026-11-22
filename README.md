# Umrah Taxi Web Platform 🕋

A modern, high-conversion web platform for private Umrah & Hajj pilgrim transfers across Saudi Arabia (Jeddah, Makkah, Madinah, and Taif). Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL)**, and configured for **Cloudflare** & **GitHub**.

---

## 🌟 Key Differentiators & Features

1. **Zero Advance Deposit / Pay on Arrival**: Fares are settled in cash or card directly with the chauffeur upon hotel arrival.
2. **100% Fixed Rates**: All-inclusive pricing covering highway tolls, airport parking fees, fuel, and luggage assistance.
3. **Flight Radar Delay Monitoring**: Free extended waiting times when flights into Jeddah (KAIA) or Madinah (MED) are delayed.
4. **Complimentary Miqat Stopover**: Free ritual stop at designated Miqat boundary stations (Abyar Ali, Masjid Aisha) to assume Ihram and pray.
5. **Interactive Booking Engine**: Real-time fare calculation, route picker, passenger & luggage counters, and native mobile WhatsApp deep-linking.
6. **Supabase PostgreSQL & Leads Capture**: Asynchronous lead logging in `/api/bookings` before WhatsApp dispatch.
7. **Cloudflare & Vercel Ready**: Preconfigured with `wrangler.jsonc` for Cloudflare Pages/Workers and Edge CDN.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) / [Vercel](https://vercel.com/)
- **Version Control**: Git & GitHub

---

## 📁 Project Directory Structure

```text
umrahproj/
├── public/                     # Static icons and assets
├── src/
│   ├── app/
│   │   ├── api/bookings/       # Lead capture & Supabase ingestion route
│   │   ├── about-us/           # Company story, Haroon Kainth & TGA info
│   │   ├── contact-us/         # 24/7 Dispatch SLA & Hotline
│   │   ├── fleet/              # Vehicle fleet (Camry, Staria, HiAce, Yukon)
│   │   ├── routes/             # All pilgrimage routes & fixed prices
│   │   ├── globals.css         # Tailwind styles & theme variables
│   │   ├── layout.tsx          # Root layout with Navbar, Footer & WhatsApp
│   │   └── page.tsx            # High-conversion Homepage
│   ├── components/
│   │   ├── BookingWidget.tsx   # Interactive booking wizard & price preview
│   │   ├── FleetSection.tsx    # Fleet showcase grid
│   │   ├── RoutesSection.tsx   # Routes & pricing grid
│   │   ├── TrustFeatures.tsx   # 6 Core pilgrim value pillars
│   │   ├── TestimonialsSection.tsx # Verified pilgrim feedback
│   │   ├── FAQSection.tsx      # Accordion FAQs
│   │   ├── Navbar.tsx          # Responsive navigation & hotlines
│   │   ├── Footer.tsx          # TGA info & legal links
│   │   └── WhatsAppFloatingBtn.tsx # Native bottom-right WhatsApp quick chat
│   ├── data/
│   │   └── mockData.ts         # Routes, fleet, FAQ, and testimonials
│   ├── lib/
│   │   ├── supabase/           # Client and Server Supabase instances
│   │   ├── utils.ts            # Utility functions (cn, formatCurrency)
│   │   └── whatsapp.ts         # Dynamic deep-link generator
│   └── types/
│       └── database.ts         # Type definitions (Route, Vehicle, Booking)
├── supabase/
│   ├── migrations/             # PostgreSQL schema DDL with RLS policies
│   └── seed.sql                # Initial routes and vehicle seed data
├── wrangler.jsonc              # Cloudflare configuration
└── .env.example                # Environment variable template
```

---

## 🚀 Quickstart & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_WHATSAPP_NUMBER=966591206299
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the migration script located at:
   `supabase/migrations/20261122000001_initial_schema.sql`
4. Run the seed data script:
   `supabase/seed.sql`

---

## ☁️ Cloudflare Deployment

### Option A: Cloudflare Pages via GitHub (Recommended)
1. Push this repository to GitHub.
2. In Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Set Build Settings:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. Add your Environment Variables in Cloudflare Pages Settings (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, etc.).

### Option B: Wrangler CLI
```bash
npx wrangler pages deploy .next
```

---

## 🐙 Push to GitHub

To push this project to your GitHub account:

```bash
# 1. Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/umrah-taxi-web.git

# 2. Rename branch to main
git branch -M main

# 3. Push to GitHub
git push -u origin main
```
