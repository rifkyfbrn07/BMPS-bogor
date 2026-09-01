import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Fallback database URL for build time when DATABASE_URL is not set on Vercel
const connectionString = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock?schema=public";

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const pool = new pg.Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 10, // Max connection limit safe for serverless postgres pools
  });

  const client = new PrismaClient({
    adapter: new PrismaPg(pool),
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
})();

let schemaChecked = false;

/**
 * Auto-heal database schema at runtime to ensure all new columns exist on any remote/production DB
 */
export async function ensureDatabaseSchema() {
  if (schemaChecked || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock@localhost")) {
    return;
  }
  try {
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionType') THEN
              CREATE TYPE "InstitutionType" AS ENUM ('SEKOLAH', 'YAYASAN');
          END IF;
      END $$;

      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "institutionType" "InstitutionType";
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "vision" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "mission" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "youtube" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
      ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "schoolPhotoUrl" TEXT;

      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "institutionType" "InstitutionType";
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "vision" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "mission" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "youtube" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
      ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "schoolPhotoUrl" TEXT;
    `);
    schemaChecked = true;
  } catch (e) {
    // Non-fatal if already applied or restricted permissions
    console.warn("Database auto-schema note:", e instanceof Error ? e.message : e);
  }
}
