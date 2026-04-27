"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface User { name: string; email: string; loggedIn: boolean; }

const NAV_LINKS = [
  { label: "Home",          href: "/" },
  { label: "QBank",         href: "/qbank" },
  { label: "AI Generator",  href: "/ai-generator" },
  { label: "Pricing",       href: "/pricing" },
  { label: "Dashboard",     href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser]           = useState<User | null>(null);
  const [dark, setDark]           = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast]         = useState<string | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem("emle_theme") || "light";
    if (theme === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
    try { const u = localStorage.getItem("emle_user"); if (u) setUser(JSON.parse(u)); } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("emle_theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("emle_user");
    setUser(null);
    setToast("Logged out successfully.");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <>
      <nav className="navbar">
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[17px] flex-shrink-0" style={{ color: "var(--text)" }}>
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center" style={{ background: "var(--blue)", boxShadow: "0 4px 12px rgba(0,87,255,.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
            </div>
            EMLE <span style={{ color: "var(--blue)" }}>QBank</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1 mx-5">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className="px-3 py-[7px] rounded-lg text-sm font-semibold transition-all"
                  style={{ color: active ? "var(--blue)" : "var(--text-mid)", background: active ? "var(--blue-glow)" : "transparent" }}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-110"
              style={{ border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer" }}>
              {dark ? "☀️" : "🌙"}
            </button>

            {user ? (
              <>
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold" style={{ background: "var(--blue-glow)", color: "var(--blue)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: "var(--blue)" }}>
                    {user.name[0]}
                  </div>
                  Dr. {user.name.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="btn btn-danger text-xs px-3 py-[7px]">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login"    className="hidden sm:block px-4 py-2 rounded-lg text-sm font-bold" style={{ color: "var(--blue)", background: "var(--blue-soft)" }}>Log In</Link>
                <Link href="/register" className="btn btn-primary text-sm px-4 py-2">Start Free Trial</Link>
              </>
            )}

            <button className="md:hidden text-2xl" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}
              onClick={() => setMobileOpen(o => !o)}>☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 py-3 px-4 flex flex-col gap-1 z-50"
            style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-semibold"
                style={{ color: pathname === href ? "var(--blue)" : "var(--text-mid)", background: pathname === href ? "var(--blue-soft)" : "transparent" }}>
                {label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              {user ? (
                <button onClick={handleLogout} className="flex-1 py-2 text-center rounded-lg text-sm font-bold" style={{ background: "rgba(239,68,68,.08)", color: "var(--red)" }}>Log Out</button>
              ) : (
                <>
                  <Link href="/login"    className="flex-1 py-2 text-center rounded-lg text-sm font-bold" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>Log In</Link>
                  <Link href="/register" className="flex-1 py-2 text-center rounded-lg text-sm font-bold text-white" style={{ background: "var(--blue)" }}>Start Free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ opacity: 1, transform: "translateY(0)" }}>{toast}</div>
      )}
    </>
  );
}
