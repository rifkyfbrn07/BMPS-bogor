import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import RegistrationForm from "@/components/RegistrationForm";

export default function ContactPage() {
  return (
    <div className="section-shell py-12 sm:py-16 lg:py-20">
      <SectionHeading
        eyebrow="Kontak"
        title="Hubungi BMPS Bogor"
        description="Untuk koordinasi, pertanyaan, atau kerja sama, silakan gunakan kanal berikut sesuai kebutuhan resmi yang akan ditetapkan kemudian."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <RegistrationForm />
        <div className="space-y-6">
        <div className="soft-panel p-5 sm:p-8">
          <div className="space-y-5 text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-blue-royal" />
              <div>
                <p className="font-semibold text-navy-deep">Alamat</p>
                <p className="mt-1">Alamat resmi belum tersedia.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-blue-royal" />
              <div>
                <p className="font-semibold text-navy-deep">Nomor telepon</p>
                <p className="mt-1">Nomor resmi belum tersedia.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-blue-royal" />
              <div>
                <p className="font-semibold text-navy-deep">Email</p>
                <p className="mt-1">Email resmi belum tersedia.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="soft-panel bg-slate-50 p-5 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">
            Informasi tambahan
          </p>
          <h3 className="mt-4 text-2xl font-bold text-navy-deep">
            Memperkuat komunikasi menuju pendidikan swasta yang lebih terstruktur.
          </h3>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Halaman kontak ini dirancang agar mudah diganti saat data resmi BMPS sudah tersedia.
            Format ini menjaga kredibilitas dan mencegah informasi yang belum divalidasi muncul sebagai data resmi.
          </p>
          <Link
            href="/profile"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-royal"
          >
            Kenali BMPS
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
