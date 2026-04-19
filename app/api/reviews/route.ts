import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const { reviewedId, rating, comment } = await req.json();

  if (!reviewedId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Ongeldige gegevens." }, { status: 400 });
  }
  if (reviewedId === userId) {
    return NextResponse.json({ error: "Je kunt jezelf niet beoordelen." }, { status: 400 });
  }

  // Verify they worked together (at least one approved application)
  const sharedShift = await prisma.shiftApplication.findFirst({
    where: {
      status: "APPROVED",
      OR: [
        { userId, shift: { employer: { userId: reviewedId } } },
        { userId: reviewedId, shift: { employer: { userId } } },
      ],
    },
  });
  if (!sharedShift) {
    return NextResponse.json({ error: "Je kunt alleen mensen beoordelen waarmee je een dienst hebt gedeeld." }, { status: 403 });
  }

  const review = await prisma.review.upsert({
    where: { reviewerId_reviewedId: { reviewerId: userId, reviewedId } },
    create: { reviewerId: userId, reviewedId, rating: parseInt(rating), comment },
    update: { rating: parseInt(rating), comment },
  });

  // Update average rating for the reviewed user (worker profile)
  const allReviews = await prisma.review.findMany({ where: { reviewedId } });
  const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await prisma.workerProfile.updateMany({
    where: { userId: reviewedId },
    data: { averageRating: Math.round(avg * 100) / 100 },
  });

  return NextResponse.json({ id: review.id });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId vereist." }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { reviewedId: userId },
    include: { reviewer: { select: { name: true, image: true, employer: { select: { companyName: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}
