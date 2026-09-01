import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await requireRole("ADMIN", "SUPER_ADMIN");
    const body = await request.json();
    const { name, password } = body;

    const dataToUpdate: { name?: string; password?: string } = {};
    if (name && typeof name === "string" && name.trim()) {
      dataToUpdate.name = name.trim();
    }
    if (password && typeof password === "string" && password.length >= 6) {
      dataToUpdate.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ data: updated, message: "Profil admin berhasil diperbarui." });
  } catch (error) {
    console.error("Update Admin Profile Error:", error);
    return NextResponse.json({ message: "Gagal memperbarui profil admin." }, { status: 400 });
  }
}
