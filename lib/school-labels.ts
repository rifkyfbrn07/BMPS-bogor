export type PublicSchoolProgram = "BEASISWA" | "BANTUAN_PENDIDIKAN";

/**
 * Helper label sekolah yang aman dipakai di server maupun client component
 * (tidak meng-import Prisma/DB).
 */

/** Mengubah nomor telepon lokal menjadi link https://wa.me/ (format 62...). */
export function buildWhatsAppLink(phone?: string | null): string | null {
  const digits = phone?.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  if (normalized.length < 8 || normalized.length > 16) return null;
  return `https://wa.me/${normalized}`;
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
