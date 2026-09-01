import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  Building2,
  CheckCircle2,
  ExternalLink,
  Eye,
  Globe,
  GraduationCap,
  Landmark,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";
import { getPublicSchoolProfile, type PublicSchoolProfile } from "@/lib/services/school-directory";
import {
  buildFacebookLink,
  buildInstagramLink,
  buildTikTokLink,
  buildWhatsAppLink,
  buildYouTubeLink,
  institutionTypeLabel,
  PROGRAM_LABELS,
  schoolLevelLabel,
} from "@/lib/school-labels";

// Direktori sekolah harus selalu menampilkan keputusan approval terbaru,
// sehingga halaman ini dirender dinamis di setiap permintaan.
export const dynamic = "force-dynamic";

const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicSchoolProfile(slug);
  if (!profile) return { title: "Sekolah tidak ditemukan | BMPS Bogor" };

  const description =
    (profile.description ?? `Profil ${profile.name}, lembaga pendidikan terdaftar di BMPS Bogor.`).slice(0, 180);
  const image = profile.photoUrl ?? profile.logoUrl;

  return {
    title: `${profile.name} | BMPS Bogor`,
    description,
    openGraph: {
      title: `${profile.name} | BMPS Bogor`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:gap-4">
      <dt className="w-full shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400 sm:w-44">
        {label}
      </dt>
      <dd className="min-w-0 whitespace-pre-line break-words text-sm font-medium leading-6 text-slate-700">
        {value}
      </dd>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 sm:px-6">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue-royal">
          {icon}
        </span>
        <h2 className="text-base font-bold text-navy-deep sm:text-lg">{title}</h2>
      </div>
      <div className="w-full min-w-0 px-5 py-4 sm:px-6 sm:py-5">{children}</div>
    </section>
  );
}

