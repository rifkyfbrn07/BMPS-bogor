import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import type { School } from "@/lib/types";
import { buildWhatsAppLink, schoolLevelLabel } from "@/lib/school-labels";

/** Kartu sekolah/yayasan pada direktori publik (hanya data APPROVED). */
export default function SchoolCard({ school }: { school: School }) {
  const waLink = buildWhatsAppLink(school.whatsapp || school.phone);

  return (
    <div className="group flex flex-col overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1B2CC1]/40 hover:shadow-md">
      <Link href={`/sekolah/${school.slug}`} className="relative h-48 w-full overflow-hidden bg-slate-100 block">
        <Image
          src={school.image}
          alt={school.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/10" />
        <span className="absolute right-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#0F1F4A] shadow-sm backdrop-blur">
          {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-md bg-[#EAF2FF] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#1B2CC1]">
            {schoolLevelLabel(school.level)}
          </span>
          {waLink && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <MessageCircle className="h-3 w-3 text-emerald-600" />
              WhatsApp
            </span>
          )}
        </div>
        <Link href={`/sekolah/${school.slug}`}>
          <h3 className="text-lg font-bold leading-snug text-[#0F1F4A] transition-colors duration-200 group-hover:text-[#1B2CC1]">
            {school.name}
          </h3>
        </Link>
        {school.npsn && (
          <p className="font-mono text-xs font-medium text-slate-400">NPSN: {school.npsn}</p>
        )}
        {school.address && (
          <p className="flex items-start gap-2 text-xs leading-5 text-slate-600">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1B2CC1]" />
            <span className="min-w-0 line-clamp-2">{school.address}</span>
          </p>
        )}
        {school.description && (
          <p className="line-clamp-2 text-xs leading-5 text-slate-500">{school.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-[#E5E7EB] pt-4">
          <Link 
            href={`/sekolah/${school.slug}`} 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B2CC1] transition group-hover:text-[#0F1F4A]"
          >
            Lihat Detail
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              title="Hubungi via WhatsApp"
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

