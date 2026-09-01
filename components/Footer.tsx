import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe } from "lucide-react";

const aboutLinks = [
  { label: "Profil BMPS", href: "/profile" },
  { label: "Visi & Misi", href: "/profile#visi-misi" },
  { label: "Struktur Organisasi", href: "/profile#struktur-organisasi" },
  { label: "Pengurus", href: "/profile#pengurus" },
];

const infoLinks = [
  { label: "Program", href: "/program" },
  { label: "Berita & Kegiatan", href: "/berita" },
  { label: "Pelatihan", href: "/pelatihan" },
  { label: "Agenda", href: "/berita" },
];

const serviceLinks = [
  { label: "Direktori Sekolah & Yayasan", href: "/sekolah" },
  { label: "Koordinasi Pendidikan", href: "/profile" },
  { label: "Hubungi BMPS", href: "/kontak" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-deep text-slate-300 border-t border-slate-900 overflow-hidden">
      {/* Subtle top decoration light bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-royal via-blue-500 to-blue-royal/20 opacity-80" aria-hidden="true" />
      
      <div className="section-shell py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Identity Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 p-1.5 transition-all duration-300 group-hover:bg-white/20">
                <Image 
                  src="/logo.png" 
                  alt="Logo BMPS" 
                  width={40} 
                  height={40} 
                  className="h-full w-full object-contain" 
                  priority 
                  unoptimized 
                />
              </span>
              <span className="leading-none text-white">
                <span className="font-display block text-base font-bold tracking-[0.12em] sm:text-lg">BMPS</span>
                <span className="mt-0.5 block text-[0.54rem] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:text-[0.6rem]">Bogor</span>
              </span>
            </Link>
            
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Badan Musyawarah Perguruan Swasta (BMPS) Daerah Bogor menjadi wadah 
              koordinasi, komunikasi, dan penguatan mutu pendidikan swasta yang unggul 
              dan kolaboratif di wilayah Bogor.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link 
                href="/daftar-sekolah" 
                className="btn-editorial font-display inline-flex h-[44px] items-center justify-center rounded-xl bg-white px-5 text-xs font-bold text-navy-deep shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy-deep"
              >
                Masukan Data Sekolah/Yayasan ke BMPS
              </Link>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3.5 pt-2">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white" aria-label="Facebook BMPS Bogor">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white" aria-label="Instagram BMPS Bogor">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white" aria-label="YouTube BMPS Bogor">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white" aria-label="Website BMPS Bogor">
                <Globe className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <FooterColumn title="Tentang BMPS" links={aboutLinks} />
          <FooterColumn title="Informasi" links={infoLinks} />
          <FooterColumn title="Layanan" links={serviceLinks} />

          {/* Contact Details Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Kontak Resmi
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-400" />
                <span>Alamat resmi belum tersedia.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 shrink-0 text-blue-400" />
                <span>Nomor resmi belum tersedia.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 shrink-0 text-blue-400" />
                <span>Email resmi belum tersedia.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-14 border-t border-white/10 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <div>
            © {currentYear} BMPS Bogor. All rights reserved.
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
        {title}
      </h4>
      <ul className="mt-5 space-y-3.5 text-sm text-slate-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-white focus:outline-none focus:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}