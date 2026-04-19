export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NieuweShiftForm from "./NieuweShiftForm";

export default async function NieuweShiftPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  return (
    <div>
      <main className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-8">
          <Link href="/dashboard/organisatie/diensten" className="text-sm font-medium no-underline" style={{ color: "var(--muted)" }}>
            ← Terug naar diensten
          </Link>
          <h1 className="text-[28px] font-bold mt-3 mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Dienst plaatsen
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Vul de details in. Je dienst is direct zichtbaar voor geverifieerde professionals.</p>
        </div>

        <NieuweShiftForm defaultCity={employer.city ?? ""} defaultAddress={employer.address ?? ""} defaultPostalCode={employer.postalCode ?? ""} />
      </main>
    </div>
  );
}
