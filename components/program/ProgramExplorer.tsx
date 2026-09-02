"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion } from "@/lib/motion";


type ProgramItem = {
  slug: string;
  title: string;
  category: string;
  statusLabel: string;
  description: string;
};

const programItems: ProgramItem[] = [
  {
    slug: "penguatan-mutu-guru",
    title: "Penguatan Mutu Guru Swasta",
    category: "Pendidikan",
    statusLabel: "Sedang berjalan",
    description:
      "Meningkatkan kompetensi guru melalui pelatihan, pendampingan, dan pembelajaran yang adaptif.",
  },
  {
    slug: "digitalisasi-sekolah-swasta",
    title: "Digitalisasi Sekolah Swasta",
    category: "Teknologi",
    statusLabel: "Sedang berjalan",
    description:
      "Mendorong transformasi digital sekolah agar proses belajar dan administrasi menjadi lebih modern.",
  },
  {
    slug: "beasiswa-pendidikan-mandiri",
    title: "Beasiswa Pendidikan Mandiri",
    category: "Beasiswa",
    statusLabel: "Segera dibuka",
    description:
      "Memberikan akses pendidikan yang lebih luas bagi siswa berprestasi dan membutuhkan dukungan.",
  },
  {
    slug: "akreditasi-sekolah-terpadu",
    title: "Akreditasi Sekolah Terpadu",
    category: "Mutu",
    statusLabel: "Telah berlangsung",
    description:
      "Mendampingi sekolah dalam proses evaluasi mutu dan persiapan akreditasi yang berkelanjutan.",
  },
  {
    slug: "program-pengembangan-sekolah",
    title: "Program Pengembangan Sekolah",
    category: "Pengembangan",
    statusLabel: "Sedang berjalan",
    description:
      "Mendukung penguatan kepemimpinan, SDM, dan inovasi untuk kemajuan sekolah di Bogor.",
  },
];

const getProgramHref = (slug: string) =>
  slug === "program-pengembangan-sekolah" ? "/program" : `/program/${slug}`;

/**
 * Program Explorer — daftar program editorial bernomor.
 * Menggantikan carousel kartu seragam: mobile-first, hierarki jelas,
 * dan animasi GSAP ScrollTrigger yang halus (dengan respek terhadap
 * prefers-reduced-motion).
 */
export default function ProgramExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.from("[data-reveal='heading']", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-reveal='row']", {
        y: 26,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: "[data-reveal='list']",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from("[data-reveal='aside']", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          once: true,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="program-bmps-heading" className="bg-[#f4f7fc] py-16 sm:py-20 lg:py-28">
      <div className="section-shell w-full max-w-full overflow-x-clip">
        {/* ---- Heading section ---- */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div data-reveal="heading" className="min-w-0 max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-royal">
              <span aria-hidden="true" className="h-px w-8 bg-blue-royal/50" />
              
            </p>
            <h2
              id="program-bmps-heading"
              className="mt-5 text-[1.9rem] font-bold leading-[1.15] tracking-[-0.02em] text-navy-deep sm:text-4xl lg:text-[2.6rem]"
            >
              Bergerak bersama untuk pendidikan Bogor
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Lima program utama yang menopang sekolah swasta — dari guru, sekolah,
              hingga siswa. Pilih program untuk mengenalnya lebih dekat.
            </p>
          </div>

          <div data-reveal="aside" className="hidden lg:block">
            <div className="relative aspect-[4/3] w-[240px] overflow-hidden rounded-[20px] border border-white bg-slate-100 shadow-[0_24px_50px_-24px_rgba(15,35,80,0.35)]">
              <Image src="/8.png" alt="Kegiatan program BMPS Bogor" fill sizes="240px" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </div>
        </div>

        {/* ---- Indeks program editorial ---- */}
        <ol className="mt-10 border-t border-slate-200/90 sm:mt-14" data-reveal="list">
          {programItems.map((program, index) => {
            const open = activeIndex === index;
            const number = String(index + 1).padStart(2, "0");
            return (
              <li key={program.slug} data-reveal="row" className="border-b border-slate-200/90">
                <div className={cn("group rounded-xl transition-all duration-300", open ? "bg-white/90 shadow-sm" : "hover:bg-white/50")}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-expanded={open}
                    aria-controls={`program-panel-${program.slug}`}
                    className="grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-4 px-3 py-5 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-6 sm:px-5 sm:py-6"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "font-display text-lg font-bold tabular-nums transition-all duration-300 group-hover:translate-x-1 sm:text-xl",
                        open ? "text-blue-royal font-extrabold" : "text-slate-400 group-hover:text-blue-royal/70"
                      )}
                    >
                      {number}
                    </span>
                    <span
                      className={cn(
                        "font-display min-w-0 break-words text-[1.15rem] font-semibold leading-snug tracking-[-0.01em] transition-all duration-300 group-hover:translate-x-1.5 sm:text-[1.45rem]",
                        open ? "text-navy-deep" : "text-slate-700 group-hover:text-navy-deep"
                      )}
                    >
                      {program.title}
                    </span>
                    <span className="col-start-3 hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:flex">
                      <span className="rounded-full bg-slate-100/90 px-2.5 py-0.5 transition-colors group-hover:bg-blue-50 group-hover:text-blue-royal">
                        {program.category}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className={cn(
                          "h-4 w-4 transition-all duration-300",
                          open ? "translate-x-1 text-blue-royal opacity-100" : "-translate-x-0.5 text-slate-400 opacity-70 group-hover:translate-x-1 group-hover:text-blue-royal group-hover:opacity-100"
                        )}
                      />
                    </span>
                  </button>

                  <div
                    id={`program-panel-${program.slug}`}
                    aria-hidden={!open}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-7 pl-[4.25rem] pr-3 sm:pb-8 sm:pl-[6.25rem] sm:pr-5">
                        <div className="min-w-0 border-l-2 border-blue-royal/30 pl-5">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-royal">
                            {program.statusLabel}
                            <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                            <span className="text-slate-500 font-semibold">{program.category}</span>
                          </p>
                          <p className="mt-2.5 max-w-2xl text-[15px] leading-7 text-slate-600">
                            {program.description}
                          </p>
                          <Link
                            href={getProgramHref(program.slug)}
                            className="group/link mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-royal"
                          >
                            <span className="border-b border-transparent pb-0.5 transition-[border-color,transform] duration-300 group-hover/link:border-blue-royal group-hover/link:translate-x-0.5">
                              Lihat detail program
                            </span>
                            <ArrowRight
                              className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div data-reveal="row" className="mt-8 flex justify-center sm:mt-10">
          <Link href="/program" className="btn-editorial group/link inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-royal shadow-sm ring-1 ring-slate-200/80 hover:bg-blue-50">
            <span className="pb-0.5">
              Jelajahi seluruh program BMPS
            </span>
            <ArrowRight className="btn-icon h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}

