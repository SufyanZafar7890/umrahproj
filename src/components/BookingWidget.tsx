'use client';

import React, { useState, useEffect } from 'react';
import { Route, Vehicle, RoutePricing } from '@/types/database';
import { constructWhatsAppLink, cleanWhatsAppNumber } from '@/lib/whatsapp';
import { getSiteSettings } from '@/lib/supabase/data';
import {
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Car,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

interface BookingWidgetProps {
  routes: Route[];
  vehicles: Vehicle[];
  pricing?: RoutePricing[];
  whatsappNumber?: string;
}

export function BookingWidget({
  routes,
  vehicles,
  pricing = [],
  whatsappNumber,
}: BookingWidgetProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [travelDate, setTravelDate] = useState<string>('');
  const [minDate, setMinDate] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(2);
  const [luggage, setLuggage] = useState<number>(2);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    setMinDate(today);
    const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
    setTravelDate(tomorrow);
  }, []);

  useEffect(() => {
    if (routes.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routes[0].id);
    }
  }, [routes, selectedRouteId]);

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // 100% Dynamic Pricing from Supabase Matrix
  const getDynamicFare = (): number => {
    if (!selectedRoute || !selectedVehicle) return 250;

    // Look up exact match in Supabase route_pricing table
    const exactMatch = pricing.find(
      (p) => p.route_id === selectedRoute.id && p.vehicle_id === selectedVehicle.id
    );
    if (exactMatch && exactMatch.price_sar) {
      return Number(exactMatch.price_sar);
    }

    // Fallback: Route base price with category ratio
    const base = selectedRoute.base_price_sar || 250;
    if (selectedVehicle?.category === 'MPV') return Math.round(base * 1.35);
    if (selectedVehicle?.category === 'VIP SUV') return Math.round(base * 2.2);
    if (selectedVehicle?.category === 'Minibus') return Math.round(base * 1.7);
    return base;
  };

  const calculatedFare = getDynamicFare();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoute || !travelDate) return;

    setIsSubmitting(true);

    try {
      // 1. Asynchronously log lead to Edge API / Supabase
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route_id: selectedRoute.id,
          route_title: selectedRoute.title,
          vehicle_name: selectedVehicle?.name || 'Standard Vehicle',
          customer_name: customerName || 'Valued Pilgrim',
          customer_phone: customerPhone || 'WhatsApp Client',
          travel_date: travelDate,
          flight_number: flightNumber || null,
          passengers,
          luggage,
          estimated_price_sar: calculatedFare,
        }),
      }).catch((err) => console.warn('Lead logging skipped:', err));

      // Fetch latest updated WhatsApp number dynamically from Supabase
      let activeWhatsapp = cleanWhatsAppNumber(whatsappNumber);
      try {
        const latestSettings = await getSiteSettings();
        if (latestSettings?.whatsapp_number) {
          activeWhatsapp = cleanWhatsAppNumber(latestSettings.whatsapp_number);
        }
      } catch (err) {
        console.warn('Fallback to prop whatsapp number:', err);
      }

      // 2. Build WhatsApp intent URL using dynamic settings
      const whatsappUrl = constructWhatsAppLink({
        routeTitle: selectedRoute.title,
        travelDate,
        passengers,
        luggage,
        vehicleName: selectedVehicle?.name,
        estimatedPriceSar: calculatedFare,
        phoneDispatch: activeWhatsapp,
      });

      // 3. Open WhatsApp dispatch
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-amber-100/80 relative">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Instant Dispatch
          </span>
          <h3 className="text-xl font-black text-gray-950 mt-1">Book Your Chauffeur</h3>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Pay on Hotel Arrival
          </span>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Route Select */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            Pick-up & Destination Route
          </label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-gray-800 text-sm transition-all"
            required
          >
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.distance_km} km)
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-amber-500" />
            Vehicle Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 text-gray-950 font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs truncate">{v.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{v.category}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Date */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            Travel Date
          </label>
          <input
            type="date"
            min={minDate}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-gray-800 text-sm"
            required
          />
        </div>

        {/* Passenger and Luggage Counter */}
        <div className="grid grid-cols-2 gap-3">
          {/* Passengers */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-500" /> Pax
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPassengers((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-5 text-center font-bold text-gray-900 text-sm">
                {passengers}
              </span>
              <button
                type="button"
                onClick={() => setPassengers((prev) => Math.min(30, prev + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Luggage */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-gray-500" /> Bags
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLuggage((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-5 text-center font-bold text-gray-900 text-sm">
                {luggage}
              </span>
              <button
                type="button"
                onClick={() => setLuggage((prev) => Math.min(40, prev + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Optional Toggle for flight & name */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>{showOptionalFields ? '− Hide' : '+ Add'} Flight Number / Pilgrim Name (Optional)</span>
          </button>

          {showOptionalFields && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
              <input
                type="text"
                placeholder="Pilgrim Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
              />
              <input
                type="text"
                placeholder="Flight No. (e.g., SV732)"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 uppercase"
              />
            </div>
          )}
        </div>

        {/* Dynamic Fare Preview Card */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>All-Inclusive Starting Fare</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-gray-950">{calculatedFare}</span>
              <span className="text-sm font-bold text-gray-800">SAR</span>
              <span className="text-[11px] text-gray-500 ml-1">({selectedVehicle?.name.split(' ')[0]})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded-md">
              Free Miqat Stop Included
            </span>
            <p className="text-[10px] text-gray-500 mt-0.5">Includes Tolls & Fuel</p>
          </div>
        </div>

        {/* WhatsApp Dispatch Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting Dispatch Chauffeur...</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>BOOK VIA WHATSAPP (INSTANT CONFIRMATION)</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-gray-500 flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          Average WhatsApp response time: <strong className="text-gray-700">1-2 Minutes</strong>
        </p>
      </form>
    </div>
  );
}
