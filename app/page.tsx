"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import { news } from "@/lib/data/news";
import { schools } from "@/lib/data/schools";

const galleryItems = [
  {
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=900&auto=format&fit=crop",
    title: "Rapat koordinasi",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900&auto=format&fit=crop",
    title: "Pelatihan guru",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop",
    title: "Kegiatan siswa",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop",
    title: "Pembinaan sekolah",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    title: "Kolaborasi pendidikan",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop",
    title: "Kegiatan komunitas",
  },
];

const programCarouselItems = [
  {
    slug: "penguatan-mutu-guru",
    title: "Penguatan Mutu Guru Swasta",
    category: "Pendidikan",
    description:
      "Meningkatkan kompetensi guru melalui pelatihan, pendampingan, dan pembelajaran yang adaptif.",
  },
  {
    slug: "digitalisasi-sekolah-swasta",
    title: "Digitalisasi Sekolah Swasta",
    category: "Teknologi",
    description:
      "Mendorong transformasi digital sekolah agar proses belajar dan administrasi menjadi lebih modern.",
  },
  {
    slug: "beasiswa-pendidikan-mandiri",
    title: "Beasiswa Pendidikan Mandiri",
    category: "Beasiswa",
    description:
      "Memberikan akses pendidikan yang lebih luas bagi siswa berprestasi dan membutuhkan dukungan.",
  },
  {
    slug: "akreditasi-sekolah-terpadu",
    title: "Akreditasi Sekolah Terpadu",
    category: "Mutu",
    description:
      "Mendampingi sekolah dalam proses evaluasi mutu dan persiapan akreditasi yang berkelanjutan.",
  },
  {
    slug: "program-pengembangan-sekolah",
    title: "Program Pengembangan Sekolah",
    category: "Pengembangan",
    description:
      "Mendukung penguatan kepemimpinan, SDM, dan inovasi untuk kemajuan sekolah di Bogor.",
  },
];

