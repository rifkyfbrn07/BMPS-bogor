import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") return NextResponse.json({ message: "Akses administrator diperlukan." }, { status: 403 });
  try {
    const url = new URL(request.url); const page = Math.max(1, Number(url.searchParams.get("page") ?? 1)); const status = url.searchParams.get("status"); const search = url.searchParams.get("search")?.trim();
    const where = { ...(status && ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].includes(status) ? { status: status as "PENDING" } : {}), ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { registrationNumber: { contains: search, mode: "insensitive" as const } }, { npsn: { contains: search } }] } : {}) };
    const [data, total] = await prisma.$transaction([prisma.schoolRegistration.findMany({ where, orderBy: { createdAt: "desc" }, take: 20, skip: (page - 1) * 20 }), prisma.schoolRegistration.count({ where })]);
    return NextResponse.json({ data, page, total, totalPages: Math.max(1, Math.ceil(total / 20)) });
  } catch (error) { console.error("Gagal memuat pendaftaran admin", error); return NextResponse.json({ message: "Data pendaftaran belum dapat dimuat." }, { status: 500 }); }
}
