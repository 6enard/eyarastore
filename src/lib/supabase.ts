import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzenctmqmkinpaumfwva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5jdG1xbWtpbnBhdW1md3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNDkzODksImV4cCI6MjA5ODkyNTM4OX0.2yzYd56UuQmoKhIAB_5yJ8tpqE7ryDZiV1s-zD_tz0s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
