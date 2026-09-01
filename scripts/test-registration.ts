import "dotenv/config";
import { schoolRegistrationSchema } from "../lib/validation";
import { submitRegistration } from "../lib/services/registrations";
import { prisma } from "../lib/prisma";

async function testDirect() {
  console.log("1. Testing Zod Validation Schema...");
  const invalidData = {
    schoolName: "A",
    npsn: "123",
    schoolLevel: "SMP",
    contactName: "",
    email: "bukan-email",
    phone: "12",
    address: "short",
  };
  const parsed = schoolRegistrationSchema.safeParse(invalidData);
  console.log("Is valid (should be false):", parsed.success);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] ? String(issue.path[0]) : "general";
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    });
    console.log("Captured field errors:", fieldErrors);
  }

  console.log("\n2. Testing Database Submission...");
  const randomNPSN = String(Math.floor(10000000 + Math.random() * 90000000));
  const validData = {
    schoolName: "SMA Insan Mandiri Bogor",
    npsn: randomNPSN,
    schoolLevel: "SMA" as const,
    institutionType: "SEKOLAH" as const,
    foundationName: "Yayasan Insan Mandiri",
    principalName: "Drs. H. Ahmad Fauzi",
    contactName: "Budi Santoso",
    picPosition: "Humas",
    email: `insanmandiri_${randomNPSN}@gmail.com`,
    phone: "081234567890",
    whatsapp: "081234567890",
    address: "Jl. Raya Pajajaran No. 88, Baranangsiang",
    village: "Baranangsiang",
    district: "Bogor Timur",
    city: "Kota Bogor",
    province: "Jawa Barat",
    postalCode: "16143",
    website: "https://insanmandiri.sch.id",
    instagram: "@insanmandiri_bogor",
    programs: ["BEASISWA" as const, "BANTUAN_PENDIDIKAN" as const],
  };

  const reg = await submitRegistration(validData);
  console.log("✔ Registration successfully saved in DB!");
  console.log("Nomor Pendaftaran:", reg.registrationNumber);
  console.log("Nama Lembaga    :", reg.name);
  console.log("NPSN            :", reg.npsn);
  console.log("Status          :", reg.status);
}

testDirect()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
