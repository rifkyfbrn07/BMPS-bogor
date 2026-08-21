import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Users, BriefcaseBusiness } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const profilePillars = [
  {
    title: "Visi & Misi",
    text: "Menguatkan pendidikan swasta melalui arah pengembangan yang unggul, relevan, dan kolaboratif.",
    icon: Building2,
  },
  {
    title: "Peran BMPS",
    text: "Menjadi wadah koordinasi dan penghubung strategis bagi sekolah serta yayasan pendidikan swasta.",
    icon: Users,
  },
  {
    title: "Kolaborasi",
    text: "Mendorong komunikasi, sinergi, dan penguatan mutu pendidikan swasta di wilayah Bogor.",
    icon: BriefcaseBusiness,
  },
];

export default function ProfilePage() {
  return (
    <div className="bg-[#f7f9fc]">
      <section className="relative -mt-[80px] overflow-hidden bg-slate-900 pt-[80px]">
        <div className="relative flex aspect-[16/10] w-full items-center justify-center sm:aspect-[2/1] lg:aspect-[2.35/1]">
          <Image src="/profile.png" alt="Kegiatan BMPS Bogor" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-slate-950/10" />
          <div className="section-shell relative z-10 flex w-full justify-center text-center text-white">
            <div className="w-fit max-w-full">
              <h1 className="font-display max-w-full text-[clamp(1.625rem,4.5vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
                <span className="block">Wadah Strategis Untuk</span>
                <span className="block">Pendidikan Swasta Bogor</span>
              </h1>
              <div className="mx-auto mt-6 h-px w-full max-w-full bg-white/60" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16 lg:py-20">
        <div className="max-w-[950px]">
          <p className="font-ui text-lg leading-[1.7] text-slate-600 sm:text-xl">
          BMPS Bogor adalah forum musyawarah pendidikan swasta yang berperan
          sebagai penghubung strategis bagi sekolah dan yayasan di wilayah Bogor.
          Organisasi ini menjadi ruang kolaborasi untuk membahas penguatan mutu,
          pengembangan program, serta kebutuhan bersama dalam rangka menjaga dan
          meningkatkan kualitas pendidikan swasta.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {profilePillars.map(({ title, text, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_rgba(15,35,80,0.04)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-light text-blue-royal">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display mt-5 text-xl font-semibold text-navy-deep">{title}</h3>
            <p className="font-ui mt-3 text-sm leading-7 text-slate-600">{text}</p>
          </div>
        ))}
        </div>

      <div id="visi-misi" className="mt-20 border-t border-slate-200/80 pt-16 sm:mt-24 sm:pt-20">
        <section className="mx-auto max-w-[760px] text-center">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Arah BMPS</p>
          <h2 className="font-display mt-3 text-3xl font-semibold leading-tight tracking-[-0.025em] text-navy-deep sm:text-4xl">Visi</h2>
          <div className="mx-auto mt-5 h-px w-32 bg-[var(--brand-primary)]/35" aria-hidden="true" />
          <p className="font-ui mt-7 text-lg leading-[1.75] text-slate-600 sm:text-xl">
            Membangun pendidikan swasta yang unggul, relevan, dan berdaya saing.
            <span className="mt-3 block text-base leading-7 text-slate-500 sm:text-lg">
              Visi ini menjadi arah utama dalam membangun ekosistem pendidikan yang kuat,
              kolaboratif, dan siap menghadapi tantangan masa depan.
            </span>
          </p>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Arah Strategis</p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight tracking-[-0.025em] text-navy-deep sm:text-4xl">Misi</h2>
            <p className="font-ui mx-auto mt-5 max-w-[680px] text-base leading-7 text-slate-500 sm:text-lg">
              Menguatkan kapasitas lembaga, guru, dan jejaring pendidikan swasta.
            </p>
          </div>

          <ol className="mx-auto mt-10 grid max-w-[980px] gap-4 md:grid-cols-2">
            <li className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,35,80,0.035)] sm:p-6">
              <span className="font-display text-lg font-semibold text-[var(--brand-primary)]">01</span>
              <span className="font-ui pt-0.5 text-sm leading-7 text-slate-600 sm:text-base">Menjalin koordinasi dan komunikasi antar lembaga pendidikan swasta.</span>
            </li>
            <li className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,35,80,0.035)] sm:p-6">
              <span className="font-display text-lg font-semibold text-[var(--brand-primary)]">02</span>
              <span className="font-ui pt-0.5 text-sm leading-7 text-slate-600 sm:text-base">Mendorong pengembangan mutu pembelajaran dan manajemen institusi.</span>
            </li>
            <li className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,35,80,0.035)] sm:p-6">
              <span className="font-display text-lg font-semibold text-[var(--brand-primary)]">03</span>
              <span className="font-ui pt-0.5 text-sm leading-7 text-slate-600 sm:text-base">Mengembangkan program yang relevan dengan kebutuhan pendidikan saat ini.</span>
            </li>
            <li className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,35,80,0.035)] sm:p-6">
              <span className="font-display text-lg font-semibold text-[var(--brand-primary)]">04</span>
              <span className="font-ui pt-0.5 text-sm leading-7 text-slate-600 sm:text-base">Menjaga semangat kolaborasi untuk masa depan pendidikan Bogor.</span>
            </li>
          </ol>
        </section>
      </div>

      <div id="struktur-organisasi" className="mt-16">
        <SectionHeading
          eyebrow="Struktur Organisasi"
          title="Kerangka organisasi yang dapat dikembangkan sesuai kebutuhan resmi"
          description="Struktur organisasi BMPS akan diperbarui sesuai data resmi yang valid dan ditetapkan oleh lembaga terkait."
        />

        <div className="mt-8 soft-panel bg-slate-50 p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Ketua",
              "Wakil Ketua",
              "Sekretaris",
              "Bendahara",
              "Bidang Pendidikan",
              "Bidang Kelembagaan",
              "Bidang Hubungan Masyarakat",
              "Bidang Pengembangan Program",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-medium text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="pengurus" className="mt-16">
        <SectionHeading
          eyebrow="Pengurus"
          title="Data pengurus akan ditampilkan setelah validasi resmi tersedia"
          description="Untuk menjaga akurasi dan kredibilitas, informasi nama pengurus belum dipublikasikan dalam tahap prototype ini."
        />
        <div className="mt-8 soft-panel p-8 text-slate-600">
          Placeholder pengurus dapat diisi dengan struktur kepengurusan resmi BMPS
          ketika data final diterima dari pihak berwenang.
        </div>
      </div>

      <div className="mt-14 flex justify-start">
        <Link
          href="/kontak"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-royal"
        >
          Hubungi BMPS
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
    </div>
  );
}
