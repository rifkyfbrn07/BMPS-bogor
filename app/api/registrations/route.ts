import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitRegistration } from "@/lib/services/registrations";
import { sendRegistrationSubmittedEmail } from "@/lib/services/email";
import { isRateLimited } from "@/lib/rate-limit";
import { schoolRegistrationSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (await isRateLimited(request, "school-register", 15, 60 * 60_000)) {
    return NextResponse.json({ message: "Terlalu banyak pendaftaran dari perangkat Anda. Silakan coba lagi 15 menit lagi." }, { status: 429 });
  }
  
  const rawBody = await request.json().catch(() => null);
  const parsed = schoolRegistrationSchema.safeParse(rawBody);
  
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] ? String(issue.path[0]) : "general";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
    return NextResponse.json(
      { 
        message: parsed.error.issues[0]?.message ?? "Mohon periksa kolom yang ditandai merah.",
        errors: fieldErrors 
      }, 
      { status: 400 }
    );
  }

  try {
    const registration = await submitRegistration(parsed.data);
    try {
      await sendRegistrationSubmittedEmail(registration.email, registration.name, registration.registrationNumber);
    } catch (emailError) {
      console.error("Gagal mengirim email konfirmasi pendaftaran:", emailError);
    }
    return NextResponse.json({ 
      registrationNumber: registration.registrationNumber, 
      message: `Pendaftaran berhasil diterima. Nomor registrasi Anda: ${registration.registrationNumber}` 
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NPSN_REGISTERED") {
        return NextResponse.json({ 
          message: "Sekolah dengan NPSN tersebut sudah terdaftar di sistem BMPS Bogor.",
          errors: { npsn: "NPSN ini sudah terdaftar." }
        }, { status: 409 });
      }
      if (error.message === "NPSN_PENDING") {
        return NextResponse.json({ 
          message: "Pendaftaran sekolah dengan NPSN ini sedang dalam proses verifikasi admin.",
          errors: { npsn: "Pendaftaran dengan NPSN ini sedang diverifikasi." }
        }, { status: 409 });
      }
      console.error("Gagal menyimpan pendaftaran:", error.message);
      return NextResponse.json({ 
        message: `Pendaftaran gagal: ${error.message}` 
      }, { status: 400 });
    }
    console.error("Gagal menyimpan pendaftaran:", error);
    return NextResponse.json(
      { message: "Terjadi kendala saat memproses pendaftaran. Silakan periksa kembali data formulir Anda." },
      { status: 500 }
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
