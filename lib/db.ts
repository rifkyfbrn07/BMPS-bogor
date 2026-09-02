import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock?schema=public";

const globalForDatabase = globalThis as unknown as { pool?: Pool };

const isLocalDb = connectionString.includes("localhost") || connectionString.includes("127.0.0.1") || connectionString.includes("mock@localhost");

export const db =
  globalForDatabase.pool ??
  new Pool({
    connectionString,
    ssl: (process.env.NODE_ENV === "production" && !isLocalDb) ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.pool = db;
}

export async function ensureRegistrationTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS school_registrations (
      id UUID PRIMARY KEY,
      school_name VARCHAR(160) NOT NULL,
      institution_type VARCHAR(30) NOT NULL,
      school_level VARCHAR(20) NOT NULL,
      contact_name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      address TEXT NOT NULL,
      note TEXT,
      status VARCHAR(24) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
