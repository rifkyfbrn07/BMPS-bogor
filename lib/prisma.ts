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

