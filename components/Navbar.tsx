"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavTier = "primary" | "secondary";

type NavItem = {
  label: string;
  href: string;
  tier: NavTier;
};

// PRIMARY: halaman utama. SECONDARY: jalur program spesifik (bobot visual lebih ringan).
const navLinks: NavItem[] = [
  { label: "Beranda", href: "/", tier: "primary" },
  { label: "Tentang BMPS", href: "/profile", tier: "primary" },
  { label: "Program", href: "/program", tier: "primary" },
  { label: "Berita", href: "/berita", tier: "primary" },
  { label: "Pelatihan", href: "/pelatihan", tier: "secondary" },
  { label: "Bantuan Pendidikan", href: "/bantuan-pendidikan", tier: "secondary" },
  { label: "Info Beasiswa", href: "/info-beasiswa", tier: "secondary" },
];


type NavbarProps = {
  variant?: "hero" | "solid";
  authenticated?: boolean;
  userName?: string;
  userEmail?: string;
};

export default function Navbar({ variant = "solid", authenticated = false, userName, userEmail }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      const nextScrolled = window.scrollY > 20;
      setScrolled((current) => current === nextScrolled ? current : nextScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  // Active state dihitung dari pathname (bukan onClick), sehingga tetap benar
  // untuk direct URL, reload, back/forward, maupun navigasi internal.
  // Subroute (mis. /berita/[slug], /program/[slug]) tetap membuat parent aktif.
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const activeStates = navLinks.map((link) => isActive(link.href));

  // Di atas hero image navbar memakai varian glass gelap; setelah digulir,
  // permukaannya berubah menjadi glass terang agar tetap terbaca.
  const dark = variant === "hero" && !scrolled;

  async function logout() {
    setProfileOpen(false);
    setMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  // Shell fixed: mengikuti viewport (bukan sticky) — tidak ikut scroll, mengambang
  // di atas konten, dan tidak menangkap klik. Pointer-events hanya aktif pada
  // bar & drawer glass, bukan pada shell/dekorasi.
  return (
    <header className="navbar-shell">
      <div
        className={cn(
          "glass-navbar pointer-events-auto flex min-h-[58px] w-full items-center justify-between gap-3 rounded-[22px] px-3.5 py-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out sm:min-h-[64px] sm:px-5 sm:py-2.5",
          dark ? "glass-navbar-dark" : cn("glass-navbar", scrolled && "glass-navbar-scrolled")
        )}
      >
        {/* 1. Logo (flex-shrink: 0) */}
        <div className="navbar-logo flex shrink-0 items-center">
          <Link href="/" className="flex items-center gap-2.5" aria-label="BMPS Bogor, Beranda">
            <span className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
              <Image src="/logo.png" alt="Logo BMPS" width={40} height={40} className="h-full w-full object-contain" priority unoptimized />
            </span>
            <span className={cn("leading-none transition-colors duration-300", dark ? "text-white" : "text-[#172033]")}>
              <span className="font-display block text-[0.82rem] font-bold tracking-[0.12em] sm:text-[0.88rem]">BMPS</span>
              <span className={cn("mt-1 block text-[0.54rem] font-semibold uppercase tracking-[0.22em] sm:text-[0.6rem]", dark ? "text-white/70" : "text-slate-500")}>Bogor</span>
            </span>
          </Link>
        </div>

        {/* 2. Navigation Links (flex: 1, centered, inside Liquid Glass) */}
        <nav className="navbar-links hidden flex-1 items-center justify-center min-w-0 px-2 xl:flex" aria-label="Navigasi utama">
          <div className="flex items-center gap-0.5 2xl:gap-1">
            {navLinks.map((link, index) => {
              const active = activeStates[index];
              const showTierDivider = index > 0 && link.tier === "secondary" && navLinks[index - 1].tier === "primary";
              return (
                <span key={link.label} className="flex items-center">
                  {showTierDivider && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mx-1.5 h-3.5 w-px transition-colors duration-300 2xl:mx-2.5",
                        dark ? "bg-white/20" : "bg-slate-300/80"
                      )}
                    />
                  )}
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "nav-pill relative whitespace-nowrap transition-all duration-250 ease-out hover:scale-[1.02]",
                      "px-2.5 py-1.5 text-[12px] 2xl:px-3.5 2xl:text-[13px]",
                      link.tier === "primary"
                        ? "font-semibold tracking-[-0.01em]"
                        : "font-medium tracking-[0.01em]",
                      active
                        ? dark
                          ? "nav-pill-active-dark"
                          : "nav-pill-active"
                        : dark
                          ? "text-white/80 hover:bg-white/12 hover:text-white"
                          : "text-slate-600 hover:bg-slate-900/5 hover:text-[#172033]"
                    )}
                  >
                    {link.label}
                  </Link>
                </span>
              );
            })}
          </div>
        </nav>

        {/* 3. Actions: CTA & Login (flex-shrink: 0, inside Liquid Glass) */}
        <div className="navbar-actions hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
          <Link
            href="/daftar-sekolah"
            className={cn(
              "btn-editorial font-display inline-flex h-[38px] items-center justify-center whitespace-nowrap rounded-xl px-3.5 text-[11.5px] font-semibold shadow-sm transition-all duration-250 ease-out hover:-translate-y-0.5 2xl:h-[40px] 2xl:px-4 2xl:text-[12px]",
              dark
                ? "bg-white text-[#172033] shadow-[0_10px_24px_-10px_rgba(2,8,23,0.55)] hover:bg-slate-100 hover:shadow-[0_14px_28px_-10px_rgba(2,8,23,0.65)]"
                : "bg-[#172033] text-white shadow-[0_10px_22px_-10px_rgba(11,31,77,0.5)] hover:bg-[#0f172a] hover:shadow-[0_14px_26px_-10px_rgba(11,31,77,0.6)]"
            )}
          >
            Masukan Data Sekolah/Yayasan ke BMPS
          </Link>
          {authenticated ? (
            <ProfileControl
              ref={profileRef}
              open={profileOpen}
              onToggle={() => setProfileOpen((current) => !current)}
              onLogout={logout}
              userName={userName}
              userEmail={userEmail}
            />
          ) : (
            <LoginLink />
          )}
        </div>

        {/* 4. Mobile Hamburger Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((current) => !current)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl ring-1 transition xl:hidden",
            dark ? "text-white ring-white/30 hover:bg-white/10" : "text-[#172033] ring-slate-200 hover:bg-white/70"
          )}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Drawer mobile/tablet (<1280px) — panel glass di bawah bar. */}
      <div
        id="mobile-menu"
        className={cn(
          "glass-navbar pointer-events-auto overflow-hidden rounded-[22px] p-2.5 transition-[max-height,opacity,margin-top,visibility] duration-300 ease-out xl:hidden",
          menuOpen ? "visible mt-2 max-h-[36rem] opacity-100" : "invisible max-h-0 opacity-0"
        )}
      >
        <nav aria-label="Navigasi seluler">
          <div className="grid gap-0.5">
            {navLinks.map((link, index) => {
              const active = activeStates[index];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "nav-pill flex items-center justify-between px-3.5 py-2.5",
                    link.tier === "primary" ? "text-sm font-semibold tracking-[-0.01em]" : "text-[13px] font-medium",
                    active ? "nav-pill-active" : "text-slate-600 hover:bg-white/70 hover:text-[#172033]"
                  )}
                >
                  {link.label}
                  {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="mt-2 grid gap-2 border-t border-slate-200/70 pt-3">
          <Link href="/daftar-sekolah" onClick={() => setMenuOpen(false)} className="font-display rounded-xl bg-[#172033] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0f172a]">Masukan Data Sekolah/Yayasan ke BMPS</Link>
          {authenticated ? <ProfileControl ref={profileRef} open={profileOpen} onToggle={() => setProfileOpen((current) => !current)} onLogout={logout} userName={userName} userEmail={userEmail} mobile /> : <LoginLink mobile onClick={() => setMenuOpen(false)} />}
        </div>
      </div>
    </header>
  );
}

