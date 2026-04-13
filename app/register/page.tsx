"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ fname:"", lname:"", email:"", password:"", confirm:"", terms:false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("emle_theme") || "light";
    if (t === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
  }, []);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fname || !form.lname) { alert("Please enter your full name."); return; }
    if (form.password.length < 8) { alert("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { alert("Passwords do not match."); return; }
    if (!form.terms) { alert("Please accept the Terms of Service."); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("emle_user", JSON.stringify({ name:`${form.fname} ${form.lname}`, email:form.email, loggedIn:true }));
      setDone(true);
      setTimeout(() => window.location.href = "/dashboard", 2000);
    }, 1400);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"var(--bg)" }}>
      <div className="card p-10 text-center max-w-sm">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-xl font-extrabold mb-2">Welcome to EMLE QBank!</h2>
        <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>Your account is ready. Your 7-day free trial has started!</p>
        <p className="text-xs" style={{ color:"var(--text-muted)" }}>Redirecting to dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background:"var(--bg)", color:"var(--text)" }}>
      {/* LEFT */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background:"linear-gradient(145deg,#003DA0,#0057FF 50%,#0099DD)" }}>
        <div className="relative z-10 text-white max-w-[380px]">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-xl mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"rgba(255,255,255,.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE QBank
          </Link>
          <h2 className="text-3xl font-extrabold mb-3">Start Your Free Trial 🚀</h2>
          <p className="mb-8 leading-relaxed" style={{ color:"rgba(255,255,255,.7)" }}>7 days of full access — no credit card required.</p>
          <div className="p-5 rounded-2xl" style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.18)" }}>
            <div className="font-bold text-sm mb-4">🎁 Your Free Trial Includes:</div>
            {["100 QBank questions","10 AI question generations","SmartCards & ReadyDecks","Performance analytics","Full trial mock exam"].map(f=>(
              <div key={f} className="flex items-center gap-3 text-sm mb-3" style={{ color:"rgba(255,255,255,.85)" }}>
                <span style={{ color:"#4ADE80" }} className="font-black">✓</span>{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-base" style={{ color:"var(--text)" }}>
              <div className="w-[28px] h-[28px] rounded-lg flex items-center justify-center" style={{ background:"var(--blue)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              </div>
              EMLE <span style={{ color:"var(--blue)" }}>QBank</span>
            </Link>
            <button onClick={()=>{const n=!dark;setDark(n);document.documentElement.classList.toggle("dark",n);localStorage.setItem("emle_theme",n?"dark":"light");}} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border:"1px solid var(--border)", background:"var(--bg-card)", cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
          </div>

          <h1 className="text-2xl font-extrabold mb-2">Create Your Account 🎓</h1>
          <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>Start your 7-day free trial. No credit card required.</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>First Name *</label><input type="text" value={form.fname} onChange={e=>set("fname",e.target.value)} placeholder="Mohamed" required className="input-field"/></div>
              <div><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Last Name *</label><input type="text" value={form.lname} onChange={e=>set("lname",e.target.value)} placeholder="Hassan" required className="input-field"/></div>
            </div>
            <div className="mb-4"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Email Address *</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="doctor@example.com" required className="input-field"/></div>
            <div className="mb-4"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Password *</label><input type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="At least 8 characters" required className="input-field"/>
              <div className="h-[3px] rounded-full mt-2 overflow-hidden" style={{ background:"var(--border)" }}><div className="h-full rounded-full transition-all" style={{ width:`${Math.min(form.password.length/12*100,100)}%`, background:form.password.length<6?"#EF4444":form.password.length<10?"#F59E0B":"#10B981" }}/></div>
            </div>
            <div className="mb-5"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Confirm Password *</label><input type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="Repeat password" required className="input-field" style={{ borderColor:form.confirm&&form.confirm!==form.password?"var(--red)":form.confirm&&form.confirm===form.password?"var(--green)":"var(--border)" }}/></div>
            <label className="flex items-start gap-2 mb-5 text-sm cursor-pointer" style={{ color:"var(--text-muted)" }}>
              <input type="checkbox" checked={form.terms} onChange={e=>set("terms",e.target.checked)} className="mt-0.5 flex-shrink-0" style={{ accentColor:"var(--blue)", width:"15px", height:"15px" }}/>
              I agree to the <Link href="#" className="font-bold" style={{ color:"var(--blue)" }}>Terms of Service</Link> and <Link href="#" className="font-bold" style={{ color:"var(--blue)" }}>Privacy Policy</Link>
            </label>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm text-white mb-4 transition-all" style={{ background:"var(--blue)", border:"none", cursor:loading?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 5px 16px rgba(0,87,255,.35)", opacity:loading?.7:1 }}>
              {loading?"Creating your account...":"🚀 Create Account & Start Free Trial"}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color:"var(--text-muted)" }}>Already have an account? <Link href="/login" className="font-bold" style={{ color:"var(--blue)" }}>Log in →</Link></p>
        </div>
      </div>
    </div>
  );
}
