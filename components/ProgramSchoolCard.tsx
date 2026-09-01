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
      className="group card-hover-editorial flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80 hover:ring-blue-200"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <Image
          src={school.image}
          alt={school.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          unoptimized
        />
        <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-500 group-hover:bg-slate-900/10" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-royal">
          {schoolLevelLabel(school.level)} &middot; {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
        </span>
        <h3 className="text-lg font-bold leading-snug text-navy-deep transition-colors duration-300 group-hover:text-blue-royal">{school.name}</h3>
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
        <span className="mt-auto inline-flex items-center gap-2 border-t border-slate-100 pt-3 text-sm font-semibold text-blue-royal transition group-hover:text-navy-deep">
          Info Selengkapnya
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

