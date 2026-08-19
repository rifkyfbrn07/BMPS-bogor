import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SchoolDashboardPage() {
  const session = await getSession(); if (!session || session.role !== "SCHOOL" || !session.schoolId) redirect("/login");
  const school = await prisma.school.findUnique({ where: { id: session.schoolId }, include: { foundation: true } }); if (!school) redirect("/login");
  return <div className="section-shell py-12 sm:py-16"><div className="soft-panel p-6 sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Dashboard sekolah</p><h1 className="mt-2 text-3xl font-bold text-navy-deep">{school.name}</h1><p className="mt-3 text-slate-600">NPSN: {school.npsn} · Jenjang: {school.level}</p><p className="mt-1 text-slate-600">Yayasan: {school.foundation?.name ?? "Belum ditautkan"}</p></div></div>;
}
