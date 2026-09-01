import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

// URL absolut (https) atau path relatif dari endpoint upload internal ("/uploads/...").
export const imageUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || z.string().url().safeParse(value).success || /^\/[a-zA-Z0-9/._-]+$/.test(value), {
    message: "URL gambar tidak valid.",
  });

export const programTypeSchema = z.enum(["BEASISWA", "BANTUAN_PENDIDIKAN"]);

export const institutionTypeSchema = z.enum(["SEKOLAH", "YAYASAN"]);

export const schoolRegistrationSchema = z.object({
  schoolName: z.string().trim().min(2, "Nama sekolah/yayasan wajib diisi (minimal 2 karakter).").max(160),
  npsn: z.string().trim().regex(/^\d{8}$/, "NPSN harus terdiri dari 8 digit angka."),
  schoolLevel: z.enum(["TK", "SD", "SMP", "SMA", "SMK", "MI", "MTs", "MA", "OTHER"], {
    message: "Silakan pilih jenjang pendidikan.",
  }),
  institutionType: institutionTypeSchema.optional(),
  foundationName: optionalText(160),
  principalName: optionalText(120),
  contactName: z.string().trim().min(2, "Nama penanggung jawab (PIC) wajib diisi.").max(120),
  picPosition: optionalText(100),
  email: z.string().trim().email("Format email tidak valid (contoh: info@sekolah.sch.id).").max(255),
  phone: z.string().trim().min(8, "Nomor WhatsApp/telepon minimal 8 digit.").max(32),
  address: z.string().trim().min(8, "Alamat lengkap wajib diisi (minimal 8 karakter).").max(2000),
  village: optionalText(120),
  district: optionalText(120),
  city: z.string().trim().min(2).max(120).default("Bogor"),
  province: z.string().trim().min(2).max(120).default("Jawa Barat"),
  postalCode: optionalText(10),
  website: optionalText(255),
  whatsapp: optionalText(32),
  instagram: optionalText(255),
  facebook: optionalText(255),
  youtube: optionalText(255),
  tiktok: optionalText(255),
  registrationUrl: optionalText(500),
  googleMapsUrl: optionalText(500),
  description: optionalText(2000),
  vision: optionalText(2000),
  mission: optionalText(2000),
  logoUrl: optionalText(500),
  schoolPhotoUrl: imageUrlSchema.optional().or(z.literal("")),
  documents: z.array(z.string().max(500)).max(10).optional(),
  programs: z.array(programTypeSchema).max(2).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const accountRegistrationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

export const registrationDecisionSchema = z.object({
  status: z.enum(["UNDER_REVIEW", "REJECTED"]),
  rejectionReason: z.string().trim().min(5).max(1000).optional(),
}).superRefine((data, ctx) => {
  if (data.status === "REJECTED" && !data.rejectionReason) ctx.addIssue({ code: "custom", message: "Alasan penolakan wajib diisi.", path: ["rejectionReason"] });
});
