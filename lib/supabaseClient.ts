import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkagdfwlihzxxbmbtgag.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYWdkZndsaWh6eHhibWJ0Z2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NDQ5NDYsImV4cCI6MjEwNzAyMDk0Nn0.QTB2USXO8WC81qcxAk0Px80wD8swrdjI-CyA4bzwwsI';

export const supabase = createClient(supabaseUrl, supabaseKey);
