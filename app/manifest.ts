import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Caredin — Flexwerk in de Zorg",
    short_name: "Caredin",
    description: "Flexwerk voor zorgprofessionals. Plan diensten, check in en ontvang uitbetalingen.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7F5",
    theme_color: "#1A7A6A",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
