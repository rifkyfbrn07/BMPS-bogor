import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

/**
 * Menyimpan objek gambar dan mengembalikan URL publik.
 *
 * - Production (Vercel): memakai Vercel Blob (butuh BLOB_READ_WRITE_TOKEN).
 * - Development lokal (tanpa token): file disimpan ke folder `public/uploads`
 *   agar dapat langsung dilayani Next.js pada saat pengembangan.
 *
 * Binari TIDAK pernah disimpan di PostgreSQL — database hanya menyimpan URL-nya.
 */
export async function saveImage(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    try {
      const blob = await put(filename, buffer, { access: "public", contentType, addRandomSuffix: false });
      return blob.url;
    } catch (blobErr) {
      console.warn("Vercel Blob upload failed, falling back to local/inline:", blobErr);
    }
  }

  // Coba simpan ke folder public/uploads di filesystem
  try {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, safeName), buffer);
    return `/uploads/${safeName}`;
  } catch (fsErr) {
    console.warn("Filesystem upload failed (e.g. read-only serverless environment), falling back to Data URL:", fsErr);
    // Fallback andal: Base64 data URI sehingga gambar tetap tersimpan utuh di DB
    const base64 = buffer.toString("base64");
    return `data:${contentType};base64,${base64}`;
  }
}
