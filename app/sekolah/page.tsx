"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Search, School as SchoolIcon, AlertCircle } from "lucide-react";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import { schools as staticSchools } from "@/lib/data/schools";
import type { School } from "@/lib/types";

const itemsPerPage = 6;

export default function SekolahPage() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [schoolsList, setSchoolsList] = useState<School[]>(staticSchools);
  const [loading, setLoading] = useState(true);
  const listTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/content/schools")
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted && resData.data) {
          setSchoolsList(resData.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat data sekolah:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredSchools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return schoolsList;

    return schoolsList.filter((school) => {
      const nameMatch = school.name?.toLowerCase().includes(normalized);
      const typeMatch = school.type?.toLowerCase().includes(normalized);
      const levelMatch = school.level?.toLowerCase().includes(normalized);
      const addressMatch = school.address?.toLowerCase().includes(normalized);
      const cityMatch = school.city?.toLowerCase().includes(normalized);
      const npsnMatch = school.npsn?.toLowerCase().includes(normalized);

      return (
        nameMatch ||
        typeMatch ||
        levelMatch ||
        addressMatch ||
        cityMatch ||
        npsnMatch
      );
    });
  }, [query, schoolsList]);

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / itemsPerPage));
  const currentItems = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Header Section */}
      <section className="border-b border-[#E5E7EB] bg-white py-10 sm:py-14 lg:py-16">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D0E1FD] bg-[#EAF2FF] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#1B5DBF]">
              <SchoolIcon className="h-3.5 w-3.5" />
              DIREKTORI ANGGOTA
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F1F4A] sm:text-4xl lg:text-5xl">
              DAFTAR SEKOLAH &amp; YAYASAN
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Temukan sekolah dan yayasan yang telah terdaftar sebagai bagian dari BMPS Bogor.
            </p>
          </div>

          {/* 2. Search Bar (Width matches the grid container) */}
          <div className="w-full mt-8 sm:mt-10">
            <div className="relative flex items-center">
              <label htmlFor="school-search-input" className="sr-only">
                Cari nama sekolah atau yayasan
              </label>
              <Search
                className="pointer-events-none absolute left-4 sm:left-5 h-5 w-5 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="school-search-input"
                type="search"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari nama sekolah atau yayasan..."
                className="h-14 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-12 sm:pl-14 pr-4 text-sm sm:text-base text-[#172554] shadow-sm outline-none transition duration-150 placeholder:text-slate-400 focus:border-[#1B2CC1] focus:ring-2 focus:ring-[#1B2CC1]/15"
              />
            </div>
            {query.trim() && (
              <p className="mt-2.5 text-xs text-slate-500">
                Menampilkan hasil pencarian untuk &ldquo;<span className="font-semibold text-[#0F1F4A]">{query.trim()}</span>&rdquo; &middot; {filteredSchools.length} sekolah/yayasan ditemukan
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Content Grid & Pagination Area */}
      <section ref={listTopRef} className="section-shell py-10 sm:py-14 lg:py-16 scroll-mt-24">
        {loading ? (
          /* Skeleton Loading State (6 cards) */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse rounded-[22px] border border-[#E5E7EB] bg-white p-5 shadow-sm"
              >
                <div className="h-48 w-full rounded-xl bg-slate-100" />
                <div className="mt-4 h-4 w-20 rounded bg-slate-100" />
                <div className="mt-2 h-6 w-3/4 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-4 h-10 w-full rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <>
            {/* 3-Column Grid on Desktop, 2 on Tablet, 1 on Mobile (Max 6 per page) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((school) => (
                <SchoolCard key={school.slug} school={school} />
              ))}
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : query.trim() ? (
          /* Empty State Search */
          <div className="mx-auto max-w-lg rounded-[22px] border border-[#E5E7EB] bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#0F1F4A]">
              Tidak ada sekolah atau yayasan yang ditemukan
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Tidak ada hasil yang cocok dengan kata kunci &ldquo;{query}&rdquo;. Coba gunakan kata kunci lain seperti nama sekolah, jenjang, atau lokasi.
            </p>
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0F1F4A] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1B2CC1]"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          /* Empty State Database */
          <div className="mx-auto max-w-lg rounded-[22px] border border-[#E5E7EB] bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1B2CC1]">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#0F1F4A]">
              Belum ada sekolah atau yayasan yang terdaftar
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Data sekolah dan yayasan anggota BMPS Bogor akan ditampilkan di sini setelah melalui proses verifikasi.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
