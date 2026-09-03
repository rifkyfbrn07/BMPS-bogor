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
  { label: "Daftar Sekolah", href: "/sekolah", tier: "primary" },
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

export default function Navbar({ authenticated = false, userName, userEmail }: NavbarProps) {
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

  async function logout() {
    setProfileOpen(false);
    setMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  // Shell fixed: mengikuti viewport — tidak ikut scroll, mengambang di atas konten.
  return (
    <header className="navbar-shell">
      <div
        className={cn(
          "glass-navbar pointer-events-auto flex min-h-[58px] w-full items-center justify-between gap-3 rounded-2xl bg-white px-3.5 py-2 transition-[border-color,box-shadow] duration-200 ease-out sm:min-h-[64px] sm:px-5 sm:py-2.5",
          scrolled && "glass-navbar-scrolled"
        )}
      >
        {/* 1. Logo (flex-shrink: 0) */}
        <div className="navbar-logo flex shrink-0 items-center">
          <Link href="/" className="flex items-center gap-2.5" aria-label="BMPS Bogor, Beranda">
            <span className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
              <Image src="/logo.png" alt="Logo BMPS" width={40} height={40} className="h-full w-full object-contain" priority unoptimized />
            </span>
            <span className="leading-none text-[#111827]">
              <span className="font-display block text-[0.82rem] font-bold tracking-[0.12em] text-[#111827] sm:text-[0.88rem]">BMPS</span>
              <span className="mt-1 block text-[0.54rem] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[0.6rem]">Bogor</span>
            </span>
          </Link>
        </div>

        {/* 2. Navigation Links (flex: 1, centered) */}
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
                      className="mx-1.5 h-3.5 w-px bg-slate-200 transition-colors duration-300 2xl:mx-2.5"
                    />
                  )}
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "nav-pill relative whitespace-nowrap transition-all duration-200 ease-out hover:scale-[1.02]",
                      "px-2.5 py-1.5 text-[12px] 2xl:px-3.5 2xl:text-[13px]",
                      link.tier === "primary"
                        ? "font-semibold tracking-[-0.01em]"
                        : "font-medium tracking-[0.01em]",
                      active
                        ? "nav-pill-active font-semibold"
                        : "text-[#111827] hover:bg-slate-100 hover:text-[#111827]"
                    )}
                  >
                    {link.label}
                  </Link>
                </span>
              );
            })}
          </div>
        </nav>

        {/* 3. Actions: CTA & Login (flex-shrink: 0) */}
        <div className="navbar-actions hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
          <Link
            href="/daftar-sekolah"
            className="btn-editorial font-display inline-flex h-[38px] items-center justify-center whitespace-nowrap rounded-xl bg-[#111827] px-3.5 text-[11.5px] font-semibold text-white shadow-sm transition-all duration-250 ease-out hover:-translate-y-0.5 hover:bg-[#1f2937] 2xl:h-[40px] 2xl:px-4 2xl:text-[12px]"
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
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#111827] transition hover:bg-slate-100 xl:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Drawer mobile/tablet (<1280px) — Solid Opaque White Panel */}
      <div
        id="mobile-menu"
        className={cn(
          "mobile-menu-panel pointer-events-auto overflow-y-auto max-h-[calc(100dvh-5.5rem)] rounded-2xl p-4 bg-white transition-all duration-200 ease-out xl:hidden",
          menuOpen ? "visible mt-2.5 opacity-100 shadow-2xl" : "invisible max-h-0 opacity-0 pointer-events-none p-0 border-0"
        )}
      >
        <nav aria-label="Navigasi seluler">
          <div className="grid gap-1">
            {navLinks.map((link, index) => {
              const active = activeStates[index];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-colors",
                    link.tier === "primary" ? "text-sm font-semibold tracking-[-0.01em]" : "text-[13px] font-medium",
                    active ? "bg-[#EAF2FF] text-[#1B2CC1] font-semibold shadow-inner" : "text-[#111827] hover:bg-slate-100 hover:text-[#111827]"
                  )}
                >
                  {link.label}
                  {active && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#1B2CC1]" />}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="mt-3 grid gap-2.5 border-t border-slate-200 pt-3">
          <Link
            href="/daftar-sekolah"
            onClick={() => setMenuOpen(false)}
            className="font-display rounded-xl bg-[#111827] px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f2937]"
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
              mobile
            />
          ) : (
            <LoginLink mobile onClick={() => setMenuOpen(false)} />
          )}
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
        "btn-editorial font-display inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[#111827] font-semibold text-white transition-colors hover:bg-[#1f2937]",
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
        "font-display inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white font-semibold text-[#111827] transition-colors hover:border-[#1B2CC1] hover:text-[#1B2CC1]",
        mobile ? "w-full justify-center px-4 py-3 text-sm" : "h-[38px] px-3 text-[11.5px] 2xl:h-[40px] 2xl:text-[12px]"
      )}
    > 
      <UserRound className="h-4 w-4" aria-hidden="true" /><span className="max-w-[9rem] truncate">{userName ?? "Profile"}</span><ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
    </button>
    {open && <div role="menu" className={cn("absolute right-0 z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-[0_12px_28px_rgba(15,35,80,0.12)]", mobile && "left-0 right-0 w-full")}> 
      <div className="border-b border-slate-100 px-3 py-2.5"><p className="truncate text-sm font-semibold text-[#111827]">{userName ?? "User"}</p><p className="truncate text-xs text-slate-500">{userEmail ?? "Akun BMPS Bogor"}</p></div>
      <Link href="/dashboard" role="menuitem" onClick={onToggle} className="font-ui mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--brand-primary-soft)] hover:text-[#1B2CC1]"><LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard</Link>
      <Link href="/profile/akun" role="menuitem" onClick={onToggle} className="font-ui flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--brand-primary-soft)] hover:text-[#1B2CC1]"><UserRound className="h-4 w-4" aria-hidden="true" /> Profil Saya</Link>
      <button type="button" role="menuitem" onClick={onLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-red-700 transition hover:bg-red-50"><LogOut className="h-4 w-4" aria-hidden="true" /> Keluar</button>
    </div>}
  </div>
));

ProfileControl.displayName = "ProfileControl";