// lib/name-match.ts — Naam-matching tussen register en accountnaam
//
// BIG retourneert: "J. van der Berg" (initialen + tussenvoegsel + achternaam)
// SKJ retourneert: "Jan van der Berg" (volledige naam)
// Account heeft:   "Jan van der Berg" of "Jan Berg"
//
// Strategie: controleer of de achternaam (laatste token(s)) overeenkomen,
// rekening houdend met Nederlandse tussenvoegsels.

const TUSSENVOEGSELS = new Set([
  "van", "de", "den", "der", "ter", "ten", "het", "in", "op", "aan",
  "bij", "te", "tot", "uit", "over", "onder", "voor", "von", "van der",
  "van den", "van de", "de la", "du",
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // verwijder accenten
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSurname(name: string): string {
  const tokens = normalize(name).split(" ").filter(Boolean);
  // Sla initialen over (single char of eindigend op punt)
  const withoutInitials = tokens.filter((t) => t.length > 1 && !t.endsWith("."));
  if (withoutInitials.length === 0) return tokens[tokens.length - 1] ?? "";
  // Verwijder leading tussenvoegsels om kern-achternaam te vinden
  let i = 0;
  while (i < withoutInitials.length - 1 && TUSSENVOEGSELS.has(withoutInitials[i])) i++;
  return withoutInitials.slice(i).join(" ");
}

export function nameMatchesAccount(registerName: string, accountName: string): boolean {
  if (!registerName || !accountName) return true; // geen data = niet blokkeren

  const regSurname     = extractSurname(registerName);
  const accountSurname = extractSurname(accountName);

  if (!regSurname || !accountSurname) return true;

  // Exacte match op achternaam
  if (regSurname === accountSurname) return true;

  // Partial match: achternaam zit erin (bijv. dubbele achternaam)
  if (accountSurname.includes(regSurname) || regSurname.includes(accountSurname)) return true;

  return false;
}
