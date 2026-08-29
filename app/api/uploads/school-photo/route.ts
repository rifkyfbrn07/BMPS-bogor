import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isRateLimited } from "@/lib/rate-limit";
import { saveImage } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function matchesMagicBytes(buffer: Buffer, contentType: string): boolean {
  if (contentType === "image/jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (contentType === "image/png") return buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  if (contentType === "image/webp") return buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  return false;
}

export async function POST(request: Request) {
  if (await isRateLimited(request, "school-photo-upload", 10, 60 * 60_000)) {
    return NextResponse.json({ message: "Terlalu banyak unggahan. Coba lagi satu jam lagi." }, { status: 429 });
  }

  try {
    const formData = await request.formData().catch(() => null);
    const file = formData?.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Foto sekolah belum dipilih." }, { status: 400 });
    }

    if (file.size === 0) return NextResponse.json({ message: "Foto sekolah kosong." }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ message: "Ukuran foto maksimal 5 MB." }, { status: 400 });
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json({ message: "Format foto harus JPG, JPEG, PNG, atau WEBP." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesMagicBytes(buffer, file.type)) {
      return NextResponse.json({ message: "Isi file bukan gambar yang valid." }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type];
    const filename = `school-photo/${randomUUID()}-${Date.now()}.${extension}`;
    const url = await saveImage(buffer, filename, file.type);
    return NextResponse.json({ url, message: "Foto sekolah berhasil diunggah." }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "STORAGE_NOT_CONFIGURED") {
      console.error("Storage belum dikonfigurasi:", error);
      return NextResponse.json({ message: "Penyimpanan gambar belum dikonfigurasi. Silakan hubungi admin BMPS Bogor." }, { status: 503 });
    }
    console.error("Gagal mengunggah foto sekolah:", error);
    return NextResponse.json({ message: "Foto sekolah gagal diunggah. Silakan coba lagi." }, { status: 500 });
  }
}
