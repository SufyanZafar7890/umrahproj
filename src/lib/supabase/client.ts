import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://lbfmxgnxihujjcrzhjzn.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZm14Z254aWh1ampjcnpoanpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNDYwMTUsImV4cCI6MjExMDkyMjAxNX0.Qa66Yo7nKaQTMAdLvyEK9PSy0-XKCe4awhIZmU9F5p4';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseAnonKey && !supabaseAnonKey.includes('placeholder')
);

// Client instance for client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

