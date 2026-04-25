export interface MatchInput {
  workerFunction?: string | null;
  workerCity?: string | null;
  workerRadius?: number;
  workerBig?: string;
  workerKvk?: string;
  isVerified?: boolean;
  shiftFunction: string;
  shiftCity: string;
  requiresBig: boolean;
  requiresKvk: boolean;
}

export function calcMatchScore(input: MatchInput): number {
  let score = 0;
  let total = 0;

  // Function match (40 pts)
  total += 40;
  if (input.workerFunction === input.shiftFunction) score += 40;

  // City match (30 pts) — simple: same city = full points
  total += 30;
  if (input.workerCity && input.shiftCity) {
    if (input.workerCity.toLowerCase() === input.shiftCity.toLowerCase()) score += 30;
    else score += 10; // different city but within radius
  }

  // Verified (20 pts)
  total += 20;
  if (input.isVerified) score += 20;

  // Requirements met (10 pts)
  total += 10;
  if (input.requiresBig && input.workerBig === "VERIFIED") score += 5;
  else if (!input.requiresBig) score += 5;
  if (input.requiresKvk && input.workerKvk === "VERIFIED") score += 5;
  else if (!input.requiresKvk) score += 5;

  return Math.round((score / total) * 100);
}

export function matchLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "Uitstekende match",  color: "#065F46", bg: "#D1FAE5" };
  if (score >= 60) return { label: "Goede match",        color: "var(--teal)", bg: "var(--teal-light)" };
  if (score >= 40) return { label: "Redelijke match",    color: "#92400E", bg: "#FEF3C7" };
  return              { label: "Beperkte match",       color: "#6B7280", bg: "#F3F4F6" };
}
