export type PublicSchoolProgram = "BEASISWA" | "BANTUAN_PENDIDIKAN";

/**
 * Helper label sekolah yang aman dipakai di server maupun client component
 * (tidak meng-import Prisma/DB).
 */

/** Mengubah nomor telepon lokal menjadi link https://wa.me/ (format 62...). */
export function buildWhatsAppLink(phone?: string | null): string | null {
  if (!phone) return null;
  if (phone.startsWith("https://wa.me/") || phone.startsWith("http://wa.me/")) return phone;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  if (normalized.length < 8 || normalized.length > 16) return null;
  return `https://wa.me/${normalized}`;
}

/** Mengubah input Instagram (@username atau url) menjadi link https://instagram.com/username */
export function buildInstagramLink(val?: string | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const username = trimmed.replace(/^@/, "");
  return `https://instagram.com/${username}`;
}

/** Mengubah input Facebook menjadi URL valid */
export function buildFacebookLink(val?: string | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://facebook.com/${trimmed}`;
}

/** Mengubah input YouTube menjadi URL valid */
export function buildYouTubeLink(val?: string | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://youtube.com/${trimmed.startsWith("@") ? trimmed : `@${trimmed}`}`;
}

/** Mengubah input TikTok menjadi URL valid */
export function buildTikTokLink(val?: string | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://tiktok.com/@${trimmed.replace(/^@/, "")}`;
}

const SCHOOL_LEVEL_LABELS: Record<string, string> = {
  TK: "TK",
  SD: "SD (Sekolah Dasar)",
  MI: "MI (Madrasah Ibtidaiyah)",
  SMP: "SMP (Sekolah Menengah Pertama)",
  MTs: "MTs (Madrasah Tsanawiyah)",
  SMA: "SMA (Sekolah Menengah Atas)",
  SMK: "SMK (Sekolah Menengah Kejuruan)",
  MA: "MA (Madrasah Aliyah)",
  OTHER: "Jenjang lainnya",
};

export function schoolLevelLabel(level?: string | null): string {
  if (!level) return "-";
  return SCHOOL_LEVEL_LABELS[level] ?? level;
}

const INSTITUTION_TYPE_LABELS: Record<string, string> = {
  SEKOLAH: "Sekolah",
  YAYASAN: "Yayasan",
};

export function institutionTypeLabel(type?: string | null): string | null {
  if (!type) return null;
  return INSTITUTION_TYPE_LABELS[type] ?? null;
}

export const PROGRAM_LABELS: Record<PublicSchoolProgram, string> = {
  BEASISWA: "Informasi Beasiswa",
  BANTUAN_PENDIDIKAN: "Bantuan Pendidikan",
};
