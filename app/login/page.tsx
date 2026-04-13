"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("emle_theme") || "light";
    if (t === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
    const u = localStorage.getItem("emle_user");
    if (u) { try { if (JSON.parse(u).loggedIn) window.location.href = "/dashboard"; } catch {} }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || pass.length < 6) { setError("Please enter valid credentials (password min 6 chars)."); return; }
    setLoading(true);
    setTimeout(() => {
      const name = email === "doctor@emle.com" ? "Mohamed Hassan" : email.split("@")[0].replace(/[._]/g," ");
      localStorage.setItem("emle_user", JSON.stringify({ name, email, loggedIn: true }));
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background:"var(--bg)", color:"var(--text)" }}>
      {/* LEFT */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background:"linear-gradient(145deg,#0A1628,#0D2050)" }}>
        <div className="absolute inset-0" style={{ background:"url(\"data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='1.5' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")" }}/>
        <div className="relative z-10 text-white max-w-[380px]">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-xl mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"var(--blue)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color:"#60A5FA" }}>QBank</span>
          </Link>
          <h2 className="text-3xl font-extrabold mb-3">Welcome Back, Doctor 👋</h2>
          <p className="mb-10 leading-relaxed" style={{ color:"rgba(255,255,255,.65)" }}>Continue your EMLE preparation. Your personalized study plan and progress are waiting.</p>
          {[["📚","4,000+ EMLE-Level Questions","High-yield clinical vignettes with explanations"],["🤖","AI Question Generator","Upload your notes — AI creates custom EMLE questions"],["📊","Smart Analytics","Know your weaknesses and predicted EMLE score"]].map(([ic,t,d])=>(
            <div key={t as string} className="flex gap-3 p-4 rounded-xl mb-3" style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)" }}>
              <span className="text-xl flex-shrink-0">{ic}</span>
              <div><div className="font-bold text-sm">{t as string}</div><div className="text-xs mt-1" style={{ color:"rgba(255,255,255,.55)" }}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-base" style={{ color:"var(--text)" }}>
              <div className="w-[28px] h-[28px] rounded-lg flex items-center justify-center" style={{ background:"var(--blue)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              </div>
              EMLE <span style={{ color:"var(--blue)" }}>QBank</span>
            </Link>
            <button onClick={()=>{const n=!dark;setDark(n);document.documentElement.classList.toggle("dark",n);localStorage.setItem("emle_theme",n?"dark":"light");}} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border:"1px solid var(--border)", background:"var(--bg-card)", cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
          </div>

          <h1 className="text-2xl font-extrabold mb-2">Log In</h1>
          <p className="text-sm mb-4" style={{ color:"var(--text-muted)" }}>Welcome back! Enter your credentials to continue.</p>

          <div className="p-3 rounded-xl text-xs mb-6" style={{ background:"var(--blue-soft)", border:"1px solid rgba(0,87,255,.15)", color:"var(--text-mid)" }}>
            🧪 <strong style={{ color:"var(--blue)" }}>Demo:</strong> Email: <strong>doctor@emle.com</strong> · Password: <strong>123456</strong> (or any valid email + 6+ chars)
          </div>

          {error && <div className="p-3 rounded-xl text-xs font-bold mb-4" style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", color:"var(--red)" }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="doctor@example.com" required className="input-field" style={{ paddingRight:"40px" }}/>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required className="input-field" style={{ paddingRight:"40px" }}/>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm text-white mb-4 transition-all" style={{ background:loading?"#3B82F6":"var(--blue)", border:"none", cursor:loading?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 5px 16px rgba(0,87,255,.35)", opacity:loading?.7:1 }}>
              {loading ? "Logging in..." : "Log In to EMLE QBank"}
            </button>
          </form>

          <div className="flex items-center gap-3 mb-4" style={{ color:"var(--text-muted)", fontSize:"12px" }}>
            <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>or continue with<div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {["🇬 Google"," Apple"].map(p=>(
              <button key={p} onClick={()=>{localStorage.setItem("emle_user",JSON.stringify({name:"EMLE Doctor",email:"demo@google.com",loggedIn:true}));window.location.href="/dashboard";}} className="py-[10px] rounded-xl text-sm font-bold transition-all" style={{ border:"1.5px solid var(--border)", background:"var(--bg-card)", color:"var(--text-mid)", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{p}</button>
            ))}
          </div>
          <p className="text-center text-sm" style={{ color:"var(--text-muted)" }}>Don&apos;t have an account? <Link href="/register" className="font-bold" style={{ color:"var(--blue)" }}>Sign up free →</Link></p>
        </div>
      </div>
    </div>
  );
}
