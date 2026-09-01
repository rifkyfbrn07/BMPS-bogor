import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL belum dikonfigurasi di .env");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

async function main() {
  const adminEmail = "admin@bmpsbogor.or.id";
  const adminPassword = "Admin123456!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // 1. Create or update primary admin
  const admin1 = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Administrator BMPS",
      role: "SUPER_ADMIN",
      password: passwordHash,
      accountStatus: "APPROVED",
    },
    create: {
      name: "Administrator BMPS",
      email: adminEmail,
      role: "SUPER_ADMIN",
      password: passwordHash,
      accountStatus: "APPROVED",
    },
  });

  // 2. Also create admin@gmail.com (matching the reference UI) for convenience
  const admin2 = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      name: "Admin",
      role: "ADMIN",
      password: passwordHash,
      accountStatus: "APPROVED",
    },
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      role: "ADMIN",
      password: passwordHash,
      accountStatus: "APPROVED",
    },
  });

  console.log("==========================================");
  console.log("✔ BERHASIL MEMBUAT AKUN ADMIN:");
  console.log("------------------------------------------");
  console.log(`Akun 1:`);
  console.log(`Email    : ${admin1.email}`);
  console.log(`Password : ${adminPassword}`);
  console.log(`Role     : ${admin1.role}`);
  console.log("------------------------------------------");
  console.log(`Akun 2 (Alternatif):`);
  console.log(`Email    : ${admin2.email}`);
  console.log(`Password : ${adminPassword}`);
  console.log(`Role     : ${admin2.role}`);
  console.log("==========================================");
}

main()
  .catch((e) => {
    console.error("Error creating admin account:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
