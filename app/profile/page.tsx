import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Lightbulb, 
  Heart, 
  UserRound,
  Compass,
  CheckCircle2
} from "lucide-react";
import { programs } from "@/lib/data/programs";
import VisiMisiSection from "@/components/profile/VisiMisiSection";

// Core Values list
const coreValues = [
  {
    title: "Integritas",
    description: "Mengutamakan transparansi dan akuntabilitas dalam seluruh pelayanan dan kepengurusan organisasi.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    title: "Kolaborasi",
    description: "Membangun sinergi yang kokoh di antara sekolah swasta, yayasan, dan pemerintah daerah.",
    icon: Users,
    color: "text-blue-royal",
    bg: "bg-blue-50",
  },
  {
    title: "Inovasi",
    description: "Mendorong adopsi metode pembelajaran kreatif, kurikulum adaptif, dan transformasi teknologi.",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    title: "Dedikasi",
    description: "Berkomitmen penuh demi peningkatan mutu pendidikan dan pengembangan masa depan generasi penerus.",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

// Timeline list
const timelineEvents = [
  {
    year: "2024",
    title: "Inisiasi & Konsolidasi",
    description: "Penyamaan visi dan pembentukan forum musyawarah awal di antara sekolah swasta sewilayah Bogor.",
  },
  {
    year: "2025",
    title: "Penguatan Jejaring",
    description: "Peningkatan koordinasi yayasan pendidikan dan pendampingan persiapan akreditasi sekolah terpadu.",
  },
  {
    year: "2026",
    title: "Era Baru & Digitalisasi",
    description: "Peluncuran portal web database keanggotaan sekolah dan program peningkatan kompetensi digital.",
  },
];

// Structural schema placeholder for organizational committee
const committeeRoles = [
  { role: "Ketua Umum", title: "Ketua Pengurus Harian" },
  { role: "Wakil Ketua", title: "Koordinator Wilayah Harian" },
  { role: "Sekretaris Umum", title: "Manajemen Administrasi & Legalitas" },
  { role: "Bendahara Umum", title: "Keuangan & Akuntabilitas Anggaran" },
  { role: "Bidang Pendidikan", title: "Peningkatan Kurikulum & Mutu Ajar" },
  { role: "Bidang Kelembagaan", title: "Pendampingan Akreditasi & Izin Operasional" },
  { role: "Bidang Humas & Kerja Sama", title: "Hubungan Antar Lembaga & Kemitraan" },
  { role: "Bidang Pengembangan Program", title: "Workshop & Pengadaan Program Guru" },
];

const misiItems = [
  { id: "01", text: "Menjalin koordinasi dan komunikasi yang aktif antar lembaga pendidikan swasta." },
  { id: "02", text: "Mendorong pengembangan mutu pembelajaran secara kreatif serta manajemen institusi." },
  { id: "03", text: "Mengembangkan program sertifikasi dan kompetensi yang relevan dengan kebutuhan pendidikan." },
  { id: "04", text: "Menjaga semangat kolaboratif untuk mempercepat transformasi pendidikan Bogor." },
];

export const metadata = {

  title: "Tentang Kami - BMPS Bogor",
  description: "Pelajari sejarah, visi, misi, nilai-nilai utama, struktur kepengurusan, dan kontribusi BMPS Bogor dalam mendukung mutu pendidikan sekolah swasta.",
};

export default function ProfilePage() {
  // Select first 3 programs to display as contribution highlight
  const featuredPrograms = programs.slice(0, 3);

  // Gallery images from news/activities
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
      alt: "Pelantikan Pengurus BMPS",
      title: "Kegiatan Pelantikan",
    },
    {
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
      alt: "Workshop Guru Swasta",
      title: "Workshop Kompetensi",
    },
    {
      src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
      alt: "Penyaluran Bantuan Pendidikan",
      title: "Penyaluran Beasiswa",
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
      alt: "Rapat Kerja Koordinasi",
      title: "Rapat Anggota Tahunan",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. HERO / INTRO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 lg:py-40">
        <Image 
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop" 
          alt="Latar Belakang Pendidikan BMPS" 
          fill 
          priority 
          sizes="100vw" 
          className="object-cover object-center opacity-25" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40" />
        
        <div className="section-shell relative z-10 text-center text-white animate-fade-in-up">
          <span className="font-ui text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            
          </span>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tentang BMPS Bogor
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
            Badan Musyawarah Perguruan Swasta (BMPS) Bogor berkomitmen menjadi ruang kolaborasi, 
            penghubung strategis, dan penggerak mutu sekolah swasta demi mencetak generasi unggul.
          </p>
        </div>
      </section>

      {/* 2. SEKILAS TENTANG BMPS BOGOR */}
      <section className="section-shell py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Text content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">
              
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
              Wadah Kolaborasi Pendidikan Swasta Terpadu di Bogor
            </h2>
            <div className="h-1 w-20 bg-blue-royal rounded" aria-hidden="true" />
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              BMPS Bogor hadir sebagai organisasi musyawarah dan kerja sama bagi penyelenggara, 
              yayasan, serta pengelola perguruan swasta di wilayah Bogor. Kami memfasilitasi 
              berbagai program penguatan kapasitas guru, peningkatan sarana manajemen sekolah, 
              dan pendampingan akreditasi.
            </p>
            <p className="text-base leading-8 text-slate-600">
              Dengan berfokus pada kemandirian dan relevansi kurikulum, kami menjembatani komunikasi 
              terpadu dengan pemerintah daerah untuk mengaspirasikan kebutuhan sekolah swasta secara resmi.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/kontak" 
                className="font-display inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-royal"
              >
                Hubungi Pengurus
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/daftar-sekolah" 
                className="font-display inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Masukan Data Sekolah/Yayasan ke BMPS
              </Link>
            </div>
          </div>

          {/* Right Statistics Card */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-light text-blue-royal">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-deep">4+ Program</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Kontribusi Utama</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-deep">Aktif & Resmi</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Status Organisasi</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-deep">2026 - 2030</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Masa Kepengurusan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISI & MISI (Animated Editorial Reveal) */}
      <VisiMisiSection misiItems={misiItems} />


      {/* 4. NILAI / CORE VALUES */}
      <section className="section-shell py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">
            
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
            Nilai-Nilai Utama
          </h2>
          <p className="text-sm leading-relaxed text-slate-500">
            Pilar dasar karakter organisasi dalam melayani sekolah dan yayasan keanggotaan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value) => {
            const IconComponent = value.icon;
            return (
              <div 
                key={value.title} 
                className="soft-panel p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${value.bg} ${value.color}`}>
                    <IconComponent className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-display mt-5 text-lg font-bold text-navy-deep">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-500">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PROFIL / PERJALANAN ORGANISASI */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-20 lg:py-24">
        <div className="section-shell">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">
              
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
              Perjalanan BMPS Bogor
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Transformasi program kerja nyata untuk penguatan sekolah swasta di daerah Bogor.
            </p>
          </div>

          {/* Timeline component: horizontal on MD+, vertical on mobile */}
          <div className="relative mt-8">
            {/* Center Line for desktop */}
            <div className="absolute top-1/2 left-0 right-0 hidden h-0.5 -translate-y-1/2 bg-slate-200 md:block" aria-hidden="true" />
            
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 relative z-10">
              {timelineEvents.map((event, idx) => (
                <div key={event.year} className="relative bg-white md:text-center p-4 rounded-2xl">
                  {/* Point node marker */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-royal text-white font-bold text-sm mx-auto md:mb-5 shadow-md">
                    {idx + 1}
                  </div>

                  <div className="mt-4 md:mt-0 space-y-2">
                    <span className="font-display text-2xl font-extrabold text-blue-royal block">
                      {event.year}
                    </span>
                    <h3 className="font-display text-lg font-bold text-navy-deep">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-500 max-w-sm mx-auto">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROGRAM / KONTRIBUSI */}
      <section className="section-shell py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">
            
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
            Kontribusi & Program Utama
          </h2>
          <p className="text-sm leading-relaxed text-slate-500">
            Daftar program resmi yang berjalan aktif di lingkungan sekolah dan yayasan swasta.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms.map((program) => (
            <Link 
              key={program.slug} 
              href={`/program/${program.slug}`}
              className="soft-panel overflow-hidden p-0 group flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image 
                    src={program.image} 
                    alt={program.title} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-display rounded-full bg-navy/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {program.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-lg font-bold text-navy-deep group-hover:text-blue-royal transition-colors leading-snug">
                    {program.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-3">
                    {program.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center gap-2 text-xs font-bold text-blue-royal">
                <span>Lihat Detail Program</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. GALERI / AKTIVITAS */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-20 lg:py-24">
        <div className="section-shell">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">
              
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
              Aktivitas BMPS Bogor
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Galeri dokumentasi kegiatan pelatihan, koordinasi, dan pengembangan kompetensi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl group border border-slate-100 shadow-sm bg-slate-50">
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs font-bold text-white tracking-wide">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TIM / PENGURUS */}
      <section id="pengurus" className="section-shell py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">
            
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
            Struktur Pengurus
          </h2>
          <p className="text-sm leading-relaxed text-slate-500">
            Kerangka organisasi kepengurusan BMPS Daerah Bogor Periode Harian 2026-2030.
          </p>
        </div>

        {/* Warning Badge: Sedang Dalam Proses Penetapan */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-center text-sm text-slate-600 mb-10">
          ⚠️ <strong>Informasi Keanggotaan:</strong> Nama-nama pengurus resmi sedang dalam tahap penetapan administratif berkala. Struktur di bawah ini menggambarkan pembagian tanggung jawab resmi organisasi.
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {committeeRoles.map((role) => (
            <div 
              key={role.role} 
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center flex flex-col items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-navy-deep">
                  {role.role}
                </h3>
                <p className="mt-1 text-xs text-slate-400 font-semibold">
                  {role.title}
                </p>
              </div>
              <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Akan Ditetapkan
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CTA BANNER */}
      <section className="section-shell pb-16 sm:pb-20 lg:pb-24">
        <div className="relative rounded-[32px] bg-gradient-to-b from-[#102b6b] to-[#0b1f4d] py-16 px-6 sm:px-12 text-center text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 h-80 w-80 bg-white/5 rounded-full blur-3xl" aria-hidden="true" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Bersama Membangun Pendidikan Bogor
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-300">
              Bergabunglah bersama ratusan sekolah dan yayasan swasta se-Bogor. Mari bersinergi membangun manajemen, kompetensi, dan masa depan mutu sekolah yang lebih mandiri.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link 
                href="/daftar-sekolah" 
                className="font-display inline-flex h-[48px] items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-navy-deep transition hover:bg-slate-100"
              >
                Masukan Data Sekolah/Yayasan ke BMPS
              </Link>
              <Link 
                href="/kontak" 
                className="font-display inline-flex h-[48px] items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/25"
              >
                Hubungi Kami
              </Link>
              <Link 
                href="/program" 
                className="font-display inline-flex h-[48px] items-center justify-center rounded-xl text-sm font-bold text-white underline underline-offset-4 transition hover:text-slate-300 px-3"
              >
                Lihat Semua Program
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
