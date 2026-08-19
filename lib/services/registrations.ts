import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { schoolRegistrationSchema } from "@/lib/validation";

type RegistrationInput = z.infer<typeof schoolRegistrationSchema>;
const clean = (value?: string) => value?.trim() || null;
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function uniqueSlug(base: string) {
  let slug = base || "sekolah"; let suffix = 2;
  while (await prisma.school.findUnique({ where: { slug }, select: { id: true } })) slug = `${base}-${suffix++}`;
  return slug;
}

export async function submitRegistration(input: RegistrationInput) {
  const npsn = input.npsn.trim();
  const existingSchool = await prisma.school.findUnique({ where: { npsn }, select: { id: true } });
  if (existingSchool) throw new Error("NPSN_REGISTERED");
  const pending = await prisma.schoolRegistration.findFirst({ where: { npsn, status: { in: ["PENDING", "UNDER_REVIEW"] } }, select: { id: true } });
  if (pending) throw new Error("NPSN_PENDING");
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 3; attempt++) {
    const count = await prisma.schoolRegistration.count({ where: { createdAt: { gte: new Date(`${year}-01-01T00:00:00.000Z`) } } });
    const registrationNumber = `BMB-${year}-${String(count + 1 + attempt).padStart(6, "0")}`;
    try {
      return await prisma.schoolRegistration.create({ data: {
        registrationNumber, name: input.schoolName, npsn, level: input.schoolLevel === "TK" ? "OTHER" : input.schoolLevel,
        foundationName: clean(input.foundationName), principalName: input.principalName || "Belum diisi", picName: input.contactName,
        picRole: input.picPosition || "Penanggung jawab", email: input.email.toLowerCase(), phone: input.phone, address: input.address,
        ward: input.village || "Belum diisi", district: input.district || "Belum diisi", city: input.city, province: input.province,
        website: clean(input.website), description: clean(input.description), logoUrl: clean(input.logoUrl), documentUrl: input.documents?.[0],
      }});
    } catch (error) { if (attempt === 2) throw error; }
  }
  throw new Error("REGISTRATION_FAILED");
}

export async function approveRegistration(registrationId: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    const registration = await tx.schoolRegistration.findUnique({ where: { id: registrationId } });
    if (!registration || registration.status === "APPROVED") throw new Error("REGISTRATION_NOT_FOUND");
    const alreadyExists = await tx.school.findUnique({ where: { npsn: registration.npsn } });
    if (alreadyExists) throw new Error("NPSN_REGISTERED");
    let foundationId: string | null = null;
    if (registration.foundationName) {
      const existingFoundation = await tx.foundation.findFirst({ where: { name: registration.foundationName } });
      const foundation = existingFoundation ?? await tx.foundation.create({ data: { name: registration.foundationName, slug: slugify(registration.foundationName) } });
      foundationId = foundation.id;
    }
    const slug = await uniqueSlug(registration.name);
    const school = await tx.school.create({ data: { name: registration.name, slug, npsn: registration.npsn, level: registration.level, principalName: registration.principalName, picName: registration.picName, picRole: registration.picRole, email: registration.email, phone: registration.phone, address: registration.address, ward: registration.ward, district: registration.district, city: registration.city, province: registration.province, website: registration.website, description: registration.description, logoUrl: registration.logoUrl, foundationId } });
    const temporaryPassword = crypto.randomUUID();
    const existingUser = await tx.user.findUnique({ where: { email: registration.email } });
    if (existingUser) await tx.user.update({ where: { id: existingUser.id }, data: { schoolId: school.id, accountStatus: "APPROVED", reviewedAt: new Date(), rejectionReason: null } });
    else await tx.user.create({ data: { email: registration.email, name: registration.picName, role: "SCHOOL", schoolId: school.id, password: await bcrypt.hash(temporaryPassword, 12), accountStatus: "APPROVED", reviewedAt: new Date() } });
    await tx.schoolRegistration.update({ where: { id: registration.id }, data: { status: "APPROVED", reviewedAt: new Date(), reviewerId: adminId } });
    await tx.auditLog.create({ data: { userId: adminId, action: "SCHOOL_APPROVED", entity: "SchoolRegistration", entityId: registration.id, newData: { schoolId: school.id } } });
    return school;
  });
}
