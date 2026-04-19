export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfielForm from "./ProfielForm";

function calcCompletion(
  user: { name: string | null; phone: string | null; image: string | null },
  profile: {
    bio: string | null;
    dateOfBirth: Date | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    bigNumber: string | null;
    kvkNumber: string | null;
    hourlyRate: number | null;
    radius: number | null;
  } | null
): number {
  const fields = [
    user.name,
    user.phone,
    user.image,
    profile?.bio,
    profile?.dateOfBirth,
    profile?.address,
    profile?.city,
    profile?.postalCode,
    profile?.bigNumber,
    profile?.kvkNumber,
    profile?.hourlyRate,
    profile?.radius,
  ];
  const filled = fields.filter((f) => f !== null && f !== "" && f !== undefined).length;
  return Math.round((filled / fields.length) * 100);
}

export default async function ZzperProfielPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true, image: true },
    }),
    prisma.workerProfile.findUnique({ where: { userId } }),
  ]);

  const completion = calcCompletion(
    { name: user?.name ?? null, phone: user?.phone ?? null, image: user?.image ?? null },
    profile
      ? {
          bio: profile.bio,
          dateOfBirth: profile.dateOfBirth,
          address: profile.address,
          city: profile.city,
          postalCode: profile.postalCode,
          bigNumber: profile.bigNumber,
          kvkNumber: profile.kvkNumber,
          hourlyRate: profile.hourlyRate ? Number(profile.hourlyRate) : null,
          radius: profile.radius ?? null,
        }
      : null
  );

  const bigStatus = (profile as any)?.bigStatus ?? "UNVERIFIED";
  const kvkStatus = (profile as any)?.kvkStatus ?? "UNVERIFIED";
  const isVerified = (profile as any)?.isVerified ?? false;

  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Page title */}
        <div>
          <h1
            className="text-[28px] font-bold mb-1"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
          >
            Mijn profiel
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Houd je gegevens up-to-date voor de beste matches.
          </p>
        </div>

        {/* Top card: avatar + completion + verification */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: "0.5px solid var(--border)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white select-none"
                style={{ background: "var(--teal)", fontFamily: "var(--font-fraunces)" }}
              >
                {initial}
              </div>
              <button
                type="button"
                className="text-xs font-semibold rounded-[40px] px-3 py-1.5 cursor-pointer"
                style={{
                  color: "var(--teal)",
                  border: "1.5px solid var(--teal)",
                  background: "transparent",
                  fontFamily: "inherit",
                }}
              >
                Foto uploaden
              </button>
            </div>

            {/* Completion + badges */}
            <div className="flex-1 space-y-4">

              {/* Completion bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: "var(--dark)" }}>
                    Profiel compleetheid
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: completion >= 80 ? "#065F46" : completion >= 50 ? "var(--teal)" : "#92400E" }}
                  >
                    {completion}%
                  </span>
                </div>
                <div
                  className="h-2.5 rounded-full w-full overflow-hidden"
                  style={{ background: "var(--teal-light)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${completion}%`,
                      background:
                        completion >= 80
                          ? "#059669"
                          : completion >= 50
                          ? "var(--teal)"
                          : "#F59E0B",
                    }}
                  />
                </div>
                {completion < 100 && (
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    Vul ontbrekende velden in om je zichtbaarheid te vergroten.
                  </p>
                )}
              </div>

              {/* Verification badges */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "BIG", status: bigStatus },
                  { label: "KvK", status: kvkStatus },
                  { label: "Profiel", status: isVerified ? "VERIFIED" : "UNVERIFIED" },
                ].map((v) => {
                  const isVerif = v.status === "VERIFIED";
                  const isPending = v.status === "PENDING";
                  const badgeBg = isVerif
                    ? "#D1FAE5"
                    : isPending
                    ? "#FEF3C7"
                    : "#F3F4F6";
                  const badgeColor = isVerif
                    ? "#065F46"
                    : isPending
                    ? "#92400E"
                    : "var(--muted)";
                  const badgeBorder = isVerif
                    ? "#6EE7B7"
                    : isPending
                    ? "#FCD34D"
                    : "var(--border)";
                  const icon = isVerif ? "✓" : isPending ? "⏳" : "–";
                  const text = isVerif
                    ? "Geverifieerd"
                    : isPending
                    ? "In behandeling"
                    : "Niet ingevuld";

                  return (
                    <div
                      key={v.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[40px] text-xs font-semibold"
                      style={{
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeBorder}`,
                      }}
                    >
                      <span className="text-[11px]">{icon}</span>
                      <span>{v.label}</span>
                      <span className="opacity-70">·</span>
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* The editable form */}
        <ProfielForm
          initialData={{
            name:           user?.name ?? "",
            phone:          user?.phone ?? "",
            bio:            profile?.bio ?? "",
            dateOfBirth:    profile?.dateOfBirth
              ? profile.dateOfBirth.toISOString().split("T")[0]
              : "",
            address:        profile?.address ?? "",
            city:           profile?.city ?? "",
            postalCode:     profile?.postalCode ?? "",
            bigNumber:      profile?.bigNumber ?? "",
            skjNumber:      profile?.skjNumber ?? "",
            kvkNumber:      profile?.kvkNumber ?? "",
            kvkCompanyName: profile?.kvkCompanyName ?? "",
            contractType:   profile?.contractType ?? "ZZP",
            hourlyRate:     profile?.hourlyRate ? String(profile.hourlyRate) : "",
            radius:         profile?.radius ?? 30,
          }}
        />
      </main>
    </div>
  );
}
