import { prisma } from "@/lib/prisma";

export async function isRateLimited(request: Request, scope: string, limit: number, windowMs: number): Promise<boolean> {
  const now = new Date();
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const key = `${scope}:${ip}`;

  try {
    const record = await prisma.rateLimit.findUnique({
      where: { key },
    });

    if (!record || record.resetAt <= now) {
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      });
      return false;
    }

    if (record.count >= limit) {
      return true;
    }

    await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return false;
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open: if database fails, do not block the user request
    return false;
  }
}

