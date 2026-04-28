"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function VerifyEmailPage() {
  const [email,       setEmail]       = useState<string | null>(null);
  const [resending,   setResending]   = useState(false);
  const [resent,      setResent]      = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown,   setCountdown]   = useState(0);

  // ── Get email from Supabase session ───────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) setEmail(session.user.email);
    });
  }, []);

  // ── Countdown timer after resend ──────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = async () => {
    if (!email || countdown > 0) return;
    setResending(true);
    setResendError(null);

    const { error } = await supabase.auth.resend({
      type:  "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setResending(false);
    if (error) {
      setResendError(error.message);
    } else {
      setResent(true);
      setCountdown(60); // 60-second cooldown
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg)", color: "var(--text)" }}>

      <div className="w-full max-w-[460px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-base mb-10 justify-center"
          style={{ color: "var(--text)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--blue)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
            </svg>
          </div>
          EMLE <span style={{ color: "var(--blue)" }}>QBank</span>
        </Link>

        {/* Card */}
        <div className="card p-8 text-center">

          {/* Animated envelope */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"
            style={{ background: "var(--blue-soft)", border: "2px solid rgba(0,87,255,.2)" }}>
            <span className="text-4xl">📧</span>
          </div>

          <h1 className="text-2xl font-extrabold mb-3">Check Your Email</h1>

          <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-mid)" }}>
            We sent a verification link to:
          </p>
          <p className="font-black text-base mb-6" style={{ color: "var(--blue)" }}>
            {email ?? "your email address"}
          </p>

          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            Click the link in the email to verify your account and start your <strong style={{ color: "var(--text)" }}>7-day free trial</strong>.
            The link expires in 24 hours.
          </p>

          {/* Steps */}
          <div className="text-left flex flex-col gap-3 mb-8">
            {[
              { n: "1", text: "Open your email inbox" },
              { n: "2", text: `Find the email from EMLE QBank` },
              { n: "3", text: "Click the \"Verify Email\" button" },
              { n: "4", text: "You'll be redirected to your dashboard" },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ background: "var(--blue)" }}>{n}</div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Resend section */}
          {resent && (
            <div className="p-3 rounded-xl mb-4 text-xs font-bold"
              style={{ background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)", color: "var(--green)" }}>
              ✅ Verification email resent! Check your inbox.
            </div>
          )}

          {resendError && (
            <div className="p-3 rounded-xl mb-4 text-xs font-bold"
              style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", color: "var(--red)" }}>
              ⚠️ {resendError}
            </div>
          )}

          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            Didn&apos;t receive it? Check spam, or:
          </p>

          <button onClick={handleResend}
            disabled={resending || countdown > 0}
            className="w-full py-3 rounded-xl font-bold text-sm mb-4 cursor-pointer transition-all"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: countdown > 0 ? "var(--border)" : "var(--blue-soft)",
              color:      countdown > 0 ? "var(--text-muted)" : "var(--blue)",
              border:     `1.5px solid ${countdown > 0 ? "var(--border)" : "rgba(0,87,255,.3)"}`,
              cursor:     countdown > 0 ? "not-allowed" : "pointer",
            }}>
            {resending
              ? "Sending..."
              : countdown > 0
                ? `Resend available in ${countdown}s`
                : "📨 Resend Verification Email"}
          </button>

          <Link href="/login"
            className="block text-sm font-semibold"
            style={{ color: "var(--text-muted)" }}>
            ← Back to Login
          </Link>
        </div>

        {/* Spam tip */}
        <div className="mt-4 p-4 rounded-xl text-xs" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          💡 <strong>Tip:</strong> If you don&apos;t see the email within 2 minutes, check your{" "}
          <strong>Spam</strong> or <strong>Junk</strong> folder. Mark it as &quot;Not Spam&quot; to receive future emails.
        </div>
      </div>
    </div>
  );
}
