import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "[Campus Glow] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
    "Set them in your Vercel Project → Settings → Environment Variables, then redeploy."
  );
}

// Use safe fallbacks so the app doesn't crash at module-load time. Queries will
// simply fail gracefully (context already catches errors).
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
