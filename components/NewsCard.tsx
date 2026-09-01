import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { formatDate, formatViews } from "@/lib/utils";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/berita/${item.slug}`}
      className="group card-hover-editorial flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_10px_28px_rgba(15,35,80,0.04)] hover:border-blue-200"
    >
      <div className="relative aspect-[4/2.7] w-full overflow-hidden bg-slate-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-500 group-hover:bg-slate-900/10" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-royal">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5">{item.category}</span>
          <span className="text-slate-400">{formatDate(item.date)}</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] text-navy-deep transition-colors duration-300 group-hover:text-blue-royal">
          {item.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-6 text-slate-600">
          {item.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold text-blue-royal">
            Selengkapnya
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Eye className="h-3.5 w-3.5" />
            {formatViews(item.views)}
          </span>
        </div>
      </div>
    </Link>
  );
}
