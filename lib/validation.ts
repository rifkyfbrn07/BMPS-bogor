import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const schoolRegistrationSchema = z.object({
  schoolName: z.string().trim().min(2).max(160),
  npsn: z.string().trim().regex(/^\d{8}$/, "NPSN harus terdiri dari 8 digit."),
  schoolLevel: z.enum(["TK", "SD", "SMP", "SMA", "SMK"]),
  foundationName: optionalText(160),
  principalName: optionalText(120),
  contactName: z.string().trim().min(2).max(120),
  picPosition: optionalText(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(32),
  address: z.string().trim().min(8).max(2000),
  village: optionalText(120),
  district: optionalText(120),
  city: z.string().trim().min(2).max(120).default("Bogor"),
  province: z.string().trim().min(2).max(120).default("Jawa Barat"),
  website: z.string().trim().url().max(255).optional().or(z.literal("")),
  description: optionalText(2000),
  logoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  documents: z.array(z.string().url().max(500)).max(10).optional(),
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
