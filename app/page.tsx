"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/home/HeroSection";
import NewsCard from "@/components/NewsCard";
import { news } from "@/lib/data/news";
import { schools } from "@/lib/data/schools";
import FilterButton from "@/components/FilterButton";
import ProgramExplorer from "@/components/program/ProgramExplorer";
import type { School } from "@/lib/types";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const galleryItems = [
  {
    image: "/7.png",
    title: "Pelantikan BMPS Komisariat Kab. Bogor",
  },
  {
    image: "/2.png",
    title: "Pelatihan guru",
  },
  {
    image: "/3.png",
    title: "Rapat Kerja Komisariat (Rakerkom)",
  },
  {
    image: "/4.png",
    title: "Pembinaan sekolah",
  },
  {
    image: "/5.png",
    title: "Kolaborasi pendidikan",
  },
  {
    image: "/6.png",
    title: "Kegiatan komunitas",
  },
];

export default function Home() {
  const latestNews = news.slice(0, 3);
  const [schoolsList, setSchoolsList] = useState<School[]>(schools);
  const [selectedLevelTab, setSelectedLevelTab] = useState("Semua");
  const [filterTransitioning, setFilterTransitioning] = useState(false);

  const schoolSectionRef = useRef<HTMLElement>(null);
  const newsSectionRef = useRef<HTMLElement>(null);
  const gallerySectionRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/content/schools")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) {
          setSchoolsList(resData.data);
        }
      })
      .catch((err) => console.error("Gagal memuat sekolah:", err));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // School Directory Section
      if (schoolSectionRef.current) {
        gsap.from("[data-animate='school-header']", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: schoolSectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        gsap.from("[data-animate='school-cards'] > *", {
          y: 24,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-animate='school-cards']",
            start: "top 85%",
            once: true,
          },
        });
      }

      // News Section
      if (newsSectionRef.current) {
        gsap.from("[data-animate='news-header']", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: newsSectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        gsap.from("[data-animate='news-cards'] > *", {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-animate='news-cards']",
            start: "top 85%",
            once: true,
          },
        });
      }

      // Gallery Section
      if (gallerySectionRef.current) {
        gsap.from("[data-animate='gallery-header']", {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gallerySectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        gsap.from("[data-animate='gallery-grid'] > *", {
          scale: 0.96,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-animate='gallery-grid']",
            start: "top 85%",
            once: true,
          },
        });
      }

      // CTA Section
      if (ctaSectionRef.current) {
        gsap.from("[data-animate='cta-box']", {
          y: 30,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === selectedLevelTab) return;
    setFilterTransitioning(true);
    setTimeout(() => {
      setSelectedLevelTab(tab);
      setFilterTransitioning(false);
    }, 150);
  };

  const filteredSchools = schoolsList.filter((school) => {
    if (selectedLevelTab === "Semua") return true;
    if (selectedLevelTab === "TK") return school.level === "TK" || school.level === "OTHER";
    if (selectedLevelTab === "Jenjang SD & MI") return school.level === "SD" || school.level === "MI";
    if (selectedLevelTab === "Jenjang SMP & MTs") return school.level === "SMP" || school.level === "MTs";
    if (selectedLevelTab === "Jenjang SMA & SMK") return school.level === "SMA" || school.level === "SMK" || school.level === "MA";
    return false;
  });

  const levelTabs = ["Semua", "TK", "Jenjang SD & MI", "Jenjang SMP & MTs", "Jenjang SMA & SMK"];

  return (
    <div className="pb-20">
      {/* Editorial Intentional Hero Section */}
      <HeroSection />

      {/* Direktori Anggota Section */}
      <section ref={schoolSectionRef} className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.42fr] lg:items-center lg:gap-14">
            <div data-animate="school-header" className="max-w-md">
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-royal">
                <span aria-hidden="true" className="h-px w-8 bg-blue-royal/50" />
                Direktori Anggota
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-navy-deep sm:text-[2.4rem]">
                Mengenal
                <br />
                Sekolah &amp;
                <br />
                Yayasan di Bogor
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Temukan sekolah dan yayasan yang tergabung dalam jaringan BMPS
                Daerah Bogor.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {levelTabs.map((tab) => (
                  <FilterButton
                    key={tab}
                    label={tab}
                    active={selectedLevelTab === tab}
                    onClick={() => handleTabChange(tab)}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-hidden">
              {filteredSchools.length > 0 ? (
                <div
                  data-animate="school-cards"
                  className={`touch-scroll scrollbar-hide flex gap-4 overflow-x-auto pb-3 transition-opacity duration-200 ease-out [scrollbar-width:none] ${
                    filterTransitioning ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {filteredSchools.map((school) => (
                    <Link
                      key={school.slug}
                      href={`/sekolah/${school.slug}`}
                      className="group card-hover-editorial relative min-h-[300px] min-w-[78vw] snap-start overflow-hidden rounded-[18px] border border-slate-200/90 bg-white shadow-[0_8px_20px_rgba(15,35,80,0.05)] hover:border-blue-200 sm:min-h-[320px] sm:min-w-[240px]"
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={school.image}
                          alt={school.name}
                          fill
                          sizes="(max-width: 768px) 80vw, 32vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent transition-opacity duration-300 group-hover:from-slate-950/90" />
                      <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-4 sm:p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                            {school.level}
                          </span>
                          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                            {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-blue-200 sm:text-xl">
                          {school.name}
                        </h3>
                        {school.npsn && (
                          <p className="mt-1 text-xs font-semibold tracking-wide text-slate-200">
                            NPSN {school.npsn}
                          </p>
                        )}
                        <p className="mt-2 line-clamp-2 text-sm text-slate-200">{school.address}</p>
                        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                          <span>Selengkapnya</span>
                          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[16px] border border-dashed border-slate-300 p-8 text-center text-slate-500 italic">
                  Belum ada sekolah terdaftar untuk jenjang ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Berita & Kegiatan Section */}
      <section ref={newsSectionRef} className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="section-shell">
          <div data-animate="news-header" className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 max-w-2xl">
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-royal">
                <span aria-hidden="true" className="h-px w-8 bg-blue-royal/50" />
                Berita &amp; Kegiatan
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-navy-deep sm:text-[2.1rem]">
                Kabar terbaru dari lapangan
              </h2>
            </div>
            <Link href="/berita" className="group/link inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-royal sm:pb-1">
              <span className="border-b border-transparent pb-0.5 transition-[border-color,transform] duration-300 group-hover/link:border-blue-royal group-hover/link:translate-x-0.5">
                Lihat semua berita
              </span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <div data-animate="news-cards" className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latestNews.map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Program Explorer Section */}
      <ProgramExplorer />

      {/* Galeri Kegiatan Section */}
      <section ref={gallerySectionRef} className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="section-shell">
          <div data-animate="gallery-header" className="max-w-2xl">
            <h3 className="text-2xl font-bold tracking-[-0.02em] text-navy-deep sm:text-3xl">
              Galeri Kegiatan BMPS Bogor
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Dokumentasi kegiatan bersama sekolah, yayasan, dan komunitas pendidikan se-Bogor.
            </p>
          </div>

          <div className="mt-10">
            <div data-animate="gallery-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <div
                  key={item.title}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.05)]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent transition-opacity duration-300 group-hover:from-slate-950/80" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="text-sm font-medium text-white">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaSectionRef} className="px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-animate="cta-box" className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#0b1e3d] shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/cta.png')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(23,78,166,0.78),rgba(10,35,75,0.72))]" />

            <div className="relative z-10 flex items-center justify-center px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
              <div className="mx-auto max-w-[700px] text-center text-white">
                <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Mari Bersama Memajukan Pendidikan Bogor
                </h2>
                <p className="mx-auto mt-4 max-w-[600px] text-base leading-7 text-white/85">
                  Bergabung dan menjadi bagian dari jaringan sekolah dan yayasan yang
                  bersama-sama membangun pendidikan yang lebih baik di Bogor.
                </p>
                <div className="mt-7 flex justify-center">
                  <Link
                    href="/daftar-sekolah"
                    className="btn-editorial inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-primary)] shadow-[0_10px_20px_rgba(255,255,255,0.14)] hover:bg-slate-100"
                  >
                    Masukan Data Sekolah/Yayasan ke BMPS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
