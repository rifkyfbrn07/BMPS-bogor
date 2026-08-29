import { prisma } from "@/lib/prisma";
import { getSchoolBySlug } from "@/lib/data/schools";
import type { SchoolLevel } from "@/generated/prisma/client";
import type { PublicSchoolProgram } from "@/lib/school-labels";

export type { PublicSchoolProgram };

/**
 * Profil publik sekolah/yayasan untuk halaman /sekolah/[slug].
 *
 * Sumber data: SchoolRegistration berstatus APPROVED (data formulir pendaftaran
 * publik) yang dipadukan dengan record School dibuat saat approval. Profil ini
 * TIDAK pernah diambil dari pendaftaran PENDING/UNDER_REVIEW/REJECTED — filter
 * status dilakukan di server (query Prisma), bukan di frontend.
 */
export interface PublicSchoolProfile {
  slug: string;
  name: string;
  npsn: string | null;
  level: SchoolLevel;
  institutionType: "SEKOLAH" | "YAYASAN" | null;
  foundationName: string | null;
  foundationAddress: string | null;
  foundationPhone: string | null;
  foundationEmail: string | null;
  principalName: string | null;
  picName: string | null;
  picRole: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  ward: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  website: string | null;
  registrationUrl: string | null;
  googleMapsUrl: string | null;
  description: string | null;
  vision: string | null;
  mission: string | null;
  photoUrl: string | null;
  logoUrl: string | null;
  programs: PublicSchoolProgram[];
  /** true hanya jika data berasal dari pendaftaran APPROVED di database. */
  isVerifiedMember: boolean;
}

/** Placeholder "Belum diisi" yang ditulis service pendaftaran dianggap kosong. */
function clean(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "Belum diisi") return null;
  return trimmed;
}

function pick(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    const cleaned = clean(value);
    if (cleaned) return cleaned;
  }
  return null;
}

/** Mengambil profil publik sekolah berdasarkan slug (hanya pendaftaran APPROVED). */
export async function getPublicSchoolProfile(slug: string): Promise<PublicSchoolProfile | null> {
  try {
    const school = await prisma.school.findUnique({
      where: { slug },
      include: { foundation: true },
    });

    if (school) {
      // Record School hanya dibuat saat pendaftaran disetujui admin, namun data
      // formulir terlengkap tetap diambil langsung dari SchoolRegistration
      // berstatus APPROVED agar profil selalu konsisten dengan data pendaftaran.
      const registration = await prisma.schoolRegistration.findFirst({
        where: { npsn: school.npsn, status: "APPROVED" },
        orderBy: [
          { reviewedAt: { sort: "desc", nulls: "last" } },
          { createdAt: "desc" },
        ],
      });

      return {
        slug: school.slug,
        name: clean(registration?.name) ?? school.name,
        npsn: school.npsn,
        level: registration?.level ?? school.level,
        institutionType: registration?.institutionType ?? school.institutionType ?? null,
        foundationName: pick(registration?.foundationName, school.foundation?.name),
        foundationAddress: clean(school.foundation?.address),
        foundationPhone: clean(school.foundation?.phone),
        foundationEmail: clean(school.foundation?.email),
        principalName: pick(registration?.principalName, school.principalName),
        picName: pick(registration?.picName, school.picName),
        picRole: pick(registration?.picRole, school.picRole),
        email: pick(registration?.email, school.email),
        phone: pick(registration?.phone, school.phone),
        address: pick(registration?.address, school.address),
        ward: pick(registration?.ward, school.ward),
        district: pick(registration?.district, school.district),
        city: school.city ?? null,
        province: school.province ?? null,
        postalCode: pick(registration?.postalCode, school.postalCode),
        website: pick(registration?.website, school.website),
        registrationUrl: pick(registration?.registrationUrl, school.registrationUrl),
        googleMapsUrl: pick(registration?.googleMapsUrl, school.googleMapsUrl),
        description: pick(registration?.description, school.description),
        vision: pick(registration?.vision, school.vision),
        mission: pick(registration?.mission, school.mission),
        photoUrl: pick(registration?.schoolPhotoUrl, school.schoolPhotoUrl),
        logoUrl: pick(registration?.logoUrl, school.logoUrl),
        programs: registration?.programs ?? [],
        isVerifiedMember: true,
      };
    }
  } catch (error) {
    console.warn("Gagal memuat profil sekolah dari database:", error);
  }

  // Fallback data demo statis — hanya dipakai ketika database belum memiliki
  // data sama sekali (mis. lingkungan preview baru). Tidak ada data yang direkayasa.
  const staticSchool = getSchoolBySlug(slug);
  if (!staticSchool) return null;
  return {
    slug: staticSchool.slug,
    name: staticSchool.name,
    npsn: null,
    level: staticSchool.level as SchoolLevel,
    institutionType: staticSchool.type === "yayasan" ? "YAYASAN" : "SEKOLAH",
    foundationName: null,
    foundationAddress: null,
    foundationPhone: null,
    foundationEmail: null,
    principalName: null,
    picName: null,
    picRole: null,
    email: null,
    phone: null,
    address: clean(staticSchool.address),
    ward: null,
    district: null,
    city: clean(staticSchool.city),
    province: null,
    postalCode: null,
    website: null,
    registrationUrl: null,
    googleMapsUrl: null,
    description: clean(staticSchool.description),
    vision: null,
    mission: null,
    photoUrl: clean(staticSchool.image),
    logoUrl: null,
    programs: [],
    isVerifiedMember: false,
  };
}

