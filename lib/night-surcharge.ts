// lib/night-surcharge.ts — Nacht- en spoedtoeslagen voor Caredin
// Nachttoeslag: +2.5% vanaf 00:00 t/m 06:00 NL tijd
// Spoeddienst: verplicht aanbieden als werkgever dit aanvinkt

export const NIGHT_SURCHARGE_PCT  = 0.025; // 2.5%
export const NIGHT_START_HOUR     = 0;     // 00:00
export const NIGHT_END_HOUR       = 6;     // 06:00

/**
 * Bereken of een dienst een nachttoeslag krijgt.
 * Een dienst is een nachtdienst als startTime OF endTime binnen 00:00–06:00 valt.
 */
export function isNightShift(startTime: Date, endTime: Date): boolean {
  const nlFormatter = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    hour: "numeric",
    hour12: false,
  });

  const startHour = parseInt(nlFormatter.format(startTime));
  const endHour   = parseInt(nlFormatter.format(endTime));

  // Dienst valt geheel of gedeeltelijk tussen 00:00 en 06:00
  if (startHour >= NIGHT_START_HOUR && startHour < NIGHT_END_HOUR) return true;
  if (endHour   >  NIGHT_START_HOUR && endHour   <= NIGHT_END_HOUR) return true;

  // Nachtdienst die over middernacht gaat (bijv. 22:00–03:00)
  if (startHour > endHour) return true;

  return false;
}

/**
 * Bereken het effectieve uurtarief inclusief nachttoeslag.
 */
export function calcEffectiveRate(hourlyRate: number, nightShift: boolean): number {
  if (!nightShift) return hourlyRate;
  return Math.round(hourlyRate * (1 + NIGHT_SURCHARGE_PCT) * 100) / 100;
}

/**
 * Bereken totale uitbetaling voor een afgeronde dienst.
 * platformFeePerHour wordt van de werkgever gefactureerd, NIET afgetrokken van werker.
 */
export function calcPayout(params: {
  hourlyRate:        number;
  hoursWorked:       number;
  isNightShift:      boolean;
  platformFeePerHour: number;
}): {
  grossAmount:   number;  // wat de werker ontvangt
  platformFee:   number;  // wat Caredin verdient (betaald door werkgever)
  totalEmployer: number;  // totaal te betalen door werkgever
} {
  const { hourlyRate, hoursWorked, isNightShift: night, platformFeePerHour } = params;
  const effectiveRate = calcEffectiveRate(hourlyRate, night);
  const grossAmount   = Math.round(effectiveRate * hoursWorked * 100) / 100;
  const platformFee   = Math.round(platformFeePerHour * hoursWorked * 100) / 100;
  const totalEmployer = Math.round((grossAmount + platformFee) * 100) / 100;
  return { grossAmount, platformFee, totalEmployer };
}
