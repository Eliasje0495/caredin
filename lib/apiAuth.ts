import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { NextRequest } from "next/server";

export async function authenticateApiKey(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const key = authHeader.slice(7);
  const hash = createHash("sha256").update(key).digest("hex");

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: hash, isActive: true },
    include: { employer: true },
  });
  if (!apiKey) return null;

  // Update lastUsedAt fire-and-forget
  prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => {});

  return apiKey.employer;
}
