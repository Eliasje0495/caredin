import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ChatWidget from "@/components/ChatWidget";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const dmSans   = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  title: "CaredIn — Zorgprofessionals vinden & boeken",
  description: "CaredIn verbindt zorgprofessionals met zorginstellingen. Vind flexdiensten en vaste vacatures in zorg en welzijn.",
  themeColor: "#1A7A6A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Caredin",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
        <script dangerouslySetInnerHTML={{ __html: `
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
` }} />
      </body>
    </html>
  );
}
