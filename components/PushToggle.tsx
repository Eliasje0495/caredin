"use client";
import { useState, useEffect } from "react";

export function PushToggle() {
  const [state, setState] = useState<"unknown" | "off" | "loading" | "on">("unknown");

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) { setState("off"); return; }
    if (Notification.permission === "granted") setState("on");
    else setState("off");
  }, []);

  async function toggle() {
    if (state === "on") {
      setState("off");
      return;
    }
    setState("loading");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState("off"); return; }
      const { publicKey } = await fetch("/api/push/subscribe").then(r => r.json());
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const j = sub.toJSON() as any;
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: j.endpoint, keys: j.keys }),
      });
      setState("on");
    } catch { setState("off"); }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from(Array.from(rawData).map(c => c.charCodeAt(0)));
  }

  if (state === "unknown") return null;

  return (
    <button
      onClick={toggle}
      title={state === "on" ? "Notificaties uitschakelen" : "Notificaties inschakelen"}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
      style={{
        background: state === "on" ? "rgba(26,122,106,0.1)" : "transparent",
        color: state === "on" ? "var(--teal)" : "var(--muted)",
        border: "0.5px solid var(--border)",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <span>{state === "on" ? "🔔" : "🔕"}</span>
      <span>{state === "loading" ? "Laden…" : state === "on" ? "Notificaties aan" : "Notificaties uit"}</span>
    </button>
  );
}
