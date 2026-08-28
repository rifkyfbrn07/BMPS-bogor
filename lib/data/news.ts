import type { NewsItem } from "@/lib/types";

export const news: NewsItem[] = [
  {
    slug: "pelantikan-pengurus-bmps-2026",
    title: "Pelantikan Pengurus BMPS Bogor Periode 2026-2030",
    category: "Kegiatan",
    date: "2026-06-12",
    image:
      "/news/news2.png",
    excerpt:
      "BMPS Bogor resmi melantik pengurus baru periode 2026-2030 dengan komitmen memperkuat pendidikan swasta di Bogor.",
    content:
      "Pelantikan pengurus BMPS Bogor periode 2026-2030 berlangsung khidmat dan dihadiri oleh perwakilan sekolah dan yayasan se-Bogor. Ketua terpilih menyampaikan visi penguatan mutu pendidikan swasta melalui kolaborasi lintas sekolah.",
    views: 1240,
    tab: "terpopuler",
  },
  {
    slug: "workshop-kurikulum-merdeka",
    title: "Workshop Implementasi Kurikulum Merdeka untuk Guru Swasta",
    category: "Pelatihan",
    date: "2026-05-28",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Ratusan guru sekolah swasta mengikuti workshop implementasi Kurikulum Merdeka yang diselenggarakan BMPS Bogor.",
    content:
      "Workshop ini bertujuan meningkatkan pemahaman guru terhadap prinsip pembelajaran berdiferensiasi dan asesmen dalam Kurikulum Merdeka, dengan narasumber praktisi pendidikan berpengalaman.",
    views: 980,
    tab: "terpopuler",
  },
  {
    slug: "penyaluran-beasiswa-2026",
    title: "Penyaluran Beasiswa Pendidikan Tahap Pertama 2026",
    category: "Beasiswa",
    date: "2026-07-05",
    image:
      "/news/news1.png",
    excerpt:
      "BMPS Bogor menyalurkan bantuan beasiswa pendidikan tahap pertama kepada 150 siswa dari sekolah anggota.",
    content:
      "Penyaluran beasiswa dilakukan secara simbolis di kantor sekretariat BMPS Bogor, diikuti oleh perwakilan siswa penerima dari berbagai jenjang pendidikan.",
    views: 754,
    tab: "terbaru",
  },
  {
    slug: "kerjasama-akreditasi-sekolah",
    title: "BMPS Bogor Jalin Kerja Sama Pendampingan Akreditasi",
    category: "Kemitraan",
    date: "2026-04-18",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Kerja sama pendampingan akreditasi ditandatangani untuk membantu sekolah swasta meningkatkan status akreditasinya.",
    content:
      "Melalui kerja sama ini, sekolah-sekolah anggota BMPS Bogor akan mendapatkan pendampingan intensif dalam mempersiapkan dokumen dan simulasi visitasi akreditasi.",
    views: 512,
    tab: "terbaru",
  },
  {
    slug: "rapat-koordinasi-pengurus",
    title: "Rapat Koordinasi Pengurus dan Kepala Sekolah Anggota",
    category: "Organisasi",
    date: "2026-03-02",
    image:
      "https://images.unsplash.com/photo-1503424886307-b090341d25d1?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Rapat koordinasi membahas program kerja tahunan dan evaluasi capaian BMPS Bogor triwulan pertama.",
    content:
      "Rapat ini menjadi forum evaluasi dan penyusunan strategi program kerja BMPS Bogor untuk periode mendatang, dengan melibatkan seluruh kepala sekolah anggota.",
    views: 398,
    tab: "terkait",
  },
];

export function getNewsBySlug(slug: string) {
  return news.find((item) => item.slug === slug);
}
