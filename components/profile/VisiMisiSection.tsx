"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type MisiItem = {
  id: string;
  text: string;
};

export default function VisiMisiSection({ misiItems }: { misiItems: MisiItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const visiRef = useRef<HTMLDivElement>(null);
  const misiListRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      // 1. Heading section
      tl.from("[data-visi='heading']", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      // 2. VISI Statement first
      if (visiRef.current) {
        tl.from(
          visiRef.current,
          {
            y: 28,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.3"
        );
      }

      // 3. MISI Items - Staggered with numbers revealing slightly before text
      if (misiListRef.current) {
        const rows = misiListRef.current.querySelectorAll("[data-misi-row]");
        
        rows.forEach((row, index) => {
          const num = row.querySelector("[data-misi-num]");
          const text = row.querySelector("[data-misi-text]");

          const rowTime = 0.5 + index * 0.12;

          if (num) {
            tl.fromTo(
              num,
              { x: -12, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
              rowTime
            );
          }

          if (text) {
            tl.fromTo(
              text,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
              rowTime + 0.06
            );
          }
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visi-misi"
      className="bg-white border-y border-slate-200/80 py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      <div className="section-shell">
        <div data-visi="heading" className="text-center max-w-2xl mx-auto space-y-4">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">
            
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
            Visi &amp; Misi Organisasi
          </h2>
          <p className="text-sm leading-relaxed text-slate-500">
            Arah pandang dan rencana strategis kerja BMPS Bogor dalam mendukung peningkatan mutu.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* VISI — Pernyataan besar editorial */}
          <div ref={visiRef} className="lg:col-span-5">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.22em] text-blue-royal">
              Visi
            </p>
            <blockquote className="mt-6 font-display text-[1.65rem] font-bold leading-[1.32] tracking-[-0.01em] text-navy-deep sm:text-4xl sm:leading-[1.28]">
              Membangun pendidikan swasta yang unggul, relevan, dan berdaya saing.
            </blockquote>
            <div className="mt-8 h-px w-16 bg-blue-royal/40" aria-hidden="true" />
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-500">
              Menjadi arah pengembangan bagi seluruh kurikulum dan operasional keanggotaan sekolah swasta di Bogor.
            </p>
          </div>

          {/* MISI — Daftar bernomor dengan ritme vertikal */}
          <div className="lg:col-span-7">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.22em] text-blue-royal">
              Misi
            </p>
            <ol ref={misiListRef} className="mt-4 border-t border-slate-200/80">
              {misiItems.map((misi) => (
                <li
                  key={misi.id}
                  data-misi-row
                  className="flex gap-6 border-b border-slate-200/80 py-6 sm:gap-8 sm:py-7"
                >
                  <span
                    data-misi-num
                    aria-hidden="true"
                    className="font-display pt-0.5 text-base font-bold tabular-nums text-blue-royal"
                  >
                    {misi.id}
                  </span>
                  <p
                    data-misi-text
                    className="min-w-0 text-[15px] leading-7 text-slate-700 sm:text-base"
                  >
                    {misi.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
