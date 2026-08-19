import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (await isRateLimited(request, "login", 10, 15 * 60_000)) return NextResponse.json({ message: "Terlalu banyak percobaan login. Coba lagi 15 menit lagi." }, { status: 429 });
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Email atau kata sandi tidak valid." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) return NextResponse.json({ message: "Email atau kata sandi salah." }, { status: 401 });
  if (user.role === "SCHOOL" && user.accountStatus !== "APPROVED") return NextResponse.json({ message: user.accountStatus === "REJECTED" ? `Pendaftaran akun ditolak${user.rejectionReason ? `: ${user.rejectionReason}` : "."}` : "Akun Anda masih menunggu verifikasi admin." }, { status: 403 });
  await createSession({ id: user.id, role: user.role, schoolId: user.schoolId ?? undefined });
  await prisma.auditLog.create({ data: { userId: user.id, action: "USER_LOGIN", entity: "User", entityId: user.id } });
  return NextResponse.json({ role: user.role, redirectTo: user.role === "SCHOOL" ? "/dashboard" : "/admin" });
}
