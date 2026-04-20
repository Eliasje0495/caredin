import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";

export type WebhookEvent =
  | "shift.applied"
  | "shift.filled"
  | "shift.cancelled"
  | "worker.checkin"
  | "worker.checkout"
  | "hours.approved";

export async function dispatchWebhook(
  employerId: string,
  event: WebhookEvent,
  payload: Record<string, unknown>
) {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { employerId, isActive: true, events: { has: event } },
  });
  if (endpoints.length === 0) return;

  const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });

  await Promise.allSettled(
    endpoints.map(async (ep) => {
      const sig = createHmac("sha256", ep.secret).update(body).digest("hex");
      let statusCode: number | null = null;
      let success = false;
      let error: string | null = null;
      try {
        const res = await fetch(ep.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CaredIn-Signature": `sha256=${sig}`,
            "X-CaredIn-Event": event,
          },
          body,
          signal: AbortSignal.timeout(10000),
        });
        statusCode = res.status;
        success = res.ok;
        if (!res.ok) error = `HTTP ${res.status}`;
      } catch (e: unknown) {
        error = e instanceof Error ? e.message : "Unknown error";
      }
      await prisma.webhookDelivery.create({
        data: { endpointId: ep.id, event, payload: JSON.parse(body), statusCode, success, error },
      });
    })
  );
}
