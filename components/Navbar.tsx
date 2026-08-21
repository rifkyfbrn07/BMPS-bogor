"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang BMPS", href: "/profile" },
  { label: "Program", href: "/program" },
  { label: "Berita", href: "/berita" },
  { label: "Pelatihan", href: "/pelatihan" },
  { label: "Bantuan Pendidikan", href: "/program" },
  { label: "Info Beasiswa", href: "/berita" },
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

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || (href !== "/profile" && pathname.startsWith(`${href}/`));

  async function logout() {
    setProfileOpen(false);
    setMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-white transition-[border-color,box-shadow] duration-300 ease-in-out",
      scrolled
        ? "border-slate-200 shadow-[0_4px_14px_rgba(15,35,80,0.06)]"
        : "border-slate-200/80 shadow-[0_2px_10px_rgba(15,35,80,0.04)]"
    )}>
      <div className="mx-auto flex min-h-[80px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:min-h-[82px] sm:px-6 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="BMPS Bogor, Beranda">
          <span className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
            <Image src="/logo.png" alt="Logo BMPS" width={44} height={44} className="h-full w-full object-contain" priority unoptimized />
          </span>
          <span className="leading-none text-[#172033]">
            <span className="font-display block text-[0.82rem] font-bold tracking-[0.12em] sm:text-[0.88rem]">BMPS</span>
            <span className="mt-1 block text-[0.54rem] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[0.6rem]">Bogor</span>
          </span>
        </Link>

        <div className="ml-auto hidden min-w-0 items-center gap-5 lg:flex xl:gap-7">
          <nav className="flex items-center gap-4 xl:gap-6" aria-label="Navigasi utama">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={cn("font-display whitespace-nowrap py-2 text-[13px] font-semibold tracking-[-0.01em] text-[#172033] transition-colors duration-200 hover:text-[var(--brand-primary)] xl:text-[13.5px]", isActive(link.href) && "text-[#172033]")}>{link.label}</Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link href="/daftar-sekolah" className="font-display inline-flex h-[48px] items-center justify-center rounded-xl bg-[#172033] px-4 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#0f172a]">Daftarkan Sekolah & Yayasan</Link>
            {authenticated ? <ProfileControl ref={profileRef} open={profileOpen} onToggle={() => setProfileOpen((current) => !current)} onLogout={logout} userName={userName} userEmail={userEmail} /> : <LoginLink />}
          </div>
        </div>

        <button type="button" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)} className="flex h-9 w-9 items-center justify-center rounded-md text-[#172033] ring-1 ring-slate-200 transition hover:bg-slate-50 lg:hidden">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-slate-100 bg-white transition-all duration-200 lg:hidden", menuOpen ? "max-h-[40rem] opacity-100" : "max-h-0 overflow-hidden opacity-0")}>
        <nav className="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Navigasi mobile">
          {navLinks.map((link) => <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className={cn("font-ui border-l-2 px-3 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-colors", isActive(link.href) ? "border-[var(--brand-primary)] text-[var(--brand-primary)]" : "border-transparent text-[#172033] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]")}>{link.label}</Link>)}
          <div className="mt-3 grid gap-2 border-t border-slate-100 pt-4">
            <Link href="/daftar-sekolah" onClick={() => setMenuOpen(false)} className="font-display rounded-xl bg-[#172033] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0f172a]">Daftarkan Sekolah & Yayasan</Link>
            {authenticated ? <ProfileControl ref={profileRef} open={profileOpen} onToggle={() => setProfileOpen((current) => !current)} onLogout={logout} userName={userName} userEmail={userEmail} mobile /> : <LoginLink mobile onClick={() => setMenuOpen(false)} />}
          </div>
        </nav>
      </div>
    </header>
  );
}

function LoginLink({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  return <Link href="/login" onClick={onClick} className={cn("font-display inline-flex items-center justify-center rounded-xl bg-[#172033] font-semibold text-white transition-colors hover:bg-[#0f172a]", mobile ? "px-4 py-3 text-sm" : "h-[48px] px-4 text-[12px]")}>Login</Link>;
}

type ProfileControlProps = { open: boolean; onToggle: () => void; onLogout: () => void; userName?: string; userEmail?: string; mobile?: boolean };

const ProfileControl = forwardRef<HTMLDivElement, ProfileControlProps>(({ open, onToggle, onLogout, userName, userEmail, mobile }, ref) => (
  <div ref={ref} className={cn("relative", mobile && "w-full")}>
    <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={onToggle} className={cn("font-display inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white font-semibold text-[#172033] transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]", mobile ? "w-full justify-center px-4 py-3 text-sm" : "h-[48px] px-3 text-[12px]")}> 
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