const CONTACT_LINK_CLASS =
  "btn-editorial flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-royal hover:text-blue-royal";

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile: PublicSchoolProfile | null = await getPublicSchoolProfile(slug);
  if (!profile) notFound();

  const institutionLabel = institutionTypeLabel(profile.institutionType) ?? "Lembaga Pendidikan";
  const heroImage = profile.photoUrl ?? profile.logoUrl ?? HERO_FALLBACK_IMAGE;
  const whatsappLink = buildWhatsAppLink(profile.whatsapp || profile.phone);
  const instagramLink = buildInstagramLink(profile.instagram);
  const facebookLink = buildFacebookLink(profile.facebook);
  const youtubeLink = buildYouTubeLink(profile.youtube);
  const tiktokLink = buildTikTokLink(profile.tiktok);

  const locationLine = [profile.district, profile.city].filter(Boolean).join(", ");
  const hasContact = Boolean(whatsappLink || profile.email || profile.website || profile.phone || instagramLink || facebookLink || youtubeLink || tiktokLink);
  const hasCta = Boolean(profile.registrationUrl || profile.website || whatsappLink || profile.email);

  return (
    <div className="section-shell w-full max-w-full overflow-x-clip py-10 sm:py-14 lg:py-16">
      <Link
        href="/sekolah"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-royal transition hover:text-navy-deep"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Direktori
      </Link>

      {/* ============ HERO ============ */}
      <div className="mt-6 w-full max-w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm sm:mt-8 sm:rounded-[32px]">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/8] lg:aspect-[16/6]">
          <Image
            src={heroImage}
            alt={`Foto ${profile.name}`}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/5 to-transparent" aria-hidden="true" />
          {profile.isVerifiedMember && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700 backdrop-blur sm:right-4 sm:top-4 sm:text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Terdaftar di BMPS Bogor
            </span>
          )}
        </div>

        <div className="w-full min-w-0 p-5 sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-royal">Profil Sekolah</p>
          <h1 className="mt-2 break-words text-2xl font-bold leading-tight tracking-tight text-navy-deep sm:text-3xl lg:text-4xl">
            {profile.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-light px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-blue-royal">
              {schoolLevelLabel(profile.level)}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              {institutionLabel}
            </span>
            {profile.npsn && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                NPSN {profile.npsn}
              </span>
            )}
          </div>

          {locationLine && (
            <p className="mt-4 flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-royal" aria-hidden="true" />
              <span className="min-w-0 break-words">{locationLine}</span>
            </p>
          )}

          {hasCta && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {profile.registrationUrl && (
                <a
                  href={profile.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-royal sm:w-auto"
                >
                  Daftar ke Sekolah
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Hubungi via WhatsApp
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-navy-deep transition hover:bg-blue-light sm:w-auto"
                >
                  <Globe className="h-4 w-4 text-blue-royal" aria-hidden="true" />
                  Kunjungi Website
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-editorial inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-navy-deep transition hover:bg-blue-light sm:w-auto"
                >
                  <Mail className="h-4 w-4 text-blue-royal" aria-hidden="true" />
                  Kirim Email
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ KONTEN UTAMA ============ */}
      <div className="mt-8 grid w-full max-w-full gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        {/* ---- Kolom kiri: profil & lokasi ---- */}
        <div className="min-w-0 space-y-6">
          {profile.description && (
            <SectionCard title="Tentang Sekolah" icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}>
              <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                {profile.description}
              </p>
            </SectionCard>
          )}

          {profile.vision && (
            <SectionCard title="Visi" icon={<Eye className="h-4 w-4" aria-hidden="true" />}>
              <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                {profile.vision}
              </p>
            </SectionCard>
          )}

          {profile.mission && (
            <SectionCard title="Misi" icon={<ListChecks className="h-4 w-4" aria-hidden="true" />}>
              <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                {profile.mission}
              </p>
            </SectionCard>
          )}

          {profile.programs.length > 0 && (
            <SectionCard title="Program BMPS" icon={<Award className="h-4 w-4" aria-hidden="true" />}>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {profile.programs.map((program) => (
                  <li
                    key={program}
                    className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span className="text-sm font-semibold text-navy-deep">
                      {PROGRAM_LABELS[program] ?? program}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Program yang diikuti lembaga ini sesuai pilihan saat pendaftaran dan telah diverifikasi admin BMPS Bogor.
              </p>
            </SectionCard>
          )}

          {(profile.address || profile.ward || profile.district || profile.city || profile.province || profile.postalCode) && (
            <SectionCard title="Lokasi Sekolah" icon={<MapPin className="h-4 w-4" aria-hidden="true" />}>
              <dl className="divide-y divide-slate-100">
                {profile.address && <DetailRow label="Alamat lengkap" value={profile.address} />}
                {profile.ward && <DetailRow label="Desa/Kelurahan" value={profile.ward} />}
                {profile.district && <DetailRow label="Kecamatan" value={profile.district} />}
                {profile.city && <DetailRow label="Kabupaten/Kota" value={profile.city} />}
                {profile.province && <DetailRow label="Provinsi" value={profile.province} />}
                {profile.postalCode && <DetailRow label="Kode Pos" value={profile.postalCode} />}
              </dl>
              {profile.googleMapsUrl && (
                <a
                  href={profile.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-royal transition hover:text-navy-deep"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Lihat Lokasi di Google Maps
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </SectionCard>
          )}
        </div>

        {/* ---- Kolom kanan: informasi ringkas ---- */}
        <div className="min-w-0 space-y-6">
          <SectionCard title="Informasi Sekolah" icon={<Building2 className="h-4 w-4" aria-hidden="true" />}>
            <dl className="divide-y divide-slate-100">
              <DetailRow label="Nama" value={profile.name} />
              {profile.npsn && <DetailRow label="NPSN" value={profile.npsn} />}
              <DetailRow label="Jenis lembaga" value={institutionLabel} />
              <DetailRow label="Jenjang" value={schoolLevelLabel(profile.level)} />
              {profile.foundationName && <DetailRow label="Yayasan" value={profile.foundationName} />}
              {profile.principalName && <DetailRow label="Kepala sekolah" value={profile.principalName} />}
            </dl>
          </SectionCard>

          {(profile.institutionType === "YAYASAN" || profile.foundationName) && (
            <SectionCard title="Informasi Yayasan" icon={<Landmark className="h-4 w-4" aria-hidden="true" />}>
              <dl className="divide-y divide-slate-100">
                {profile.foundationName && <DetailRow label="Nama yayasan" value={profile.foundationName} />}
                {profile.institutionType === "YAYASAN" && profile.principalName && (
                  <DetailRow label="Pimpinan" value={profile.principalName} />
                )}
                {profile.foundationAddress && <DetailRow label="Alamat yayasan" value={profile.foundationAddress} />}
                {profile.foundationPhone && <DetailRow label="Telepon" value={profile.foundationPhone} />}
                {profile.foundationEmail && <DetailRow label="Email" value={profile.foundationEmail} />}
              </dl>
            </SectionCard>
          )}

          {(profile.picName || profile.picRole) && (
            <SectionCard title="Informasi Penanggung Jawab" icon={<UserRound className="h-4 w-4" aria-hidden="true" />}>
              <dl className="divide-y divide-slate-100">
                {profile.picName && <DetailRow label="Nama" value={profile.picName} />}
                {profile.picRole && <DetailRow label="Jabatan" value={profile.picRole} />}
              </dl>
            </SectionCard>
          )}

          {/* Social Media & WhatsApp Interactive Section */}
          {hasContact && (
            <SectionCard title="Kontak & Media Sosial" icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}>
              <div className="flex flex-col gap-2.5">
                {whatsappLink && (
                  <a className="btn-editorial flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-2.5">
                      <WhatsAppIcon className="h-5 w-5 shrink-0 text-emerald-600" />
                      <span className="min-w-0 break-words">WhatsApp Resmi</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Chat &rarr;</span>
                  </a>
                )}
                {instagramLink && (
                  <a className="btn-editorial flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 text-sm font-semibold text-pink-800 transition hover:border-pink-300" href={instagramLink} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-2.5">
                      <InstagramIcon className="h-5 w-5 shrink-0 text-pink-600" />
                      <span className="min-w-0 break-words">Instagram</span>
                    </span>
                    <ExternalLink className="h-4 w-4 text-pink-500" aria-hidden="true" />
                  </a>
                )}
                {facebookLink && (
                  <a className={CONTACT_LINK_CLASS} href={facebookLink} target="_blank" rel="noopener noreferrer">
                    <FacebookIcon className="h-5 w-5 shrink-0 text-blue-600" />
                    <span className="min-w-0 break-words">Facebook</span>
                  </a>
                )}
                {youtubeLink && (
                  <a className={CONTACT_LINK_CLASS} href={youtubeLink} target="_blank" rel="noopener noreferrer">
                    <YoutubeIcon className="h-5 w-5 shrink-0 text-red-600" />
                    <span className="min-w-0 break-words">YouTube Channel</span>
                  </a>
                )}
                {tiktokLink && (
                  <a className={CONTACT_LINK_CLASS} href={tiktokLink} target="_blank" rel="noopener noreferrer">
                    <TikTokIcon className="h-5 w-5 shrink-0 text-slate-800" />
                    <span className="min-w-0 break-words">TikTok</span>
                  </a>
                )}
                {profile.phone && !whatsappLink && (
                  <a className={CONTACT_LINK_CLASS} href={`tel:${profile.phone}`}>
                    <Phone className="h-4 w-4 shrink-0 text-blue-royal" aria-hidden="true" />
                    <span className="min-w-0 break-words">{profile.phone}</span>
                  </a>
                )}
                {profile.email && (
                  <a className={CONTACT_LINK_CLASS} href={`mailto:${profile.email}`}>
                    <Mail className="h-4 w-4 shrink-0 text-blue-royal" aria-hidden="true" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">{profile.email}</span>
                  </a>
                )}
                {profile.website && (
                  <a className={CONTACT_LINK_CLASS} href={profile.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 shrink-0 text-blue-royal" aria-hidden="true" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">{profile.website}</span>
                  </a>
                )}
              </div>
            </SectionCard>
          )}

          <div className="rounded-[24px] border border-blue-royal/15 bg-blue-light/50 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-royal">Status Keanggotaan</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {profile.isVerifiedMember
                ? "Lembaga ini telah diverifikasi dan disetujui oleh admin BMPS Daerah Bogor sebagai anggota resmi."
                : "Data lembaga ini masih berupa data contoh direktori BMPS Bogor."}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

