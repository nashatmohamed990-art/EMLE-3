// ═══════════════════════════════════════════════
//  Supabase — Server Client (used in middleware & Server Components)
// ═══════════════════════════════════════════════
import { createServerClient } from "@supabase/ssr";
import { type cookies }        from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// For Server Components / Route Handlers
export async function createSupabaseServerClient() {
  const { cookies: cookieStore } = await import("next/headers");
  const store = await cookieStore();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()                { return store.getAll(); },
        setAll(cookiesToSet)    { cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options)); },
      },
    }
  );
}

// For Middleware (takes request + response directly)
export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()             { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}
