import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sjkdwdntwhkiogtsmuhr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqa2R3ZG50d2hraW9ndHNtdWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTgxMzAsImV4cCI6MjA5ODk3NDEzMH0.hStAZmdIdkUApR_4HN9TPtOvkZvNDTuFn5kjRPQbjy0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
