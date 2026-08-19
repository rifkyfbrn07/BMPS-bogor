import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitRegistration } from "@/lib/services/registrations";
import { sendRegistrationSubmittedEmail } from "@/lib/services/email";
import { isRateLimited } from "@/lib/rate-limit";
import { schoolRegistrationSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (await isRateLimited(request, "school-register", 5, 60 * 60_000)) return NextResponse.json({ message: "Terlalu banyak pendaftaran. Coba lagi satu jam lagi." }, { status: 429 });
  const parsed = schoolRegistrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Mohon lengkapi data pendaftaran dengan benar." }, { status: 400 });

  try {
    const registration = await submitRegistration(parsed.data);
    try {
      await sendRegistrationSubmittedEmail(registration.email, registration.name, registration.registrationNumber);
    } catch (emailError) {
      console.error("Gagal mengirim email konfirmasi pendaftaran:", emailError);
    }
    return NextResponse.json({ registrationNumber: registration.registrationNumber, message: `Pendaftaran diterima. Nomor pendaftaran Anda: ${registration.registrationNumber}` }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "NPSN_REGISTERED") return NextResponse.json({ message: "Sekolah dengan NPSN tersebut sudah terdaftar." }, { status: 409 });
    if (error instanceof Error && error.message === "NPSN_PENDING") return NextResponse.json({ message: "Pendaftaran sekolah dengan NPSN tersebut sedang dalam proses verifikasi." }, { status: 409 });
    console.error("Gagal menyimpan pendaftaran", error);
    return NextResponse.json(
      { message: "Pendaftaran belum dapat diproses. Silakan coba kembali beberapa saat lagi." },
      { status: 503 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const registrationNumber = url.searchParams.get("registration_number")?.trim();
  const email = url.searchParams.get("email")?.trim().toLowerCase();
  if (!registrationNumber || !email) return NextResponse.json({ message: "Nomor pendaftaran dan email wajib diisi." }, { status: 400 });
  const registration = await prisma.schoolRegistration.findFirst({ where: { registrationNumber, email }, select: { registrationNumber: true, name: true, status: true, createdAt: true, reviewedAt: true, rejectionReason: true } });
  if (!registration) return NextResponse.json({ message: "Data pendaftaran tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data: registration });
}