export default function Home() {
  const latestNews = news.slice(0, 3);
  const featuredSchools = schools.slice(0, 5);
  const [activeProgramIndex, setActiveProgramIndex] = useState(0);
  const cardWidth = 260;
  const gap = 20;

  const handleProgramChange = (direction: number) => {
    setActiveProgramIndex((current) => Math.min(programCarouselItems.length - 1, Math.max(0, current + direction)));
  };

  const trackTransform = `translateX(-${activeProgramIndex * (cardWidth + gap)}px)`;

  const getProgramHref = (slug: string) => {
    if (slug === "program-pengembangan-sekolah") return "/program";
    return `/program/${slug}`;
  };

  return (
    <div className="pb-20">
      <div className="relative overflow-hidden bg-[#061629]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/art.png')",
            backgroundPosition: "center top",
            backgroundSize: "cover",
          }}
        />

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(7,24,40,0.10),rgba(7,24,40,0.18)_18%,rgba(7,24,40,0.36)_42%,rgba(4,18,38,0.64)_72%,rgba(3,15,35,0.92)_100%)]" />

        <div className="relative z-10">
          <section className="relative flex min-h-[100vh] items-end overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
            <div className="mx-auto max-w-3xl px-4 text-center text-white animate-fade-in-up sm:px-6 lg:px-8">


              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Selamat Datang di BMPS
                <br />
                Daerah Bogor
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                Membangun kolaborasi dan memperkuat pendidikan swasta di wilayah
                Bogor.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/daftar-sekolah"
                  className="inline-flex items-center justify-center rounded-full bg-[#0d2f73] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d468f]"
                >
                  Daftarkan Sekolah
                </Link>
                <Link
                  href="/program"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Lihat Program
                </Link>
              </div>
            </div>
          </section>

          <section className="relative py-12 text-white sm:py-16">
            <div className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.4fr] lg:items-center">
              <div className="max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                  Sekolah & Yayasan
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                  Mengenal
                  <br />
                  Sekolah &
                  <br />
                  Yayasan di Bogor
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  Temukan sekolah dan yayasan yang tergabung dalam jaringan BMPS
                  Daerah Bogor.
                </p>
              </div>

              <div className="overflow-hidden">
                <div className="touch-scroll scrollbar-hide flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none]">
                  {featuredSchools.map((school, index) => (
                    <Link
                      key={school.slug}
                      href={`/sekolah/${school.slug}`}
                      className="group relative min-h-[390px] min-w-[82vw] snap-start overflow-hidden rounded-[26px] border border-white/15 shadow-[0_20px_45px_rgba(2,10,23,0.25)] sm:min-w-[280px]"
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={school.image}
                          alt={school.name}
                          fill
                          sizes="(max-width: 768px) 80vw, 32vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            index % 4 === 0
                              ? "linear-gradient(180deg, rgba(17, 61, 157, 0.35) 0%, rgba(5, 14, 30, 0.9) 100%)"
                              : index % 4 === 1
                                ? "linear-gradient(180deg, rgba(17, 120, 90, 0.35) 0%, rgba(5, 14, 30, 0.88) 100%)"
                                : index % 4 === 2
                                  ? "linear-gradient(180deg, rgba(147, 51, 234, 0.28) 0%, rgba(5, 14, 30, 0.9) 100%)"
                                  : "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(7,29,61,0.82) 100%)",
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                            {school.level}
                          </span>
                          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                            {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold leading-snug text-white">
                          {school.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-200">{school.address}</p>
                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                          Lihat profil
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative py-12 sm:py-16">
            <div className="section-shell">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Berita & Kegiatan
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Berita & Kegiatan Terkini
                  </h2>
                </div>
                <Link href="/berita" className="hidden text-sm font-semibold text-white/90 hover:text-white sm:inline-flex">
                  Lihat Semua Berita
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {latestNews.map((item) => (
                  <div key={item.slug} className="rounded-[24px] border border-white/10 bg-[rgba(7,20,35,0.35)] p-1 shadow-[0_25px_60px_rgba(2,11,21,0.26)] backdrop-blur-[2px]">
                    <NewsCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>

      <section className="bg-[#edf5ff] py-20">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[45%_55%] lg:items-stretch">
            <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-slate-200 shadow-[0_18px_40px_rgba(15,35,80,0.08)] sm:min-h-[360px] lg:min-h-full">
              <Image
                src="/bg.png"
                alt="Program BMPS Bogor"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-[#1f5aa8] sm:text-4xl">
                Program BMPS
              </h2>

              <div className="mt-6 overflow-hidden">
                <div
                  className="flex gap-5 transition-transform duration-300 ease-out"
                  style={{ transform: trackTransform }}
                >
                  {programCarouselItems.map((program, index) => {
                    const isActive = activeProgramIndex === index;

                    return (
                      <Link
                        key={program.slug}
                        href={getProgramHref(program.slug)}
                        className={`group flex min-w-[260px] flex-col rounded-[20px] border p-6 transition-colors duration-250 ${
                          isActive
                            ? "border-[#1f5aa8] bg-[#1f5aa8] text-white shadow-[0_16px_30px_rgba(31,90,168,0.2)]"
                            : "border-[#e5e7eb] bg-white text-[#111827] shadow-[0_8px_18px_rgba(15,23,42,0.03)]"
                        }`}
                        style={{ minHeight: "220px", width: `${cardWidth}px` }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                              isActive ? "bg-white/15 text-white" : "bg-[#edf5ff] text-[#1f5aa8]"
                            }`}
                          >
                            {program.category}
                          </span>
                        </div>

                        <h3
                          className={`mt-5 text-2xl font-semibold leading-snug ${
                            isActive ? "text-white" : "text-[#111827]"
                          }`}
                        >
                          {program.title}
                        </h3>

                        <div
                          className={`mt-4 h-px w-12 ${
                            isActive ? "bg-white/60" : "bg-[#e5e7eb]"
                          }`}
                        />

                        <p
                          className={`mt-4 line-clamp-3 text-sm leading-6 ${
                            isActive ? "text-white/85" : "text-slate-600"
                          }`}
                        >
                          {program.description}
                        </p>

                        <div className="mt-auto pt-5">
                          <span
                            className={`inline-flex items-center gap-2 text-sm font-medium ${
                              isActive ? "text-white" : "text-[#1f5aa8]"
                            }`}
                          >
                            Lihat detail
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  aria-label="Program sebelumnya"
                  onClick={() => handleProgramChange(-1)}
                  disabled={activeProgramIndex === 0}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                    activeProgramIndex === 0
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#1f5aa8] hover:text-[#1f5aa8]"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Program berikutnya"
                  onClick={() => handleProgramChange(1)}
                  disabled={activeProgramIndex === programCarouselItems.length - 1}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    activeProgramIndex === programCarouselItems.length - 1
                      ? "cursor-not-allowed bg-slate-300 text-slate-600"
                      : "bg-[#1f5aa8] text-white hover:bg-[#174d9d]"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-6 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-royal">
                Galeri Kegiatan
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy-deep sm:text-3xl">
                Galeri Kegiatan BMPS Bogor
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <div
                  key={item.title}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="text-sm font-medium text-white">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#0b1e3d] shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/cta.png')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(31,90,168,0.78),rgba(10,35,75,0.72))]" />

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
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1f5aa8] shadow-[0_10px_20px_rgba(255,255,255,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
                  >
                    Daftarkan Sekolah/Yayasan
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
