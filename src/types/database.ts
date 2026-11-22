export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookingStatus = 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';

export interface SiteSetting {
  id?: string;
  key: string;
  value: string;
  label?: string;
  category?: string;
  updated_at?: string;
}

export interface Vehicle {
  id: string;
  created_at?: string;
  name: string;
  category: 'Sedan' | 'MPV' | 'VIP SUV' | 'Minibus' | 'Bus' | string;
  max_passengers: number;
  max_luggage: number;
  image_url: string;
  features: string[];
  display_order?: number;
  is_active: boolean;
}

export interface Route {
  id: string;
  created_at?: string;
  slug: string;
  title: string;
  origin_city: string;
  destination_city: string;
  distance_km: number;
  duration_mins: number;
  is_popular: boolean;
  base_price_sar?: number;
  display_order?: number;
  is_active: boolean;
}

export interface RoutePricing {
  id?: string;
  route_id: string;
  vehicle_id: string;
  price_sar: number;
}

export interface Testimonial {
  id?: string;
  name: string;
  country: string;
  rating: number;
  review_text: string;
  trip_date?: string;
  is_verified: boolean;
  display_order?: number;
  is_active: boolean;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
  is_active: boolean;
}

export interface Booking {
  id?: string;
  created_at?: string;
  booking_reference: string;
  route_id: string;
  route_title: string;
  vehicle_name: string;
  customer_name: string;
  customer_phone: string;
  travel_date: string;
  pickup_time?: string;
  flight_number?: string;
  passengers: number;
  luggage: number;
  estimated_price_sar: number;
  status: BookingStatus;
  notes?: string;
}
