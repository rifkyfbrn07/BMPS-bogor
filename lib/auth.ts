import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/generated/prisma/client";

const cookieName = "bmps_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
export type SessionUser = { id: string; role: Role; schoolId?: string };

function getSecret() {
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) throw new Error("AUTH_SECRET harus disetel minimal 32 karakter.");
  return secret;
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ role: user.role, schoolId: user.schoolId })
    .setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime("8h").sign(getSecret());
  const store = await cookies();
  store.set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !["SUPER_ADMIN", "ADMIN", "SCHOOL"].includes(String(payload.role))) return null;
    return { id: payload.sub, role: payload.role as Role, schoolId: typeof payload.schoolId === "string" ? payload.schoolId : undefined };
  } catch { return null; }
}

export async function requireRole(...roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) throw new Error("UNAUTHORIZED");
  return session;
}

export async function clearSession() { (await cookies()).delete(cookieName); }
