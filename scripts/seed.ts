import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // ─────────────────────────────────────────────
  // EMPLOYERS
  // ─────────────────────────────────────────────

  const employerData = [
    {
      email: "info@zorgcentrum-delinde.nl",
      name: "Zorgcentrum De Linde",
      companyName: "Zorgcentrum De Linde",
      kvkNumber: "12345601",
      sector: "VVT" as const,
      city: "Amsterdam",
      postalCode: "1011 AB",
      address: "Lindenlaan 12",
    },
    {
      email: "info@ggz-noordholland.nl",
      name: "GGZ Noord-Holland",
      companyName: "GGZ Noord-Holland",
      kvkNumber: "12345602",
      sector: "GGZ" as const,
      city: "Haarlem",
      postalCode: "2011 CD",
      address: "Psychiaterlaan 45",
    },
    {
      email: "info@emma-kinderziekenhuis.nl",
      name: "Kinderziekenhuis Emma",
      companyName: "Kinderziekenhuis Emma",
      kvkNumber: "12345603",
      sector: "ZIEKENHUIS" as const,
      city: "Amsterdam",
      postalCode: "1105 AZ",
      address: "Meibergdreef 9",
    },
  ];

  const createdEmployers: { id: string; companyName: string }[] = [];

  for (const data of employerData) {
    const password = await bcrypt.hash("Welkom123!", 10);

    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        password,
        role: "EMPLOYER",
        emailVerified: new Date(),
      },
    });

    const employer = await prisma.employer.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        companyName: data.companyName,
        kvkNumber: data.kvkNumber,
        kvkStatus: "VERIFIED",
        kvkVerifiedAt: new Date(),
        sector: data.sector,
        city: data.city,
        postalCode: data.postalCode,
        address: data.address,
        isVerified: true,
        isActive: true,
      },
    });

    createdEmployers.push({ id: employer.id, companyName: data.companyName });
    console.log(`  Employer: ${data.companyName} (${user.email})`);
  }

  // ─────────────────────────────────────────────
  // WORKERS
  // ─────────────────────────────────────────────

  const workerData = [
    {
      email: "jana.de.vries@example.com",
      name: "Jana de Vries",
      city: "Amsterdam",
      postalCode: "1054 EH",
      address: "Rembrandtplein 3",
      bigNumber: "19012345678",
      hourlyRate: 42,
      sectors: ["VVT", "ZIEKENHUIS"] as const,
      functions: ["VERPLEEGKUNDIGE"] as const,
    },
    {
      email: "thomas.bos@example.com",
      name: "Thomas Bos",
      city: "Haarlem",
      postalCode: "2023 GH",
      address: "Grote Markt 7",
      bigNumber: "19087654321",
      hourlyRate: 38,
      sectors: ["GGZ"] as const,
      functions: ["GGZ_AGOOG", "PERSOONLIJK_BEGELEIDER"] as const,
    },
  ];

  const createdWorkers: { userId: string; name: string }[] = [];

  for (const data of workerData) {
    const password = await bcrypt.hash("Welkom123!", 10);

    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        password,
        role: "WORKER",
        emailVerified: new Date(),
      },
    });

    const existingProfile = await prisma.workerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingProfile) {
      const profile = await prisma.workerProfile.create({
        data: {
          userId: user.id,
          city: data.city,
          postalCode: data.postalCode,
          address: data.address,
          bigNumber: data.bigNumber,
          bigStatus: "VERIFIED",
          bigVerifiedAt: new Date(),
          hourlyRate: data.hourlyRate,
          contractType: "ZZP",
          isVerified: true,
          isActive: true,
          radius: 40,
          sectors: {
            create: data.sectors.map((sector) => ({ sector })),
          },
          functions: {
            create: data.functions.map((fn) => ({ function: fn })),
          },
        },
      });
      console.log(`  Worker: ${data.name} (profile ${profile.id})`);
    } else {
      console.log(`  Worker: ${data.name} (already exists, skipped)`);
    }

    createdWorkers.push({ userId: user.id, name: data.name });
  }

  // ─────────────────────────────────────────────
  // SHIFTS
  // ─────────────────────────────────────────────

  const now = new Date();

  function daysFromNow(days: number, hour: number): Date {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d;
  }

  const shiftsToCreate = [
    // Zorgcentrum De Linde (VVT, Amsterdam)
    {
      employerIdx: 0,
      title: "Verpleegkundige nachtdienst",
      sector: "VVT" as const,
      function: "VERPLEEGKUNDIGE" as const,
      city: "Amsterdam",
      postalCode: "1011 AB",
      address: "Lindenlaan 12",
      startDays: 3,
      startHour: 22,
      endDays: 4,
      endHour: 7,
      hourlyRate: 48,
      requiresBig: true,
      isNightShift: true,
      isUrgent: false,
      description: "Nachtdienst op onze afdeling ouderenzorg. BIG-registratie verpleegkundige vereist.",
    },
    {
      employerIdx: 0,
      title: "Verzorgende IG dagdienst",
      sector: "VVT" as const,
      function: "VERZORGENDE_IG" as const,
      city: "Amsterdam",
      postalCode: "1011 AB",
      address: "Lindenlaan 12",
      startDays: 5,
      startHour: 7,
      endDays: 5,
      endHour: 15,
      hourlyRate: 37,
      requiresBig: false,
      isNightShift: false,
      isUrgent: true,
      description: "Dagdienst op onze woonzorgafdeling. Ervaring in de ouderenzorg gewenst.",
    },
    {
      employerIdx: 0,
      title: "Verpleegkundige avonddienst",
      sector: "VVT" as const,
      function: "VERPLEEGKUNDIGE" as const,
      city: "Amsterdam",
      postalCode: "1011 AB",
      address: "Lindenlaan 12",
      startDays: 8,
      startHour: 15,
      endDays: 8,
      endHour: 23,
      hourlyRate: 45,
      requiresBig: true,
      isNightShift: false,
      isUrgent: false,
      description: "Avonddienst op de verpleegafdeling. Zelfstandig kunnen werken is een vereiste.",
    },
    // GGZ Noord-Holland (GGZ, Haarlem)
    {
      employerIdx: 1,
      title: "GGZ-agoog dagbehandeling",
      sector: "GGZ" as const,
      function: "GGZ_AGOOG" as const,
      city: "Haarlem",
      postalCode: "2011 CD",
      address: "Psychiaterlaan 45",
      startDays: 4,
      startHour: 8,
      endDays: 4,
      endHour: 17,
      hourlyRate: 40,
      requiresBig: false,
      isNightShift: false,
      isUrgent: false,
      description: "Begeleiding van cliënten in onze dagbehandeling GGZ. Ervaring met groepsbegeleiding gewenst.",
    },
    {
      employerIdx: 1,
      title: "Persoonlijk begeleider GGZ",
      sector: "GGZ" as const,
      function: "PERSOONLIJK_BEGELEIDER" as const,
      city: "Haarlem",
      postalCode: "2011 CD",
      address: "Psychiaterlaan 45",
      startDays: 10,
      startHour: 9,
      endDays: 10,
      endHour: 17,
      hourlyRate: 38,
      requiresBig: false,
      isNightShift: false,
      isUrgent: false,
      description: "Ondersteuning van cliënten met een GGZ-achtergrond bij dagelijkse activiteiten.",
    },
    {
      employerIdx: 1,
      title: "Verpleegkundige GGZ nacht",
      sector: "GGZ" as const,
      function: "VERPLEEGKUNDIGE" as const,
      city: "Haarlem",
      postalCode: "2011 CD",
      address: "Psychiaterlaan 45",
      startDays: 14,
      startHour: 23,
      endDays: 15,
      endHour: 7,
      hourlyRate: 52,
      requiresBig: true,
      isNightShift: true,
      isUrgent: true,
      description: "Nachtdienst op gesloten GGZ-afdeling. BIG-registratie verpleegkundige verplicht.",
    },
    // Kinderziekenhuis Emma (ZIEKENHUIS, Amsterdam)
    {
      employerIdx: 2,
      title: "Kinderverpleegkundige dagdienst",
      sector: "ZIEKENHUIS" as const,
      function: "VERPLEEGKUNDIGE" as const,
      city: "Amsterdam",
      postalCode: "1105 AZ",
      address: "Meibergdreef 9",
      startDays: 2,
      startHour: 7,
      endDays: 2,
      endHour: 19,
      hourlyRate: 55,
      requiresBig: true,
      isNightShift: false,
      isUrgent: false,
      description: "Twaalfuursdienst op de kinderafdeling. Specifieke ervaring met pediatrie is een pré.",
    },
    {
      employerIdx: 2,
      title: "Kinderverpleegkundige avond",
      sector: "ZIEKENHUIS" as const,
      function: "VERPLEEGKUNDIGE" as const,
      city: "Amsterdam",
      postalCode: "1105 AZ",
      address: "Meibergdreef 9",
      startDays: 7,
      startHour: 19,
      endDays: 8,
      endHour: 7,
      hourlyRate: 53,
      requiresBig: true,
      isNightShift: true,
      isUrgent: false,
      description: "Nacht/avonddienst pediatrie. Rustige afdeling, zelfstandig werken vereist.",
    },
    {
      employerIdx: 2,
      title: "Verzorgende IG polikliniek",
      sector: "ZIEKENHUIS" as const,
      function: "VERZORGENDE_IG" as const,
      city: "Utrecht",
      postalCode: "3584 CX",
      address: "Heidelberglaan 100",
      startDays: 12,
      startHour: 8,
      endDays: 12,
      endHour: 16,
      hourlyRate: 36,
      requiresBig: false,
      isNightShift: false,
      isUrgent: false,
      description: "Ondersteuning op de polikliniek van ons zusterziekenhuis in Utrecht.",
    },
    {
      employerIdx: 2,
      title: "Verpleegkundige spoed weekenddienst",
      sector: "ZIEKENHUIS" as const,
      function: "VERPLEEGKUNDIGE" as const,
      city: "Rotterdam",
      postalCode: "3015 GJ",
      address: "Dr. Molewaterplein 40",
      startDays: 18,
      startHour: 7,
      endDays: 18,
      endHour: 19,
      hourlyRate: 50,
      requiresBig: true,
      isNightShift: false,
      isUrgent: true,
      description: "Weekend dagdienst op de spoedafdeling. Ervaring op een SEH of intensive care gewenst.",
    },
  ];

  let shiftCount = 0;

  for (const s of shiftsToCreate) {
    const employerId = createdEmployers[s.employerIdx].id;
    const startTime = daysFromNow(s.startDays, s.startHour);
    const endTime = daysFromNow(s.endDays, s.endHour);

    // Check idempotency by title + employerId + startTime
    const existing = await prisma.shift.findFirst({
      where: { employerId, title: s.title, startTime },
    });

    if (!existing) {
      await prisma.shift.create({
        data: {
          employerId,
          title: s.title,
          description: s.description,
          sector: s.sector,
          function: s.function,
          city: s.city,
          postalCode: s.postalCode,
          address: s.address,
          startTime,
          endTime,
          breakMinutes: 30,
          hourlyRate: s.hourlyRate,
          requiresBig: s.requiresBig,
          isNightShift: s.isNightShift,
          isUrgent: s.isUrgent,
          status: "OPEN",
        },
      });
      shiftCount++;
      console.log(`  Shift: ${s.title} (${s.city}, €${s.hourlyRate}/uur)`);
    } else {
      console.log(`  Shift: ${s.title} (already exists, skipped)`);
    }
  }

  console.log(`\nDone! Created:`);
  console.log(`  ${createdEmployers.length} employers`);
  console.log(`  ${createdWorkers.length} workers`);
  console.log(`  ${shiftCount} shifts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
