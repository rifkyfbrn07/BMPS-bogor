import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { formatDate, formatViews } from "@/lib/utils";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/berita/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,35,80,0.04)] transition duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_18px_38px_rgba(15,35,80,0.08)]"
    >
      <div className="relative aspect-[4/2.7] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-medium">
          <span>{item.category}</span>
          <span className="text-slate-400">{formatDate(item.date)}</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] text-navy-deep">
          {item.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-6 text-slate-600">
          {item.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1 text-sm">
          <span className="font-semibold text-blue-royal">Selengkapnya</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Eye className="h-3.5 w-3.5" />
            {formatViews(item.views)}
          </span>
        </div>
      </div>
    </Link>
  );
}
