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
  const isHeroPage = pathname === "/";
  const isProfileHero = pathname === "/profile";
  return (
    <>
      {!isAuthPage && <Navbar variant={isHeroPage || isProfileHero ? "hero" : "solid"} authenticated={authenticated} userName={userName} userEmail={userEmail} />}
      <main className={isAuthPage ? "flex-1" : "flex-1"}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}