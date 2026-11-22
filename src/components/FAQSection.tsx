'use client';

import React, { useState } from 'react';
import { FAQ } from '@/types/database';
import { ChevronDown } from 'lucide-react';

export function FAQSection({ faqs = [] }: { faqs?: FAQ[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Everything you need to know about booking, flight delays, Miqat stops, and payments.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.id || idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left font-bold text-gray-900 flex items-center justify-between gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm sm:text-base">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 py-5 bg-white border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
