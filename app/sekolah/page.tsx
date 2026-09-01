"use client";

import { useMemo, useState, useEffect } from "react";
import FilterButton from "@/components/FilterButton";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import SearchBar from "@/components/SearchBar";
import SectionHeading from "@/components/SectionHeading";
import { schools } from "@/lib/data/schools";
import type { School } from "@/lib/types";

const filters = ["Semua", "TK", "Jenjang SD & MI", "Jenjang SMP & MTs", "Jenjang SMA & SMK", "Yayasan"];
const itemsPerPage = 6;

export default function SekolahPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [schoolsList, setSchoolsList] = useState<School[]>(schools);
  const [filterTransitioning, setFilterTransitioning] = useState(false);

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

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return;
    setFilterTransitioning(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setCurrentPage(1);
      setFilterTransitioning(false);
    }, 120);
  };

  const filteredSchools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return schoolsList.filter((school) => {
      let matchesFilter = false;
      if (activeFilter === "Semua") {
        matchesFilter = true;
      } else if (activeFilter === "TK") {
        matchesFilter = school.level === "TK" || school.level === "OTHER";
      } else if (activeFilter === "Jenjang SD & MI") {
        matchesFilter = school.level === "SD" || school.level === "MI";
      } else if (activeFilter === "Jenjang SMP & MTs") {
        matchesFilter = school.level === "SMP" || school.level === "MTs";
      } else if (activeFilter === "Jenjang SMA & SMK") {
        matchesFilter = school.level === "SMA" || school.level === "SMK" || school.level === "MA";
      } else if (activeFilter === "Yayasan") {
        matchesFilter = school.type === "yayasan";
      }

      const matchesSearch =
        normalized.length === 0 ||
        school.name.toLowerCase().includes(normalized) ||
        school.address.toLowerCase().includes(normalized);

      return matchesFilter && matchesSearch;
    });
  }, [query, activeFilter, schoolsList]);

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / itemsPerPage));
  const currentItems = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="section-shell py-12 sm:py-16 lg:py-20">
      <SectionHeading
        eyebrow="Direktori Anggota"
        title="Sekolah dan yayasan mitra BMPS Bogor"
        description="Direktori ini berfungsi sebagai kerangka agar data sekolah dan yayasan dapat dikelola dan diverifikasi dengan lebih rapi di tahap berikutnya."
      />

      <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full xl:max-w-md">
          <SearchBar
            value={query}
            onChange={(value) => {
              setQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Cari sekolah atau yayasan..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onClick={() => handleFilterChange(filter)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        {currentItems.length > 0 ? (
          <>
            <div className={`grid gap-6 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-200 ease-out ${filterTransitioning ? "opacity-40" : "opacity-100"}`}>
              {currentItems.map((school) => (
                <SchoolCard key={school.slug} school={school} />
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
            Tidak ada data sekolah atau yayasan yang cocok dengan pencarian saat ini.
          </div>
        )}
      </div>
    </div>
  );
}
