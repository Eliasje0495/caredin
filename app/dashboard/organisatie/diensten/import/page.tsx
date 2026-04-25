export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BulkImportForm from "./BulkImportForm";

export default async function BulkImportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  return (
    <div>
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <Link href="/dashboard/organisatie/diensten" className="text-sm font-medium no-underline" style={{ color: "var(--muted)" }}>
            ← Terug naar diensten
          </Link>
          <h1 className="text-[28px] font-bold mt-3 mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Diensten importeren
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Upload een CSV-bestand met meerdere diensten tegelijk.</p>
        </div>

        {/* CSV format info */}
        <div className="rounded-2xl p-5 mb-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>CSV formaat</div>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
            De eerste rij is de header. Gebruik puntkomma (;) als scheidingsteken.
          </p>
          <code className="block text-xs p-3 rounded-xl" style={{ background: "var(--bg)", color: "var(--dark)", fontFamily: "monospace" }}>
            titel;beschrijving;functie;sector;adres;stad;postcode;startdatum;starttijd;einddatum;eindtijd;uurtarief;pauze_min<br/>
            Verpleegkundige nacht;Beschrijving...;VERPLEEGKUNDIGE;VVT;Hoofdstraat 1;Amsterdam;1234AB;2026-05-01;22:00;2026-05-02;06:00;38.50;30
          </code>
          <a href="/voorbeeld-import.csv" download className="text-xs font-semibold no-underline mt-3 inline-block" style={{ color: "var(--teal)" }}>
            📄 Download voorbeeldbestand
          </a>
        </div>

        <BulkImportForm employerId={employer.id} defaultCity={employer.city ?? ""} defaultAddress={employer.address ?? ""} defaultPostalCode={employer.postalCode ?? ""} />
      </main>
    </div>
  );
}
