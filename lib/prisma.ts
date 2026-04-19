import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function buildPool(): pg.Pool {
  // Use DATABASE_URL (pooler) — works from Vercel (IPv4 compatible)
  const rawUrl = process.env.DATABASE_URL ?? "";
  const connString = rawUrl.includes("pooler.supabase.com")
    ? (() => { const u = new URL(rawUrl); u.searchParams.delete("pgbouncer"); u.searchParams.delete("connection_limit"); return u.toString(); })()
    : rawUrl;
  return new pg.Pool({
    connectionString: connString,
    ssl: { rejectUnauthorized: false },
  });
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const pool = buildPool();
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter } as any);
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});
