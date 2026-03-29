import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('DEBUG: SUPABASE_URL:', supabaseUrl);
console.log('DEBUG: SUPABASE_ANON_KEY exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase credentials not found in .env file');
  console.error('   Required: SUPABASE_URL and SUPABASE_ANON_KEY');
  console.log('📴 OFFLINE MODE: Using mock client');
} else {
  console.log('✅ Supabase configuration loaded');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false
    }
  }
);

export default supabase;

