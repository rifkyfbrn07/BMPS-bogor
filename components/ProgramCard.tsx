import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Program } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={`/program/${program.slug}`}
      className="group card-hover-editorial flex h-full w-full min-w-0 max-w-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)] hover:border-blue-200 sm:p-5"
    >
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:gap-3">
        <span className="max-w-full break-words rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-royal">
          {program.category}
        </span>
        <span className="max-w-full shrink-0"><StatusBadge status={program.status} /></span>
      </div>

      <h3 className="max-w-full break-words text-2xl font-bold leading-[1.3] text-navy-deep transition-colors duration-300 group-hover:text-blue-royal sm:text-lg sm:leading-snug">
        {program.title}
      </h3>

      <p className="mt-3 max-w-full break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
        {program.description}
      </p>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <span className="inline-flex max-w-full items-center gap-2 break-words text-sm font-semibold text-blue-royal">
          Selengkapnya
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
