"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import NewsCard from "@/components/NewsCard";
import { news } from "@/lib/data/news";
import { schools } from "@/lib/data/schools";

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
  const mobileProgramTrackRef = useRef<HTMLDivElement>(null);
  const cardWidth = 240;
  const gap = 18;

  const handleProgramChange = (direction: number) => {
    setActiveProgramIndex((current) => Math.min(programCarouselItems.length - 1, Math.max(0, current + direction)));
  };

  const trackTransform = `translateX(-${activeProgramIndex * (cardWidth + gap)}px)`;

  const getProgramHref = (slug: string) => {
    if (slug === "program-pengembangan-sekolah") return "/program";
    return `/program/${slug}`;
  };

  const scrollMobileProgram = (index: number) => {
    mobileProgramTrackRef.current?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveProgramIndex(index);
  };

  return (
    <div className="pb-20">
      <div className="relative -mt-[80px] overflow-hidden bg-[#061629] pt-[80px]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/art.png')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        />

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,18,32,0.62),rgba(5,18,32,0.28)_58%,rgba(5,18,32,0.16)),linear-gradient(0deg,rgba(5,18,32,0.42),rgba(5,18,32,0.08)_62%)]" />

        <div className="relative z-10">
          <section className="relative flex min-h-[clamp(520px,52vw,660px)] items-center overflow-hidden pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
            <div className="mx-auto flex w-full max-w-[1280px] -translate-y-4 justify-center px-5 text-center text-white animate-fade-in-up sm:-translate-y-5 sm:px-8 lg:-translate-y-6 lg:px-12">
              <div className="w-full max-w-[1100px]">
                <h1 className="font-display mx-auto max-w-[1100px] text-[2rem] font-semibold leading-[1.12] tracking-normal sm:text-[2.5rem] md:text-[2.75rem] lg:text-[2.875rem] xl:text-[3rem]">
                  Selamat Datang di
                  <br />
                  Badan Musyawarah Perguruan Swasta
                  <br />
                  (BMPS) Bogor
                </h1>
                <p className="font-ui mx-auto mt-6 max-w-[820px] text-center text-base font-normal leading-[1.6] tracking-normal text-white/85 sm:text-[1.08rem]">
                  Wadah organisasi yang menjadi tempat berhimpun, berkomunikasi,
                  dan berkolaborasi bagi sekolah/perguruan swasta di wilayah Bogor.
                </p>

                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/daftar-sekolah"
                  className="group font-display inline-flex items-center justify-center gap-2 rounded-xl border border-white/75 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-[background-color,color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#172033]"
                >
                  Daftarkan Sekolah
                  <ChevronRight className="h-4 w-4 transition-colors duration-200 group-hover:text-[#172033]" aria-hidden="true" />
                </Link>
                <Link
                  href="/program"
                  className="group font-display inline-flex items-center justify-center gap-2 rounded-xl border border-white/75 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-[background-color,color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#172033]"
                >
                  Lihat Program
                  <ChevronRight className="h-4 w-4 transition-colors duration-200 group-hover:text-[#172033]" aria-hidden="true" />
                </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="bg-white py-14 sm:py-16 lg:py-18">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.42fr] lg:items-center">
            <div className="max-w-md">
              <h2 className="mt-3 text-3x1 font-bold leading-tight tracking-[-0.00em] text-navy-deep sm:text-[2.4rem]">
                Mengenal
                <br />
                Sekolah &
                <br />
                Yayasan di Bogor
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Temukan sekolah dan yayasan yang tergabung dalam jaringan BMPS
                Daerah Bogor.
              </p>
            </div>

            <div className="overflow-hidden">
              <div className="touch-scroll scrollbar-hide flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none]">
                {featuredSchools.map((school) => (
                  <Link
                    key={school.slug}
                    href={`/sekolah/${school.slug}`}
                    className="group relative min-h-[300px] min-w-[78vw] snap-start overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,35,80,0.05)] sm:min-h-[320px] sm:min-w-[240px]"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-4 sm:p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                          {school.level}
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                          {school.type === "yayasan" ? "Yayasan" : "Sekolah"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
                        {school.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-200">{school.address}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                        Lihat profil
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12 lg:py-14">
        <div className="section-shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-navy-deep sm:text-[2.1rem]">
                Berita & Kegiatan Terkini
              </h2>
            </div>
            <Link href="/berita" className="hidden text-sm font-semibold text-blue-royal hover:text-navy-deep sm:inline-flex">
              Lihat Semua Berita
            </Link>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latestNews.map((item) => (
              <div key={item.slug} className="rounded-[18px] border border-slate-200 bg-white p-1 shadow-[0_10px_20px_rgba(15,35,80,0.04)]">
                <NewsCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#edf5ff] py-12 sm:py-16 lg:py-20">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[45%_55%] lg:items-stretch lg:gap-8">
            <div className="relative aspect-[16/10] w-full max-w-full overflow-hidden rounded-[22px] bg-slate-200 shadow-[0_18px_40px_rgba(15,35,80,0.08)] lg:aspect-auto lg:min-h-full">
              <Image
                src="/8.png"
                alt="Program BMPS Bogor"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto max-w-full object-contain lg:h-full lg:object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--brand-primary)] sm:text-[2rem] lg:text-[2.2rem]">
                Program BMPS
              </h2>

              <div className="mt-6 hidden overflow-hidden lg:block">
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
                        className={`group flex min-w-[240px] flex-col rounded-[20px] border p-5 transition-colors duration-250 ${
                          isActive
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-[0_16px_30px_rgba(23,78,166,0.2)]"
                            : "border-[#e5e7eb] bg-white text-[#111827] shadow-[0_8px_18px_rgba(15,23,42,0.03)]"
                        }`}
                        style={{ minHeight: "210px", width: `${cardWidth}px` }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                              isActive ? "bg-white/15 text-white" : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                            }`}
                          >
                            {program.category}
                          </span>
                        </div>

                        <h3
                          className={`mt-4 text-xl font-semibold leading-snug ${
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
                          className={`mt-3 line-clamp-3 text-sm leading-6 ${
                            isActive ? "text-white/85" : "text-slate-600"
                          }`}
                        >
                          {program.description}
                        </p>

                        <div className="mt-auto pt-5">
                          <span
                            className={`inline-flex items-center gap-2 text-sm font-medium ${
                              isActive ? "text-white" : "text-[var(--brand-primary)]"
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

              <div
                ref={mobileProgramTrackRef}
                onScroll={(event) => {
                  const firstCard = event.currentTarget.children[0] as HTMLElement | undefined;
                  const cardStep = firstCard ? firstCard.offsetWidth + 16 : 296;
                  setActiveProgramIndex(Math.min(programCarouselItems.length - 1, Math.round(event.currentTarget.scrollLeft / cardStep)));
                }}
                className="touch-scroll scrollbar-hide mt-4 flex gap-4 snap-x snap-mandatory overscroll-x-contain overflow-x-auto scroll-smooth pb-2 lg:hidden"
              >
                {programCarouselItems.map((program, index) => {
                  const isActive = activeProgramIndex === index;

                  return (
                    <Link
                      key={program.slug}
                      href={getProgramHref(program.slug)}
                      className={`group flex min-h-[270px] min-w-[280px] shrink-0 snap-start flex-col rounded-[16px] border p-6 transition-colors duration-250 sm:min-w-[300px] ${
                        isActive
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-[0_16px_30px_rgba(23,78,166,0.2)]"
                          : "border-[#e5e7eb] bg-white text-[#111827] shadow-[0_8px_18px_rgba(15,23,42,0.03)]"
                      }`}
                    >
                      <span className={`inline-flex self-start rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isActive ? "bg-white/15 text-white" : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"}`}>
                        {program.category}
                      </span>
                      <h3 className={`mt-4 text-[17px] font-semibold leading-snug ${isActive ? "text-white" : "text-[#111827]"}`}>
                        {program.title}
                      </h3>
                      <div className={`mt-4 h-px w-12 ${isActive ? "bg-white/60" : "bg-[#e5e7eb]"}`} />
                      <p className={`mt-3 text-[13px] leading-[1.5] ${isActive ? "text-white/85" : "text-slate-600"}`}>
                        {program.description}
                      </p>
                      <span className={`mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium ${isActive ? "text-white" : "text-[var(--brand-primary)]"}`}>
                        Lihat detail
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 lg:hidden" aria-label="Posisi program">
                {programCarouselItems.map((program, index) => (
                  <button
                    key={program.slug}
                    type="button"
                    aria-label={`Lihat program ${index + 1}`}
                    aria-current={activeProgramIndex === index}
                    onClick={() => scrollMobileProgram(index)}
                    className={`h-2 rounded-full transition-all ${activeProgramIndex === index ? "w-6 bg-[var(--brand-primary)]" : "w-2 bg-slate-300"}`}
                  />
                ))}
              </div>

              <div className="mt-5 hidden items-center justify-end gap-3 lg:flex">
                <button
                  type="button"
                  aria-label="Program sebelumnya"
                  onClick={() => handleProgramChange(-1)}
                  disabled={activeProgramIndex === 0}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                    activeProgramIndex === 0
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Program berikutnya"
                  onClick={() => handleProgramChange(1)}
                  disabled={activeProgramIndex === programCarouselItems.length - 1}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    activeProgramIndex === programCarouselItems.length - 1
                      ? "cursor-not-allowed bg-slate-300 text-slate-600"
                      : "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-deep)]"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-6 text-center lg:text-left">
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
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-primary)] shadow-[0_10px_20px_rgba(255,255,255,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
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
