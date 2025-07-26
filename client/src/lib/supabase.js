import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsyylfyijnleqqryrons.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeXlsZnlpam5sZXFxcnlyb25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzgxOTEsImV4cCI6MjA2OTAxNDE5MX0.pp6gaTGGp7z-sdJNmwteMUj4Ji13xie29rG64fEEqVw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
