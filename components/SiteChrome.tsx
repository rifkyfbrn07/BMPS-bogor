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
  const isAdminPage = pathname.startsWith("/admin");
  const isRegistrationPage = pathname === "/daftar-sekolah";
  const isAuthPage = pathname === "/login" || pathname === "/daftar" || isAdminPage;
  const hideNavbar = isAuthPage || isRegistrationPage;
  const isHeroPage = pathname === "/";
  const isProfileHero = pathname === "/profile";
  return (
    <>
      {!hideNavbar && <Navbar variant="solid" authenticated={authenticated} userName={userName} userEmail={userEmail} />}
      {!hideNavbar && !isHeroPage && !isProfileHero && <div aria-hidden="true" className="h-[80px] lg:h-[92px]" />}
      <main key={pathname} className={`flex-1 ${isAdminPage ? "" : "page-fade-enter"}`}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}