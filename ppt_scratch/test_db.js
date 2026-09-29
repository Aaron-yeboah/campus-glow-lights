const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbiekwghesmagnwajdxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWVrd2doZXNtYWdud2FqZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTc3NDcsImV4cCI6MjA4Nzg3Mzc0N30.7iCHYc2P6-BeeAv1RD4hJyU7Opu3jNuV3GpZaXcxwcU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('poles').select('*').limit(1);
  console.log("Poles sample row:", data, "Error:", error);
}

test();
