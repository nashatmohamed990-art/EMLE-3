// ═══════════════════════════════════════════════
//  EMLE QBank — Route Protection Middleware
//  Runs on every request BEFORE the page renders
// ═══════════════════════════════════════════════
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient }  from "@/lib/supabase-server";

// Routes that require a logged-in, verified user
const PROTECTED = ["/dashboard", "/qbank/session", "/ai-generator"];

// Routes that require a paid subscription on top of auth
const PAID_ONLY  = ["/qbank/session"];

// Routes that logged-in users should not see (auth pages)
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response     = NextResponse.next({ request });

  // ── Build Supabase client ─────────────────────
  const supabase = createSupabaseMiddlewareClient(request, response);

  // ── Get session ───────────────────────────────
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  // ── Redirect logged-in users away from auth pages
  if (user && AUTH_PAGES.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Protect private routes ────────────────────
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (isProtected) {
    // Not logged in → login
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Logged in but email NOT confirmed → verify-email
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }

    // Paid-only routes: check profile subscription
    if (PAID_ONLY.some(p => pathname.startsWith(p))) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_subscribed, trial_ends_at")
        .eq("id", user.id)
        .single();

      const inTrial = profile?.trial_ends_at
        ? new Date(profile.trial_ends_at) > new Date()
        : false;

      if (!profile?.is_subscribed && !inTrial) {
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
