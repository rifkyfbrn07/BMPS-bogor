import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { schoolLevelLabel } from "@/lib/school-labels";

type ProgramSchool = {
  slug: string;
  name: string;
  npsn?: string;
  type: string;
  level: string;
  city?: string;
  district?: string;
  description?: string;
  image: string;
};

/** Kartu sekolah/yayasan APPROVED yang mengikuti program (Info Beasiswa / Bantuan Pendidikan). */
export default function ProgramSchoolCard({ school }: { school: ProgramSchool }) {
  const locationLine = [school.district, school.city].filter(Boolean).join(", ");
  return (
    <Link
      href={`/sekolah/${school.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <Image
          src={school.image}
          alt={school.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-medium">
          {schoolLevelLabel(school.level)} &middot; {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
        </span>
        <h3 className="text-lg font-bold leading-snug text-navy-deep">{school.name}</h3>
        {school.npsn && <p className="text-xs font-semibold tracking-wide text-slate-500">NPSN {school.npsn}</p>}
        {locationLine && (
          <p className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-royal" aria-hidden="true" />
            <span className="min-w-0 break-words">{locationLine}</span>
          </p>
        )}
        {school.description && (
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">{school.description}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold text-blue-royal transition group-hover:text-navy-deep">
          Info Selengkapnya
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

