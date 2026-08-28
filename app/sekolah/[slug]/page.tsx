import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { getSchoolBySlug, schools } from "@/lib/data/schools";
import { prisma } from "@/lib/prisma";
import type { School } from "@/lib/types";

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let school: School | null = null;

  try {
    const dbSchool = await prisma.school.findUnique({
      where: { slug },
      include: { foundation: true },
    });

    if (dbSchool) {
      school = {
        slug: dbSchool.slug,
        name: dbSchool.name,
        type: dbSchool.foundation ? "yayasan" : "sekolah",
        level: dbSchool.level,
        address: dbSchool.address || "",
        image: dbSchool.logoUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
        accreditation: "A",
        studentCount: 150,
        description: dbSchool.description || "Sekolah mitra BMPS Bogor.",
      };
    }
  } catch (error) {
    console.error("Gagal memuat detail sekolah dari database:", error);
  }

  if (!school) {
    school = getSchoolBySlug(slug) ?? null;
  }

  if (!school) {
    notFound();
  }

  return (
    <div className="section-shell py-12 sm:py-16 lg:py-20">
      <Link
        href="/sekolah"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-royal transition hover:text-navy-deep"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Direktori
      </Link>

      <div className="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[3/1]">
          <Image src={school.image} alt={school.name} fill className="object-cover" priority />
        </div>
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-light px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-blue-royal">
              {school.level} • {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Akreditasi {school.accreditation}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
            {school.name}
          </h1>

          <div className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-royal" />
              {school.address}
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Users className="h-4 w-4 shrink-0 text-blue-royal" />
              {school.studentCount} siswa
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-navy-deep">Profil institusi</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{school.description}</p>
          </div>

          <div className="mt-10">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-royal"
            >
              Hubungi BMPS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
