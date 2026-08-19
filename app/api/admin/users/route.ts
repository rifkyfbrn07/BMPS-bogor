import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try { await requireRole("ADMIN", "SUPER_ADMIN"); const data = await prisma.user.findMany({ where: { role: "SCHOOL", accountStatus: "PENDING" }, select: { id: true, name: true, email: true, createdAt: true }, orderBy: { createdAt: "asc" } }); return NextResponse.json({ data }); }
  catch { return NextResponse.json({ message: "Akses ditolak." }, { status: 403 }); }
}
