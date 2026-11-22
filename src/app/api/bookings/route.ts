import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      route_id,
      route_title,
      vehicle_name,
      customer_name,
      customer_phone,
      travel_date,
      pickup_time,
      flight_number,
      passengers,
      luggage,
      estimated_price_sar,
      notes,
    } = body;

    // Generate unique human-readable booking reference
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const booking_reference = `UTO-${randomSuffix}`;

    const bookingPayload = {
      booking_reference,
      route_id: route_id || 'custom-route',
      route_title: route_title || 'Pilgrim Transfer',
      vehicle_name: vehicle_name || 'Standard Vehicle',
      customer_name: customer_name || 'Pilgrim Guest',
      customer_phone: customer_phone || 'WhatsApp Inquiry',
      travel_date: travel_date || new Date().toISOString().split('T')[0],
      pickup_time: pickup_time || 'Pending Confirmation',
      flight_number: flight_number || null,
      passengers: Number(passengers) || 1,
      luggage: Number(luggage) || 1,
      estimated_price_sar: Number(estimated_price_sar) || 250,
      status: 'pending',
      notes: notes || '',
    };

    // If Supabase is connected, persist to PostgreSQL
    if (isSupabaseConfigured) {
      const supabase = createServerClient();
      const { data, error } = await supabase.from('bookings').insert(bookingPayload).select().single();

      if (error) {
        console.error('Supabase DB Insert Error:', error);
        // Fall back gracefully so user workflow is not interrupted
      } else {
        return NextResponse.json({ success: true, booking: data });
      }
    }

    // Graceful response for lead tracking
    return NextResponse.json({
      success: true,
      booking: bookingPayload,
      message: 'Booking lead initialized successfully. Proceed with WhatsApp dispatch.',
    });
  } catch (err: any) {
    console.error('Booking API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
