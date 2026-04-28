// ═══════════════════════════════════════════════
//  /auth/callback — Supabase email confirmation redirect
//  Supabase sends the user here after they click
//  the verification link in their email.
// ═══════════════════════════════════════════════
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient }     from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");

  // Supabase sends an error param if token is expired / invalid
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Verification link expired. Please log in and request a new one.")}`
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();

    // Exchange the one-time code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // ── Create/ensure the profile row exists ──
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existing) {
          // Insert new profile with 7-day free trial
          await supabase.from("profiles").insert({
            id:             user.id,
            full_name:      user.user_metadata?.full_name ?? "",
            email:          user.email,
            is_subscribed:  false,
            trial_ends_at:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            subscription_plan: null,
            subscription_ends_at: null,
            created_at:     new Date().toISOString(),
          });
        }
      }

      // Redirect to dashboard (or wherever `next` says)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback — something went wrong
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Email verification failed. Please try again.")}`
  );
}
