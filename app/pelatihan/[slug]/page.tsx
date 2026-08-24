import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { getTrainingBySlug, trainings } from "@/lib/data/trainings";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import type { Training } from "@/lib/types";

export async function generateStaticParams() {
  try {
    const dbTrainings = await prisma.training.findMany({
      where: { status: "PUBLISHED" },
      select: { title: true }
    });
    if (dbTrainings.length > 0) {
      return dbTrainings.map((t) => ({
        slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      }));
    }
  } catch (err) {
    console.warn("Gagal membuat static params pelatihan dari DB, gunakan fallback:", err);
  }
  return trainings.map((training) => ({ slug: training.slug }));
}

export default async function TrainingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let training: Training | null = null;

  try {
    const dbTrainings = await prisma.training.findMany();
    const dbMatch = dbTrainings.find(
      (t) => t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
    );
    if (dbMatch) {
      training = {
        slug,
        title: dbMatch.title,
        image: dbMatch.thumbnailUrl || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
        date: dbMatch.startDate.toISOString().split("T")[0],
        location: dbMatch.location,
        quota: dbMatch.quota,
        status: dbMatch.status === "ARCHIVED" ? "closed" : "active",
        description: dbMatch.description,
        content: dbMatch.description,
      };
    }
  } catch (dbErr) {
    console.error("Gagal mengambil pelatihan dari DB:", dbErr);
  }

  // Fallback to static
  if (!training) {
    training = getTrainingBySlug(slug) || null;
  }

  if (!training) {
    notFound();
  }

  return (
    <div className="section-shell py-12 sm:py-16 lg:py-20">
      <Link
        href="/pelatihan"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-royal transition hover:text-navy-deep"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Pelatihan
      </Link>

      <div className="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[3/1]">
          <Image src={training.image} alt={training.title} fill className="object-cover" priority />
        </div>
        <div className="p-6 sm:p-8 lg:p-10">
          <StatusBadge status={training.status} />

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
            {training.title}
          </h1>

          <div className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <CalendarDays className="h-4 w-4 text-blue-royal" />
              {formatDate(training.date)}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <MapPin className="h-4 w-4 text-blue-royal" />
              {training.location}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <Users className="h-4 w-4 text-blue-royal" />
              Kuota {training.quota}
            </div>
          </div>

          <p className="mt-6 text-base leading-8 text-slate-600">{training.description}</p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-navy-deep">Detail Kegiatan</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
              {training.content}
            </p>
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