function LoginLink({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  return (
    <Link
      href="/login"
      onClick={onClick}
      className={cn(
        "btn-editorial font-display inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[#172033] font-semibold text-white transition-colors hover:bg-[#0f172a]",
        mobile ? "px-4 py-3 text-sm" : "h-[38px] px-3.5 text-[11.5px] 2xl:h-[40px] 2xl:px-4 2xl:text-[12px]"
      )}
    >
      Login
    </Link>
  );
}

type ProfileControlProps = { open: boolean; onToggle: () => void; onLogout: () => void; userName?: string; userEmail?: string; mobile?: boolean };

const ProfileControl = forwardRef<HTMLDivElement, ProfileControlProps>(({ open, onToggle, onLogout, userName, userEmail, mobile }, ref) => (
  <div ref={ref} className={cn("relative", mobile && "w-full")}>
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        "font-display inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white font-semibold text-[#172033] transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
        mobile ? "w-full justify-center px-4 py-3 text-sm" : "h-[38px] px-3 text-[11.5px] 2xl:h-[40px] 2xl:text-[12px]"
      )}
    > 
      <UserRound className="h-4 w-4" aria-hidden="true" /><span className="max-w-[9rem] truncate">{userName ?? "Profile"}</span><ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
    </button>
    {open && <div role="menu" className={cn("absolute right-0 z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-[0_12px_28px_rgba(15,35,80,0.12)]", mobile && "left-0 right-0 w-full")}> 
      <div className="border-b border-slate-100 px-3 py-2.5"><p className="truncate text-sm font-semibold text-[#172033]">{userName ?? "User"}</p><p className="truncate text-xs text-slate-500">{userEmail ?? "Akun BMPS Bogor"}</p></div>
      <Link href="/dashboard" role="menuitem" onClick={onToggle} className="font-ui mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary)]"><LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard</Link>
      <Link href="/profile/akun" role="menuitem" onClick={onToggle} className="font-ui flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary)]"><UserRound className="h-4 w-4" aria-hidden="true" /> Profil Saya</Link>
      <button type="button" role="menuitem" onClick={onLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-red-700 transition hover:bg-red-50"><LogOut className="h-4 w-4" aria-hidden="true" /> Keluar</button>
    </div>}
  </div>
));

ProfileControl.displayName = "ProfileControl";