import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://gaxkksakfuaobfgovazl.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheGtrc2FrZnVhb2JmZ292YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyODYxMzAsImV4cCI6MjEwMzg2MjEzMH0.ta4m8vMxBiU_EpiB5YSNHCvAhqwB9gLGfK5AIUa7L30';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
