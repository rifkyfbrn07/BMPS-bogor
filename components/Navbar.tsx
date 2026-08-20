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
  const isHero = variant === "hero";
  const isTransparent = isHero && !scrolled;

  useEffect(() => {
    if (!isHero) return;

    const handleScroll = () => {
      const nextScrolled = window.scrollY > 12;
      setScrolled((current) => current === nextScrolled ? current : nextScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHero]);

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
    <header className={cn("z-50 w-full transition-[background-color,box-shadow] duration-300", isTransparent ? "absolute top-0" : isHero ? "fixed inset-x-0 top-0 border-b border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,35,80,0.04)]" : "sticky top-0 border-b border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,35,80,0.04)]")}>
      <div className="mx-auto flex min-h-[78px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BMPS Bogor, Beranda">
          <span className="flex h-11 w-11 items-center justify-center">
            <Image src="/logo.png" alt="Logo BMPS" width={44} height={44} className="h-full w-full object-contain" priority unoptimized />
          </span>
          <span className={cn("leading-none transition-colors duration-300", isTransparent ? "text-white" : "text-navy-deep")}>
            <span className="block text-[0.9rem] font-bold tracking-[0.12em]">BMPS</span>
            <span className={cn("mt-1 block text-[0.58rem] font-semibold uppercase tracking-[0.24em]", isTransparent ? "text-white/75" : "text-slate-500")}>Bogor</span>
          </span>
        </Link>

        <div className="ml-auto hidden min-w-0 items-center gap-7 lg:flex xl:gap-9">
          <nav className="flex items-center gap-5 xl:gap-7" aria-label="Navigasi utama">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={cn("whitespace-nowrap py-3 text-[13px] font-medium transition-colors duration-200", isActive(link.href) ? (isTransparent ? "text-white" : "text-blue-royal") : (isTransparent ? "text-white/85 hover:text-white" : "text-slate-700 hover:text-blue-royal"))}>{link.label}</Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link href="/daftar-sekolah" className="inline-flex items-center justify-center rounded-md bg-blue-royal px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-navy">Daftarkan Sekolah & Yayasan</Link>
            {authenticated ? <ProfileControl ref={profileRef} open={profileOpen} onToggle={() => setProfileOpen((current) => !current)} onLogout={logout} userName={userName} userEmail={userEmail} transparent={isTransparent} /> : <LoginLink transparent={isTransparent} />}
          </div>
        </div>

        <button type="button" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)} className="flex h-10 w-10 items-center justify-center rounded-md text-navy-deep ring-1 ring-slate-200 transition hover:bg-slate-50 lg:hidden">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-slate-100 bg-white transition-all duration-200 lg:hidden", menuOpen ? "max-h-[40rem] opacity-100" : "max-h-0 overflow-hidden opacity-0")}>
        <nav className="mx-auto flex max-w-[1440px] flex-col gap-1 px-5 py-4 sm:px-8" aria-label="Navigasi mobile">
          {navLinks.map((link) => <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className={cn("border-l-2 px-3 py-2.5 text-sm font-medium transition-colors", isActive(link.href) ? "border-blue-royal text-blue-royal" : "border-transparent text-slate-700 hover:border-blue-royal hover:text-blue-royal")}>{link.label}</Link>)}
          <div className="mt-3 grid gap-2 border-t border-slate-100 pt-4">
            <Link href="/daftar-sekolah" onClick={() => setMenuOpen(false)} className="rounded-md bg-blue-royal px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-navy">Daftarkan Sekolah & Yayasan</Link>
            {authenticated ? <ProfileControl ref={profileRef} open={profileOpen} onToggle={() => setProfileOpen((current) => !current)} onLogout={logout} userName={userName} userEmail={userEmail} mobile /> : <LoginLink mobile onClick={() => setMenuOpen(false)} />}
          </div>
        </nav>
      </div>
    </header>
  );
}

function LoginLink({ mobile = false, onClick, transparent = false }: { mobile?: boolean; onClick?: () => void; transparent?: boolean }) {
  return <Link href="/login" onClick={onClick} className={cn("inline-flex items-center justify-center rounded-md font-semibold transition-colors", mobile ? "px-4 py-3 text-sm" : "px-4 py-2.5 text-[12px]", transparent ? "bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/25" : "bg-blue-royal text-white hover:bg-navy")}>Login</Link>;
}

type ProfileControlProps = { open: boolean; onToggle: () => void; onLogout: () => void; userName?: string; userEmail?: string; mobile?: boolean; transparent?: boolean };

const ProfileControl = forwardRef<HTMLDivElement, ProfileControlProps>(({ open, onToggle, onLogout, userName, userEmail, mobile, transparent = false }, ref) => (
  <div ref={ref} className={cn("relative", mobile && "w-full")}>
    <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={onToggle} className={cn("inline-flex items-center gap-2 rounded-md font-semibold transition-colors", mobile ? "w-full justify-center px-4 py-3 text-sm" : "px-3 py-2.5 text-[12px]", transparent ? "bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/25" : "border border-slate-200 bg-white text-navy-deep hover:border-blue-royal hover:text-blue-royal")}>
      <UserRound className="h-4 w-4" aria-hidden="true" /><span className="max-w-[9rem] truncate">{userName ?? "Profile"}</span><ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
    </button>
    {open && <div role="menu" className={cn("absolute right-0 z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-[0_12px_28px_rgba(15,35,80,0.12)]", mobile && "left-0 right-0 w-full")}>
      <div className="border-b border-slate-100 px-3 py-2.5"><p className="truncate text-sm font-semibold text-navy-deep">{userName ?? "User"}</p><p className="truncate text-xs text-slate-500">{userEmail ?? "Akun BMPS Bogor"}</p></div>
      <Link href="/dashboard" role="menuitem" onClick={onToggle} className="mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition hover:bg-blue-light hover:text-blue-royal"><LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard</Link>
      <Link href="/profile/akun" role="menuitem" onClick={onToggle} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition hover:bg-blue-light hover:text-blue-royal"><UserRound className="h-4 w-4" aria-hidden="true" /> Profil Saya</Link>
      <button type="button" role="menuitem" onClick={onLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-red-700 transition hover:bg-red-50"><LogOut className="h-4 w-4" aria-hidden="true" /> Keluar</button>
    </div>}
  </div>
));

ProfileControl.displayName = "ProfileControl";