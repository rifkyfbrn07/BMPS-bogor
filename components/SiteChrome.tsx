"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteChrome({
  children,
  authenticated,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  authenticated: boolean;
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isHeroPage = pathname === "/" || /^\/(berita|pelatihan|program|sekolah)\/[^/]+$/.test(pathname);
  return (
    <>
      {!isAuthPage && <Navbar variant={isHeroPage ? "hero" : "solid"} authenticated={authenticated} userName={userName} userEmail={userEmail} />}
      <main className={isAuthPage ? "flex-1" : "flex-1"}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}