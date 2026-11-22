'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  hotline?: string;
  companyName?: string;
  tgaText?: string;
}

export function Navbar({
  hotline = '966591206299',
  companyName = 'Umrah Taxi Online',
  tgaText = 'Saudi TGA Compliant Chauffeurs • 0 Advance Payment • Free Miqat Stopover',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Dynamic Top Banner */}
      <div className="bg-amber-500 text-gray-950 px-4 py-1.5 text-xs font-semibold text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        <span>{tgaText}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-gray-950 font-black flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              UT
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                {companyName.split(' ')[0]} <span className="text-amber-600">{companyName.split(' ').slice(1).join(' ')}</span>
              </span>
              <span className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                Private Pilgrim Transfers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link href="/routes" className="hover:text-amber-600 transition-colors">
              Routes & Pricing
            </Link>
            <Link href="/fleet" className="hover:text-amber-600 transition-colors">
              Our Fleet
            </Link>
            <Link href="/about-us" className="hover:text-amber-600 transition-colors">
              About Us
            </Link>
            <Link href="/contact-us" className="hover:text-amber-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:+${hotline}`}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-gray-600" />
              +{hotline}
            </a>

            <a
              href={`https://api.whatsapp.com/send?phone=${hotline}&text=${encodeURIComponent(
                'Assalam o Alaikum, I would like to inquire about Umrah Taxi service.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              WhatsApp 24/7
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-800 hover:bg-amber-50"
          >
            Home
          </Link>
          <Link
            href="/routes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-800 hover:bg-amber-50"
          >
            Routes & Pricing
          </Link>
          <Link
            href="/fleet"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-800 hover:bg-amber-50"
          >
            Our Fleet
          </Link>
          <Link
            href="/about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-800 hover:bg-amber-50"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-800 hover:bg-amber-50"
          >
            Contact
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`https://api.whatsapp.com/send?phone=${hotline}&text=${encodeURIComponent(
                'Assalam o Alaikum, I would like to inquire about Umrah Taxi service.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
