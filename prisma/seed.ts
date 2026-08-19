import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL belum dikonfigurasi.");
const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? "";
if (seedPassword.length < 12) throw new Error("Setel SEED_ADMIN_PASSWORD minimal 12 karakter sebelum menjalankan seed.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

async function main() {
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  await prisma.user.upsert({
    where: { email: "superadmin@bmpsbogor.or.id" },
    update: { name: "Super Admin BMPS", role: "SUPER_ADMIN", password: passwordHash, accountStatus: "APPROVED" },
    create: { name: "Super Admin BMPS", email: "superadmin@bmpsbogor.or.id", role: "SUPER_ADMIN", password: passwordHash, accountStatus: "APPROVED" },
  });
}

main().finally(() => prisma.$disconnect());
