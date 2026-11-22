import React from 'react';
import { Testimonial } from '@/types/database';
import { Star, CheckCircle } from 'lucide-react';

export function TestimonialsSection({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  return (
    <section className="py-20 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Real Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3">
            What Pilgrims Say About Us
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Verified feedback from pilgrims across the United Kingdom, Canada, USA, Pakistan, and GCC countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={t.id || idx}
              className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "{t.review_text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{t.name}</h3>
                  <p className="text-xs text-gray-500">
                    {t.country} {t.trip_date ? `• ${t.trip_date}` : ''}
                  </p>
                </div>
                {t.is_verified && (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
