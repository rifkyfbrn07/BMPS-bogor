import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { approveRegistration } from "@/lib/services/registrations";
import { registrationDecisionSchema } from "@/lib/validation";

export async function GET(_request: Request, context: RouteContext<"/api/admin/registrations/[id]">) {
  try {
    await requireRole("ADMIN", "SUPER_ADMIN"); const { id } = await context.params;
    const data = await prisma.schoolRegistration.findUnique({ where: { id } });
    return data ? NextResponse.json({ data }) : NextResponse.json({ message: "Pendaftaran tidak ditemukan." }, { status: 404 });
  } catch { return NextResponse.json({ message: "Akses ditolak." }, { status: 403 }); }
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/registrations/[id]">) {
  try {
    const admin = await requireRole("ADMIN", "SUPER_ADMIN"); const { id } = await context.params; const body = await request.json();
    if (body.action === "APPROVE") return NextResponse.json({ data: await approveRegistration(id, admin.id) });
    const parsed = registrationDecisionSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Data tidak valid." }, { status: 400 });
    const registration = await prisma.schoolRegistration.update({ where: { id }, data: { status: parsed.data.status, rejectionReason: parsed.data.status === "REJECTED" ? parsed.data.rejectionReason : null, reviewedAt: new Date(), reviewerId: admin.id } });
    await prisma.auditLog.create({ data: { userId: admin.id, action: parsed.data.status === "REJECTED" ? "SCHOOL_REJECTED" : "SCHOOL_REVIEWED", entity: "SchoolRegistration", entityId: id } });
    return NextResponse.json({ data: registration });
  } catch (error) {
    if (error instanceof Error && ["REGISTRATION_NOT_FOUND", "NPSN_REGISTERED"].includes(error.message)) return NextResponse.json({ message: "Pendaftaran tidak dapat disetujui." }, { status: 409 });
    return NextResponse.json({ message: "Akses ditolak atau data tidak ditemukan." }, { status: 403 });
  }
}
