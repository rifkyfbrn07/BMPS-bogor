import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { getProgramBySlug, programs } from "@/lib/data/programs";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import type { Program } from "@/lib/types";

export async function generateStaticParams() {
  try {
    const dbPrograms = await prisma.program.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true }
    });
    if (dbPrograms.length > 0) {
      return dbPrograms.map((program) => ({ slug: program.slug }));
    }
  } catch (err) {
    console.warn("Gagal membuat static params program dari DB, gunakan fallback:", err);
  }
  return programs.map((program) => ({ slug: program.slug }));
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let program: Program | null = null;

  try {
    const dbProgram = await prisma.program.findUnique({
      where: { slug }
    });
    if (dbProgram) {
      program = {
        slug: dbProgram.slug,
        title: dbProgram.title,
        category: dbProgram.category,
        description: dbProgram.description,
        image: dbProgram.thumbnailUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        status: dbProgram.status === "ARCHIVED" ? "closed" : "active",
        startDate: dbProgram.createdAt.toISOString().split("T")[0],
        content: dbProgram.description, // in fallback content is description
      };
    }
  } catch (dbErr) {
    console.error("Gagal mengambil program dari DB:", dbErr);
  }

  // Fallback to static
  if (!program) {
    program = getProgramBySlug(slug) || null;
  }

  if (!program) {
    notFound();
  }

  // Filter related programs
  let relatedPrograms: Array<{ slug: string; title: string; category: string; image: string }> = [];
  try {
    const dbRelated = await prisma.program.findMany({
      where: {
        status: "PUBLISHED",
        slug: { not: slug },
        category: program.category
      },
      take: 2,
      orderBy: { createdAt: "desc" }
    });
    if (dbRelated.length > 0) {
      relatedPrograms = dbRelated.map(dbItem => ({
        slug: dbItem.slug,
        title: dbItem.title,
        category: dbItem.category,
        image: dbItem.thumbnailUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      }));
    }
  } catch (err) {
    console.warn("Gagal memuat program terkait dari DB:", err);
  }

  if (relatedPrograms.length === 0) {
    relatedPrograms = programs.filter(
      (item) => item.slug !== program.slug && item.category === program.category
    ).slice(0, 2);
  }

  return (
    <div className="section-shell w-full max-w-full overflow-x-clip py-8 sm:py-16 lg:py-20">
      <Link
        href="/program"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-royal transition hover:text-navy-deep"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Program
      </Link>

      <div className="mt-5 w-full max-w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm sm:mt-6 sm:rounded-[32px]">
        <div className="relative h-60 w-full max-w-full sm:h-auto sm:aspect-[16/9] lg:aspect-[3/1]">
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <StatusBadge status={program.status} />
            <span className="inline-flex max-w-full items-center gap-2 break-words rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              <Tag className="h-3.5 w-3.5 text-blue-royal" />
              {program.category}
            </span>
          </div>

          <h1 className="mt-5 max-w-full break-words text-3xl font-bold leading-tight tracking-tight text-navy-deep sm:text-4xl">
            {program.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-royal" />
              {formatDate(program.startDate)}
            </span>
          </div>

          <p className="mt-6 max-w-3xl break-words text-base leading-7 text-slate-600 [overflow-wrap:anywhere] sm:leading-8">
            {program.description}
          </p>

          <div className="mt-8 min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-navy-deep">Detail Program</h2>
            <p className="mt-4 whitespace-pre-line break-words text-base leading-7 text-slate-600 [overflow-wrap:anywhere] sm:leading-8">
              {program.content}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
            <Link
              href="/kontak"
              className="inline-flex w-full items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-royal sm:w-auto"
            >
              Hubungi BMPS
            </Link>
            <Link
              href="/program"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-navy-deep transition hover:bg-blue-light sm:w-auto"
            >
              Lihat Program Lainnya
            </Link>
          </div>
        </div>
      </div>

      {relatedPrograms.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-bold text-navy-deep">Program terkait</h2>
          <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {relatedPrograms.map((item) => (
              <Link
                key={item.slug}
                href={`/program/${item.slug}`}
                className="soft-panel w-full min-w-0 max-w-full overflow-hidden p-0"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-royal">
                    {item.category}
                  </p>
                  <h3 className="mt-2 break-words text-xl font-bold text-navy-deep">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
