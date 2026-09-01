import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import type { School } from "@/lib/types";
import { buildWhatsAppLink, schoolLevelLabel } from "@/lib/school-labels";

/** Kartu sekolah/yayasan pada direktori publik (hanya data APPROVED). */
export default function SchoolCard({ school }: { school: School }) {
  const waLink = buildWhatsAppLink(school.whatsapp || school.phone);

  return (
    <div className="group card-hover-editorial flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80 hover:ring-blue-200">
      <Link href={`/sekolah/${school.slug}`} className="relative h-44 w-full overflow-hidden bg-slate-100 block">
        <Image
          src={school.image}
          alt={school.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-500 group-hover:bg-slate-900/10" />
        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-deep shadow-sm backdrop-blur">
          {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-royal">
            {schoolLevelLabel(school.level)}
          </span>
          {waLink && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <MessageCircle className="h-3 w-3 text-emerald-600" />
              WhatsApp Ada
            </span>
          )}
        </div>
        <Link href={`/sekolah/${school.slug}`}>
          <h3 className="text-lg font-bold leading-snug text-navy-deep transition-colors duration-300 group-hover:text-blue-royal">
            {school.name}
          </h3>
        </Link>
        {school.npsn && (
          <p className="text-xs font-semibold tracking-wide text-slate-500">NPSN {school.npsn}</p>
        )}
        {school.address && (
          <p className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-royal" />
            <span className="min-w-0 break-words">{school.address}</span>
          </p>
        )}
        {school.description && (
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">{school.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <Link href={`/sekolah/${school.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-royal transition group-hover:text-navy-deep">
            Lihat Profil
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              title="Chat via WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              Chat WA
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

