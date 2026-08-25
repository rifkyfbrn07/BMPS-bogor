import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { approveRegistration } from "@/lib/services/registrations";
import { registrationDecisionSchema } from "@/lib/validation";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") return NextResponse.json({ message: "Akses administrator diperlukan." }, { status: 403 });
  try {
    const { id } = await context.params;
    const data = await prisma.schoolRegistration.findUnique({ where: { id } });
    return data ? NextResponse.json({ data }) : NextResponse.json({ message: "Pendaftaran tidak ditemukan." }, { status: 404 });
  } catch (error) { console.error("Gagal memuat detail pendaftaran", error); return NextResponse.json({ message: "Detail pendaftaran belum dapat dimuat." }, { status: 500 }); }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getSession();
  if (!admin) return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") return NextResponse.json({ message: "Akses administrator diperlukan." }, { status: 403 });
  try {
    const { id } = await context.params; const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ message: "Body request tidak valid." }, { status: 400 });
    if (body.action === "APPROVE") return NextResponse.json({ data: await approveRegistration(id, admin.id) });
    const parsed = registrationDecisionSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Data tidak valid." }, { status: 400 });
    const current = await prisma.schoolRegistration.findUnique({ where: { id }, select: { status: true } });
    if (!current) return NextResponse.json({ message: "Pendaftaran tidak ditemukan." }, { status: 404 });
    if (current.status === "APPROVED" || current.status === "REJECTED") return NextResponse.json({ message: "Pendaftaran ini sudah memiliki keputusan final." }, { status: 409 });
    const registration = await prisma.schoolRegistration.update({ where: { id }, data: { status: parsed.data.status, rejectionReason: parsed.data.status === "REJECTED" ? parsed.data.rejectionReason : null, reviewedAt: new Date(), reviewerId: admin.id } });
    await prisma.auditLog.create({ data: { userId: admin.id, action: parsed.data.status === "REJECTED" ? "SCHOOL_REJECTED" : "SCHOOL_REVIEWED", entity: "SchoolRegistration", entityId: id } });
    return NextResponse.json({ data: registration });
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_NOT_FOUND") return NextResponse.json({ message: "Pendaftaran tidak ditemukan atau sudah disetujui." }, { status: 404 });
    if (error instanceof Error && error.message === "NPSN_REGISTERED") return NextResponse.json({ message: "NPSN ini sudah digunakan oleh sekolah yang terdaftar." }, { status: 409 });
    console.error("Gagal memperbarui keputusan pendaftaran", error);
    return NextResponse.json({ message: "Keputusan belum dapat disimpan. Silakan coba lagi." }, { status: 500 });
  }
}
