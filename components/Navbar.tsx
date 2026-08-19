"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Program", href: "/program" },
  { label: "Berita", href: "/berita" },
  { label: "Pelatihan", href: "/pelatihan" },
  { label: "Bantuan Pendidikan", href: "/program" },
  { label: "Info Beasiswa", href: "/berita" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-[1280px]">
        <div className="navbar-shell flex items-center justify-between gap-3 rounded-full bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(15,35,80,0.08)] ring-1 ring-[rgba(31,90,168,0.08)] sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 pr-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f5aa8] text-sm font-bold text-white shadow-sm ring-1 ring-[#1f5aa8]/10">
              B
            </span>
            <span className="leading-none text-[#111827]">
              <span className="block text-[0.82rem] font-semibold tracking-[0.08em]">BMPS</span>
              <span className="mt-0.5 block text-[0.52rem] uppercase tracking-[0.12em] text-slate-500">
                Bogor
              </span>
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <nav className="flex items-center gap-6 xl:gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-full px-1.5 py-2 text-[13px] font-medium transition-colors duration-200",
                    isActive(link.href)
                      ? "text-[#1f5aa8]"
                      : "text-[#111827] hover:text-[#1f5aa8]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link
              href="/daftar-sekolah"
              className="inline-flex items-center justify-center rounded-full bg-[#1f5aa8] px-[18px] py-[11px] text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(31,90,168,0.18)] transition-colors hover:bg-[#174d9d]"
            >
              Daftarkan Sekolah & Yayasan
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[#1f5aa8] px-[16px] py-[10px] text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(31,90,168,0.15)] transition-colors hover:bg-[#174d9d]"
            >
              Login
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] ring-1 ring-slate-200 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "mt-3 overflow-hidden rounded-[28px] bg-white ring-1 ring-[rgba(31,90,168,0.08)] shadow-[0_12px_26px_rgba(15,35,80,0.08)] transition-all duration-300 lg:hidden",
            open ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col gap-1 p-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-[#edf5ff] text-[#1f5aa8]"
                    : "text-[#111827] hover:bg-slate-50 hover:text-[#1f5aa8]"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 grid gap-2">
              <Link
                href="/daftar-sekolah"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#1f5aa8] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_18px_rgba(31,90,168,0.18)] transition-colors hover:bg-[#174d9d]"
              >
                Daftarkan Sekolah & Yayasan
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#1f5aa8] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_18px_rgba(31,90,168,0.15)] transition-colors hover:bg-[#174d9d]"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
