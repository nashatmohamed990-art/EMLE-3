"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ── Inner component uses useSearchParams (must be inside Suspense) ─────────
function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [dark,     setDark]     = useState(false);

  // Read ?next= redirect param and ?error= from email callback
  const nextPath    = searchParams.get("next") || "/dashboard";
  const urlError    = searchParams.get("error");

  useEffect(() => {
    const t = localStorage.getItem("emle_theme") || "light";
    if (t === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
    if (urlError) setError(urlError);

    // If already logged in, redirect away
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) router.replace(nextPath);
    });
  }, [nextPath, router, urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || pass.length < 6) {
      setError("Please enter a valid email and password (min 6 characters).");
      return;
    }

    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass,
    });

    if (signInError) {
      setLoading(false);
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else if (signInError.message.includes("Email not confirmed")) {
        // Send to verify-email page
        setError(null);
        router.push("/verify-email");
      } else {
        setError(signInError.message);
      }
      return;
    }

    const user = data.user;

    // ── Check email verified ──────────────────────
    if (!user?.email_confirmed_at) {
      setLoading(false);
      router.push("/verify-email");
      return;
    }

    // ── Sync user info to localStorage for navbar ─
    // (Only non-sensitive display info — real auth is in Supabase session cookie)
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, is_subscribed")
      .eq("id", user.id)
      .single();

    localStorage.setItem("emle_user", JSON.stringify({
      name:         profile?.full_name || user.user_metadata?.full_name || email.split("@")[0],
      email:        user.email,
      loggedIn:     true,
      isSubscribed: profile?.is_subscribed ?? false,
    }));

    setLoading(false);
    router.push(nextPath);
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email address above first."); return; }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` }
    );
    setLoading(false);
    if (resetError) { setError(resetError.message); }
    else { setError(null); alert(`✅ Password reset email sent to ${email}. Check your inbox.`); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2"
      style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── LEFT PANEL ──────────────────────────── */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#0A1628,#0D2050)" }}>
        <div className="absolute inset-0"
          style={{ background: "url(\"data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='1.5' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 text-white max-w-[380px]">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-xl mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--blue)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
            </div>
            EMLE <span style={{ color: "#60A5FA" }}>QBank</span>
          </Link>
          <h2 className="text-3xl font-extrabold mb-3">Welcome Back, Doctor 👋</h2>
          <p className="mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,.65)" }}>
            Continue your EMLE preparation. Your personalized study plan and progress are waiting.
          </p>
          {[
            ["📚", "4,000+ EMLE-Level Questions", "High-yield clinical vignettes with detailed explanations"],
            ["🤖", "AI Question Generator",        "Upload your notes — AI creates custom EMLE questions"],
            ["📊", "Smart Analytics",              "Know your weaknesses and predicted EMLE score"],
          ].map(([ic, t, d]) => (
            <div key={t} className="flex gap-3 p-4 rounded-xl mb-3"
              style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }}>
              <span className="text-xl flex-shrink-0">{ic}</span>
              <div>
                <div className="font-bold text-sm">{t}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,.55)" }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────── */}
      <div className="flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-base" style={{ color: "var(--text)" }}>
              <div className="w-[28px] h-[28px] rounded-lg flex items-center justify-center" style={{ background: "var(--blue)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                </svg>
              </div>
              EMLE <span style={{ color: "var(--blue)" }}>QBank</span>
            </Link>
            <button
              onClick={() => { const n = !dark; setDark(n); document.documentElement.classList.toggle("dark", n); localStorage.setItem("emle_theme", n ? "dark" : "light"); }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer" }}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>

          <h1 className="text-2xl font-extrabold mb-2">Log In</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Welcome back! Enter your credentials to continue.
          </p>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl text-xs font-bold mb-5 flex items-start gap-2"
              style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", color: "var(--red)" }}>
              <span className="flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>Email Address</label>
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="doctor@example.com" required
                className="input-field"
                autoComplete="email" />
            </div>

            <div className="mb-2">
              <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••" required
                  className="input-field"
                  style={{ paddingRight: "44px" }}
                  autoComplete="current-password" />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
                  style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-6">
              <button type="button" onClick={handleForgotPassword}
                className="text-xs font-bold cursor-pointer"
                style={{ background: "none", border: "none", color: "var(--blue)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-black text-sm text-white mb-4 transition-all"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: loading ? "#3B82F6" : "var(--blue)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 5px 16px rgba(0,87,255,.35)",
                opacity: loading ? 0.75 : 1,
              }}>
              {loading ? "Logging in..." : "Log In to EMLE QBank"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5" style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            or
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Info box — no fake social login */}
          <div className="p-3 rounded-xl mb-6 text-xs"
            style={{ background: "var(--blue-soft)", border: "1px solid rgba(0,87,255,.15)", color: "var(--text-mid)" }}>
            🔒 <strong style={{ color: "var(--blue)" }}>Secure login</strong> — Your account is protected with email verification.
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold" style={{ color: "var(--blue)" }}>Create one free →</Link>
          </div>

          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold" style={{ color: "var(--blue)" }}>Sign up free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense because useSearchParams requires it in Next.js 14+
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg)" }} />}>
      <LoginForm />
    </Suspense>
  );
}
