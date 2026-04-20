import webpush from "web-push";
import { prisma } from "@/lib/prisma";

webpush.setVapidDetails(
  "mailto:support@caredin.nl",
  process.env.VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export async function sendPushToUser(userId: string, payload: { title: string; body: string; url?: string }) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        );
      } catch {
        // Remove invalid subscriptions
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
    })
  );
}

export async function sendPushToMatchingWorkers(
  sector: string,
  city: string,
  payload: { title: string; body: string; url?: string }
) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  // Find workers in same sector/city
  const profiles = await prisma.workerProfile.findMany({
    where: {
      isActive: true,
      sectors: { some: { sector: sector as any } },
    },
    select: { userId: true },
    take: 200,
  });
  await Promise.allSettled(profiles.map((p) => sendPushToUser(p.userId, payload)));
}
