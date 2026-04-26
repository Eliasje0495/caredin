"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

interface ShiftPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  city: string;
  function: string;
  sector: string;
  hourlyRate: string;
  dateLabel: string;
  timeLabel: string;
  employerName: string;
  isUrgent: boolean;
}

const SECTOR_COLORS: Record<string, string> = {
  VVT:              "#8B5CF6",
  GGZ:              "#3B82F6",
  JEUGDZORG:        "#F59E0B",
  ZIEKENHUIS:       "#EF4444",
  GEHANDICAPTENZORG:"#10B981",
  THUISZORG:        "#06B6D4",
  KRAAMZORG:        "#EC4899",
  HUISARTSENZORG:   "#F97316",
  REVALIDATIE:      "#84CC16",
  OVERIG:           "#6B7280",
};

const FUNCTION_LABELS: Record<string, string> = {
  VERPLEEGKUNDIGE:       "Verpleegkundige",
  VERZORGENDE_IG:        "Verzorgende IG",
  HELPENDE_PLUS:         "Helpende Plus",
  HELPENDE:              "Helpende",
  ZORGASSISTENT:         "Zorgassistent",
  GGZ_AGOOG:             "GGZ Agoog",
  PERSOONLIJK_BEGELEIDER:"Persoonlijk Begeleider",
  GEDRAGSDESKUNDIGE:     "Gedragsdeskundige",
  ARTS:                  "Arts",
  FYSIOTHERAPEUT:        "Fysiotherapeut",
  ERGOTHERAPEUT:         "Ergotherapeut",
  LOGOPEDIST:            "Logopedist",
  KRAAMVERZORGENDE:      "Kraamverzorgende",
  OVERIG:                "Overig",
};

export default function ShiftMap({ shifts }: { shifts: ShiftPin[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamisch laden om SSR te vermijden
    import("leaflet").then((L) => {
      // Fix default icon paths voor Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const withCoords = shifts.filter((s) => s.lat && s.lng);
      const center: [number, number] = withCoords.length > 0
        ? [
            withCoords.reduce((sum, s) => sum + s.lat, 0) / withCoords.length,
            withCoords.reduce((sum, s) => sum + s.lng, 0) / withCoords.length,
          ]
        : [52.3676, 4.9041]; // Amsterdam fallback

      const map = L.map(containerRef.current!, {
        center,
        zoom: withCoords.length > 0 ? 8 : 7,
        zoomControl: true,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Groepeer pins op dezelfde locatie
      const grouped = new Map<string, ShiftPin[]>();
      for (const s of withCoords) {
        const key = `${s.lat.toFixed(4)},${s.lng.toFixed(4)}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(s);
      }

      for (const [, group] of Array.from(grouped)) {
        const s = group[0];
        const color = SECTOR_COLORS[s.sector] ?? SECTOR_COLORS.OVERIG;
        const count = group.length;

        // Gekleurde SVG marker
        const svgIcon = L.divIcon({
          className: "",
          html: `
            <div style="
              position:relative;
              width:${count > 1 ? 44 : 36}px;
              height:${count > 1 ? 44 : 36}px;
              display:flex;align-items:center;justify-content:center;
            ">
              <div style="
                width:${count > 1 ? 40 : 32}px;
                height:${count > 1 ? 40 : 32}px;
                background:${color};
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                border:2.5px solid white;
                box-shadow:0 2px 8px rgba(0,0,0,0.25);
              "></div>
              ${count > 1 ? `<span style="
                position:absolute;top:2px;right:2px;
                background:white;color:${color};
                font-size:10px;font-weight:800;
                width:16px;height:16px;
                border-radius:50%;
                display:flex;align-items:center;justify-content:center;
                box-shadow:0 1px 3px rgba(0,0,0,0.2);
              ">${count}</span>` : ""}
            </div>`,
          iconSize:   [count > 1 ? 44 : 36, count > 1 ? 44 : 36],
          iconAnchor: [count > 1 ? 20 : 16, count > 1 ? 44 : 36],
          popupAnchor:[0, -(count > 1 ? 44 : 36)],
        });

        const popupHtml = group.map((sh: ShiftPin) => `
          <div style="margin-bottom:${group.length > 1 ? "10px" : "0"};padding-bottom:${group.length > 1 ? "10px" : "0"};border-bottom:${group.length > 1 ? "1px solid #f0f0f0" : "none"}">
            <div style="font-size:11px;font-weight:700;color:${SECTOR_COLORS[sh.sector] ?? "#6B7280"};margin-bottom:2px;">
              ${sh.employerName}${sh.isUrgent ? ' <span style="background:#ef4444;color:white;font-size:9px;padding:1px 5px;border-radius:20px;margin-left:4px;">Urgent</span>' : ""}
            </div>
            <div style="font-size:14px;font-weight:800;color:#111827;margin-bottom:6px;">
              ${FUNCTION_LABELS[sh.function] ?? sh.function}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">
              <span style="font-size:10px;background:#f3f4f6;padding:2px 7px;border-radius:6px;color:#374151;">📅 ${sh.dateLabel}</span>
              <span style="font-size:10px;background:#f3f4f6;padding:2px 7px;border-radius:6px;color:#374151;">🕐 ${sh.timeLabel}</span>
              <span style="font-size:10px;background:#f3f4f6;padding:2px 7px;border-radius:6px;color:#374151;">📍 ${sh.city}</span>
              <span style="font-size:10px;font-weight:700;background:#ecfdf5;padding:2px 7px;border-radius:6px;color:#065f46;">€${sh.hourlyRate}/u</span>
            </div>
            <a href="/vacatures/${sh.id}" style="
              display:inline-block;
              background:#1a7a6a;color:white;
              font-size:11px;font-weight:700;
              padding:5px 12px;border-radius:20px;
              text-decoration:none;
            ">Bekijk dienst →</a>
          </div>`).join("");

        L.marker([s.lat, s.lng], { icon: svgIcon })
          .addTo(map)
          .bindPopup(`<div style="min-width:220px;max-width:260px;font-family:system-ui,sans-serif;">${popupHtml}</div>`, {
            maxWidth: 280,
          });
      }

      // Pas kaart aan op markers
      if (withCoords.length > 1) {
        const bounds = L.latLngBounds(withCoords.map((s) => [s.lat, s.lng]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [shifts]);

  if (shifts.filter((s) => s.lat && s.lng).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
        style={{ background: "var(--bg)", border: "0.5px solid var(--border)" }}>
        <p className="text-4xl mb-3">🗺️</p>
        <p className="font-semibold" style={{ color: "var(--dark)" }}>Geen locatiedata beschikbaar</p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>De gevonden diensten hebben nog geen coördinaten.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={containerRef} style={{ height: "580px", width: "100%" }} />
      <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-xl text-xs font-semibold"
        style={{ background: "white", border: "0.5px solid var(--border)", color: "var(--muted)" }}>
        {shifts.filter((s) => s.lat && s.lng).length} diensten op kaart
      </div>
    </div>
  );
}
