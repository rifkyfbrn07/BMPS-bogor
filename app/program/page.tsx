"use client";

import { useMemo, useState, useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import SearchBar from "@/components/SearchBar";
import FilterButton from "@/components/FilterButton";
import Pagination from "@/components/Pagination";
import ProgramCard from "@/components/ProgramCard";
import ProgramSchoolCard from "@/components/ProgramSchoolCard";
import { programs as staticPrograms } from "@/lib/data/programs";
import type { Program, School } from "@/lib/types";

const itemsPerPage = 6;

export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>(staticPrograms);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [aidSchools, setAidSchools] = useState<School[]>([]);

  useEffect(() => {
    fetch("/api/content/programs")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setPrograms(data.data);
      })
      .catch((err) => console.error("Gagal memuat program:", err));

    // Sekolah/yayasan APPROVED yang mendaftar program Bantuan Pendidikan.
    fetch("/api/content/schools?program=BANTUAN_PENDIDIKAN")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) setAidSchools(data.data);
      })
      .catch((err) => console.error("Gagal memuat sekolah peserta bantuan pendidikan:", err));
  }, []);

  const categories = useMemo(() => {
    return ["Semua", ...new Set(programs.map((program) => program.category))];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return programs.filter((program) => {
      const matchesCategory =
        activeCategory === "Semua" || program.category === activeCategory;
      const matchesSearch =
        normalized.length === 0 ||
        program.title.toLowerCase().includes(normalized) ||
        program.description.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [query, activeCategory, programs]);

  const totalPages = Math.max(1, Math.ceil(filteredPrograms.length / itemsPerPage));
  const currentItems = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="section-shell w-full max-w-full overflow-x-clip py-8 sm:py-16 lg:py-20">
      <SectionHeading
        eyebrow=""
        title="Program BMPS Bogor"
        description="Berbagai inisiatif dan kegiatan yang ditujukan untuk memperkuat mutu pendidikan swasta di Bogor."
      />

      <div className="mt-6 flex w-full max-w-full flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-[28px] sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full min-w-0 xl:max-w-md">
          <SearchBar
            value={query}
            onChange={(value) => {
              setQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Cari program..."
          />
        </div>

        <div className="flex w-full min-w-0 flex-wrap gap-2 xl:w-auto">
          {categories.map((category) => (
            <FilterButton
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        {currentItems.length > 0 ? (
          <>
            <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {currentItems.map((program) => (
                <ProgramCard key={program.slug} program={program} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="soft-panel p-8 text-center text-slate-600">
            Tidak ada program yang cocok dengan pencarian saat ini.
          </div>
        )}
      </div>

      <section className="mt-14 sm:mt-16" aria-labelledby="bantuan-schools-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">Program Bantuan Pendidikan</p>
          <h2 id="bantuan-schools-heading" className="mt-2 text-2xl font-bold tracking-tight text-navy-deep sm:text-3xl">
            Sekolah &amp; Yayasan yang Terdaftar
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Sekolah dan yayasan terverifikasi BMPS Bogor yang mengikuti program Bantuan Pendidikan, diurutkan dari yang paling baru disetujui.
          </p>
        </div>

        {aidSchools.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {aidSchools.map((school) => (
              <ProgramSchoolCard key={school.slug} school={school} />
            ))}
          </div>
        ) : (
          <div className="soft-panel mt-8 p-8 text-center text-slate-600">
            Belum ada sekolah atau yayasan terdaftar pada program Bantuan Pendidikan.
          </div>
        )}
      </section>
    </div>
  );
}
