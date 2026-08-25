import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "BMPS Bogor",
  description: "Website resmi BMPS Bogor",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.id }, select: { name: true, email: true } })
    : null;

  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-800">
        <div className="flex min-h-screen flex-col">
          <SiteChrome authenticated={Boolean(session && user)} userName={user?.name} userEmail={user?.email}>{children}</SiteChrome>
        </div>
      </body>
    </html>
  );
}
