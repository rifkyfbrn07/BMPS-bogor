import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import type { Training } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

export default function TrainingCard({ training }: { training: Training }) {
  return (
    <Link
      href={`/pelatihan/${training.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg sm:flex-row"
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:w-64">
        <Image
          src={training.image}
          alt={training.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <StatusBadge status={training.status} />
        <h3 className="text-lg font-bold leading-snug text-navy-deep">
          {training.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {training.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-blue-royal" />
            {formatDate(training.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-blue-royal" />
            {training.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-blue-royal" />
            Kuota {training.quota}
          </span>
        </div>
      </div>
    </Link>
  );
}
