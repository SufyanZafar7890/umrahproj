import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloatingBtn } from '@/components/WhatsAppFloatingBtn';
import { ProgressBar } from '@/components/ProgressBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Umrah Taxi Online | Private Pilgrim Chauffeurs in Makkah & Madinah',
  description:
    'Reliable, fixed-price private Umrah and Hajj taxi transfers between Jeddah Airport (KAIA), Makkah, and Madinah. Zero advance deposit, free Miqat stopover, and flight delay monitoring.',
  keywords: [
    'Umrah Taxi',
    'Jeddah Airport to Makkah Taxi',
    'Makkah to Madinah Taxi',
    'Hajj Transfer',
    'Pilgrim Private Chauffeur',
    'Miqat Stop Taxi'
  ],
  openGraph: {
    title: 'Umrah Taxi Online | Private Pilgrim Transfers',
    description: 'Zero advance deposit, 100% fixed fares, radar flight monitoring, and complimentary Miqat stopover.',
    url: 'https://umrahtaxionline.com',
    siteName: 'Umrah Taxi Online',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingBtn />
      </body>
    </html>
  );
}
