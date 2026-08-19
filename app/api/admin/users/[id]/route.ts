import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: RouteContext<"/api/admin/users/[id]">) {
  try {
    const admin = await requireRole("ADMIN", "SUPER_ADMIN"); const { id } = await context.params; const body = await request.json();
    if (body.status !== "APPROVED" && body.status !== "REJECTED") return NextResponse.json({ message: "Status tidak valid." }, { status: 400 });
    if (body.status === "REJECTED" && (!body.rejectionReason || String(body.rejectionReason).trim().length < 5)) return NextResponse.json({ message: "Alasan penolakan wajib diisi." }, { status: 400 });
    const user = await prisma.user.update({ where: { id }, data: { accountStatus: body.status, reviewedAt: new Date(), rejectionReason: body.status === "REJECTED" ? String(body.rejectionReason).trim() : null } });
    await prisma.auditLog.create({ data: { userId: admin.id, action: body.status === "APPROVED" ? "ACCOUNT_APPROVED" : "ACCOUNT_REJECTED", entity: "User", entityId: id } });
    return NextResponse.json({ data: user });
  } catch { return NextResponse.json({ message: "Akses ditolak atau akun tidak ditemukan." }, { status: 403 }); }
}
