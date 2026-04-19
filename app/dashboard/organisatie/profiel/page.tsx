export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrgProfielForm from "./OrgProfielForm";

export default async function OrgProfielPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  return (
    <div>
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Organisatieprofiel
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Zichtbaar voor professionals die op jouw diensten aanmelden.</p>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: "KvK-verificatie", status: employer.kvkStatus },
            { label: "Account status",  status: employer.isVerified ? "VERIFIED" : "UNVERIFIED" },
          ].map((v) => (
            <div key={v.label} className="rounded-xl p-4 bg-white flex items-center gap-3"
              style={{ border: "0.5px solid var(--border)" }}>
              <span className="text-lg">
                {v.status === "VERIFIED" ? "✅" : v.status === "PENDING" ? "⏳" : "⚪"}
              </span>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{v.label}</div>
                <div className="text-xs" style={{ color: v.status === "VERIFIED" ? "#065F46" : v.status === "PENDING" ? "#92400E" : "var(--muted)" }}>
                  {v.status === "VERIFIED" ? "Geverifieerd" : v.status === "PENDING" ? "In behandeling" : "Niet geverifieerd"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <OrgProfielForm
          initialData={{
            companyName:  employer.companyName,
            description:  employer.description ?? "",
            address:      employer.address ?? "",
            city:         employer.city ?? "",
            postalCode:   employer.postalCode ?? "",
            website:      employer.website ?? "",
            kvkNumber:    employer.kvkNumber ?? "",
            sector:       employer.sector ?? "",
          }}
        />
      </main>
    </div>
  );
}
