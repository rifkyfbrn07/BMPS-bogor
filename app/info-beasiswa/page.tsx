"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProgramSchoolCard from "@/components/ProgramSchoolCard";
import SectionHeading from "@/components/SectionHeading";
import type { School } from "@/lib/types";

export default function InfoBeasiswaPage() {
  const [programSchools, setProgramSchools] = useState<School[]>([]);

  useEffect(() => {
    // Sekolah/yayasan APPROVED yang mendaftar program Informasi Beasiswa.
    fetch("/api/content/schools?program=BEASISWA")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) setProgramSchools(data.data);
      })
      .catch((err) => console.error("Gagal memuat sekolah peserta beasiswa:", err));
  }, []);

  return (
    <div className="section-shell w-full max-w-full overflow-x-clip py-8 sm:py-16 lg:py-20">
      <SectionHeading
        eyebrow=""
        title="Sekolah & Yayasan Peserta Informasi Beasiswa"
        description="Daftar sekolah dan yayasan terverifikasi BMPS Bogor yang mengikuti program Informasi Beasiswa, diurutkan dari yang paling baru disetujui."
      />

      {programSchools.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {programSchools.map((school) => (
            <ProgramSchoolCard key={school.slug} school={school} />
          ))}
        </div>
      ) : (
        <div className="soft-panel mt-8 p-8 text-center text-slate-600">
          Belum ada sekolah atau yayasan terdaftar pada program Informasi Beasiswa.
        </div>
      )}

      <div className="mt-14 sm:mt-16">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#0b1e3d] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Sekolah/Yayasan Anda belum terdaftar?
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base">
              Masukkan data sekolah atau yayasan Anda ke BMPS Bogor untuk mengikuti program Informasi Beasiswa dan program lainnya.
            </p>
            <Link
              href="/daftar-sekolah"
              className="font-display mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition-all duration-200 hover:-translate-y-px hover:bg-slate-100"
            >
              Masukan Data Sekolah/Yayasan ke BMPS
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}