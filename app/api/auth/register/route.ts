import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { accountRegistrationSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (await isRateLimited(request, "account-register", 5, 60 * 60_000)) return NextResponse.json({ message: "Terlalu banyak pendaftaran akun. Coba lagi satu jam lagi." }, { status: 429 });
  const parsed = accountRegistrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Data pendaftaran akun tidak valid." }, { status: 400 });
  try {
    const user = await prisma.user.create({ data: { name: parsed.data.name, email: parsed.data.email.toLowerCase(), password: await bcrypt.hash(parsed.data.password, 12), role: "SCHOOL", accountStatus: "APPROVED" } });
    await prisma.auditLog.create({ data: { userId: user.id, action: "ACCOUNT_REGISTERED", entity: "User", entityId: user.id } });
    return NextResponse.json({ 
      message: "Akun berhasil didaftarkan dan telah aktif. Silakan login." 
    }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && (error as { code?: string }).code === "P2002") return NextResponse.json({ message: "Email ini sudah terdaftar." }, { status: 409 });
    console.error("Gagal mendaftarkan akun", error); return NextResponse.json({ message: "Pendaftaran akun belum dapat diproses." }, { status: 500 });
  }
}
