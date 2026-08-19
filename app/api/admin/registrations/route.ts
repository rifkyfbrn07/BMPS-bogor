import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireRole("ADMIN", "SUPER_ADMIN");
    const url = new URL(request.url); const page = Math.max(1, Number(url.searchParams.get("page") ?? 1)); const status = url.searchParams.get("status"); const search = url.searchParams.get("search")?.trim();
    const where = { ...(status && ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].includes(status) ? { status: status as "PENDING" } : {}), ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { registrationNumber: { contains: search, mode: "insensitive" as const } }, { npsn: { contains: search } }] } : {}) };
    const [data, total] = await prisma.$transaction([prisma.schoolRegistration.findMany({ where, orderBy: { createdAt: "desc" }, take: 20, skip: (page - 1) * 20 }), prisma.schoolRegistration.count({ where })]);
    return NextResponse.json({ data, page, total, totalPages: Math.max(1, Math.ceil(total / 20)) });
  } catch { return NextResponse.json({ message: "Akses ditolak." }, { status: 403 }); }
}
