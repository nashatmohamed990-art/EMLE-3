"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ── Password strength helper ──────────────────────────────────
function pwStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0,  label: "",        color: "var(--border)" };
  if (pw.length < 6)   return { score: 25, label: "Weak",    color: "#EF4444" };
  if (pw.length < 8)   return { score: 50, label: "Fair",    color: "#F59E0B" };
  const hasUpper   = /[A-Z]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
  if (hasUpper && hasSpecial) return { score: 100, label: "Strong",  color: "#10B981" };
  if (hasUpper || hasSpecial) return { score: 75,  label: "Good",    color: "#3B82F6" };
  return { score: 60, label: "Fair", color: "#F59E0B" };
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fname: "", lname: "", email: "", password: "", confirm: "", terms: false,
  });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [dark,     setDark]     = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("emle_theme") || "light";
    if (t === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
  }, []);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const strength = pwStrength(form.password);
  const passwordsMatch = form.confirm && form.confirm === form.password;
  const passwordsMismatch = form.confirm && form.confirm !== form.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!form.fname.trim() || !form.lname.trim()) {
      setError("Please enter your full name."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (!form.terms) {
      setError("Please accept the Terms of Service to continue."); return;
    }

    setLoading(true);

    // ── Supabase signup ─────────────────────────────
    const { data, error: signUpError } = await supabase.auth.signUp({
      email:    form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        // Supabase will send a confirmation email with this URL
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: `${form.fname.trim()} ${form.lname.trim()}`,
          first_name: form.fname.trim(),
          last_name:  form.lname.trim(),
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      // Map Supabase error messages to friendly ones
      if (signUpError.message.includes("already registered")) {
        setError("This email is already registered. Try logging in instead.");
      } else if (signUpError.message.includes("invalid email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(signUpError.message);
      }
      return;
    }

    // Supabase sends email; user.identities being empty means they already exist
    if (data.user && data.user.identities?.length === 0) {
      setError("This email is already registered. Try logging in instead.");
      return;
    }

    // ── Success → go to verify-email page ───────────
    router.push("/verify-email");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2"
      style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── LEFT PANEL ──────────────────────────── */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#003DA0,#0057FF 50%,#0099DD)" }}>
        <div className="relative z-10 text-white max-w-[380px]">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-xl mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
            </div>
            EMLE QBank
          </Link>
          <h2 className="text-3xl font-extrabold mb-3">Start Your Free Trial 🚀</h2>
          <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,.7)" }}>
            7 days of full access — no credit card required. Join 10,000+ Egyptian doctors preparing for EMLE.
          </p>
          <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)" }}>
            <div className="font-bold text-sm mb-4">🎁 Your Free Trial Includes:</div>
            {[
              "100 QBank questions (clinical vignettes)",
              "10 AI question generations",
              "Smart performance analytics",
              "Full trial mock exam",
              "No credit card required",
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm mb-3"
                style={{ color: "rgba(255,255,255,.85)" }}>
                <span className="font-black" style={{ color: "#4ADE80" }}>✓</span>{f}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: "rgba(255,255,255,.2)" }}>🔒</div>
            <div>
              <div className="font-bold text-sm">Secure & Private</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,.6)" }}>
                Your data is encrypted. We never share your info.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────── */}
      <div className="flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[440px]">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
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

          <h1 className="text-2xl font-extrabold mb-2">Create Your Account 🎓</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Start your 7-day free trial. No credit card required.
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

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>First Name *</label>
                <input type="text" value={form.fname}
                  onChange={e => set("fname", e.target.value)}
                  placeholder="Mohamed" required
                  className="input-field"
                  autoComplete="given-name" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>Last Name *</label>
                <input type="text" value={form.lname}
                  onChange={e => set("lname", e.target.value)}
                  placeholder="Hassan" required
                  className="input-field"
                  autoComplete="family-name" />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>Email Address *</label>
              <input type="email" value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="doctor@example.com" required
                className="input-field"
                autoComplete="email" />
              <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                📧 A verification email will be sent to this address
              </p>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>Password *</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="At least 8 characters" required
                  className="input-field"
                  style={{ paddingRight: "44px" }}
                  autoComplete="new-password" />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
                  style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${strength.score}%`, background: strength.color }} />
                  </div>
                  <p className="text-[11px] mt-1 font-semibold" style={{ color: strength.color }}>
                    {strength.label && `Password strength: ${strength.label}`}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="mb-5">
              <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>Confirm Password *</label>
              <div className="relative">
                <input type={showConf ? "text" : "password"}
                  value={form.confirm}
                  onChange={e => set("confirm", e.target.value)}
                  placeholder="Repeat password" required
                  className="input-field"
                  style={{
                    paddingRight: "44px",
                    borderColor: passwordsMismatch ? "var(--red)" : passwordsMatch ? "var(--green)" : "var(--border)",
                  }}
                  autoComplete="new-password" />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowConf(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
                  style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                  {showConf ? "🙈" : "👁"}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-[11px] mt-1 font-semibold" style={{ color: "var(--red)" }}>⚠️ Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="text-[11px] mt-1 font-semibold" style={{ color: "var(--green)" }}>✓ Passwords match</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
              <input type="checkbox" checked={form.terms}
                onChange={e => set("terms", e.target.checked)}
                className="mt-0.5 flex-shrink-0"
                style={{ accentColor: "var(--blue)", width: "16px", height: "16px" }} />
              <span className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                I agree to the{" "}
                <Link href="#" className="font-bold" style={{ color: "var(--blue)" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="font-bold" style={{ color: "var(--blue)" }}>Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
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
              {loading
                ? "Creating your account..."
                : "🚀 Create Account & Start Free Trial"}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-bold" style={{ color: "var(--blue)" }}>Log in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
