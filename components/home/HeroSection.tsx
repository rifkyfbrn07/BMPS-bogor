"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // 1. Background image subtle scale & fade reveal
      if (bgImageRef.current) {
        tl.fromTo(
          bgImageRef.current,
          { scale: 1.05, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
          0
        );
      }

      // 2. Overlay smooth appearance
      if (overlayRef.current) {
        tl.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.0, ease: "power2.out" },
          0.1
        );
      }

      // 3. Eyebrow badge / label
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.3
        );
      }

      // 4. Headline line-by-line clip reveal
      const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean);
      if (lines.length > 0) {
        tl.fromTo(
          lines,
          { y: "115%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.45
        );
      }

      // 5. Description text reveal
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: "power2.out" },
          0.9
        );
      }

      // 6. CTA buttons stagger
      if (ctaContainerRef.current) {
        const buttons = ctaContainerRef.current.querySelectorAll("a");
        tl.fromTo(
          buttons,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
          },
          1.05
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-[#061629]">
      {/* Background Image with subtle scale reveal */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url('/art.png')",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      />

      {/* Atmospheric dark gradient overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,18,32,0.68),rgba(5,18,32,0.32)_58%,rgba(5,18,32,0.2)),linear-gradient(0deg,rgba(5,18,32,0.5),rgba(5,18,32,0.1)_62%)]"
      />

      {/* Content Container */}
      <div className="relative z-10">
        <section className="relative flex min-h-[clamp(520px,52vw,660px)] items-center overflow-hidden pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
          <div className="mx-auto flex w-full max-w-[1280px] -translate-y-4 justify-center px-5 text-center text-white sm:-translate-y-5 sm:px-8 lg:-translate-y-6 lg:px-12">
            <div className="w-full max-w-[1100px]">
              {/* Eyebrow */}
              <p
                ref={eyebrowRef}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Badan Musyawarah Perguruan Swasta
              </p>

              {/* Headline with 3-line clip reveal */}
              <h1 className="font-display mx-auto max-w-[1100px] text-[2rem] font-semibold leading-[1.14] tracking-normal sm:text-[2.5rem] md:text-[2.75rem] lg:text-[2.875rem] xl:text-[3rem]">
                <span className="line-mask">
                  <span ref={line1Ref} className="line-inner">
                    Selamat Datang di
                  </span>
                </span>
                <span className="line-mask mt-0.5 sm:mt-1">
                  <span ref={line2Ref} className="line-inner">
                    Badan Musyawarah Perguruan Swasta
                  </span>
                </span>
                <span className="line-mask mt-0.5 sm:mt-1">
                  <span ref={line3Ref} className="line-inner text-blue-200">
                    (BMPS) Bogor
                  </span>
                </span>
              </h1>

              {/* Description */}
              <p
                ref={descRef}
                className="font-ui mx-auto mt-6 max-w-[820px] text-center text-base font-normal leading-[1.6] tracking-normal text-white/85 sm:text-[1.08rem]"
              >
                Wadah organisasi yang menjadi tempat berhimpun, berkomunikasi,
                dan berkolaborasi bagi sekolah/perguruan swasta di wilayah Bogor.
              </p>

              {/* CTAs with micro-interactions */}
              <div
                ref={ctaContainerRef}
                className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Link
                  href="/daftar-sekolah"
                  className="group font-display btn-editorial inline-flex items-center justify-center gap-2 rounded-xl border border-white/80 bg-white px-5 py-3 text-sm font-semibold text-[#172033] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.3)] hover:border-white hover:bg-slate-100 hover:text-[#172033]"
                >
                  Masukan Data Sekolah/Yayasan ke BMPS
                  <ChevronRight
                    className="btn-icon h-4 w-4 text-[#172033]"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/program"
                  className="group font-display btn-editorial inline-flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-[#172033]"
                >
                  Lihat Program
                  <ChevronRight
                    className="btn-icon h-4 w-4 text-white transition-colors group-hover:text-[#172033]"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
