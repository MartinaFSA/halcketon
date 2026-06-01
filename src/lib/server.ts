import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key. This BYPASSES RLS,
// so it must never be imported into client components. Used by server-to-server
// flows with no authenticated user — e.g. the MercadoPago webhook writing to
// the RLS-protected tables.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
