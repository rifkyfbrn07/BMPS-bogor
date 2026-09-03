import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RegistrationForm from "@/components/RegistrationForm";
import RegistrationStatusForm from "@/components/RegistrationStatusForm";

export const metadata = {
  title: "Pendaftaran Sekolah/Yayasan - BMPS Bogor",
  description: "Formulir pendaftaran resmi sekolah dan yayasan ke Badan Musyawarah Perguruan Swasta (BMPS) Bogor.",
};

export default function SchoolRegistrationPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* 1. Tombol Kembali ke Beranda */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#172554] shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-[#1B2CC1]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Kembali ke beranda</span>
          </Link>
        </div>

        {/* 2. Header Form dengan Ilustrasi 3D */}
        <div className="mb-8 sm:mb-10 rounded-[20px] border border-[#E5E7EB] bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Sisi Kiri: Teks Header (~60%) */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center rounded-full border border-[#D0E1FD] bg-[#EAF2FF] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#1B5DBF]">
                PENDAFTARAN LEMBAGA
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0F1F4A] sm:text-3xl lg:text-4xl">
                Masukan Data Sekolah/Yayasan ke BMPS
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Lengkapi data lembaga Anda. Formulir ini divalidasi langsung dan akan diperiksa oleh admin BMPS Bogor.
              </p>
            </div>

            {/* Sisi Kanan: Ilustrasi 3D (~40%) */}
            <div className="flex items-center justify-center lg:col-span-5">
              <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px]">
                <Image
                  src="/school-registration-illustration.png"
                  alt="Ilustrasi pendaftaran sekolah ke BMPS"
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 300px"
                  className="object-contain drop-shadow-md"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Formulir Pendaftaran */}
        <RegistrationForm />

        {/* 4. Cek Status Pendaftaran */}
        <div className="mt-8 sm:mt-10">
          <RegistrationStatusForm />
        </div>
      </div>
    </div>
  );
}
