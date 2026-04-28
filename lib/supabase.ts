// ═══════════════════════════════════════════════
//  Supabase — Browser Client (used in Client Components)
// ═══════════════════════════════════════════════
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for convenience in client components
export const supabase = createClient();
