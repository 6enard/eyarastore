import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://dsydyqinmlmuqanpgrpx.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeWR5cWlubWxtdXFhbnBncnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NTM3NDAsImV4cCI6MjEwMjEyOTc0MH0.Mq48soNiA9HquX8vnzXqGDJ-Gyee9eKgPzCcoeK33wQ';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
