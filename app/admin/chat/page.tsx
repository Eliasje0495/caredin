"use client";
import { useEffect, useState, useRef, useCallback } from "react";

interface Message { id: string; sender: string; content: string; createdAt: string; }
interface Conversation { id: string; visitorName: string | null; visitorEmail: string | null; status: string; updatedAt: string; messages: Message[]; }

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId]           = useState<string | null>(null);
  const [reply, setReply]                 = useState("");
  const [sending, setSending]             = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find(c => c.id === activeId) ?? null;

  const fetchAll = useCallback(async () => {
    const res = await fetch("/api/admin/chat");
    const data = await res.json();
    if (data.conversations) setConversations(data.conversations);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => {
    const interval = setInterval(fetchAll, 3000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !activeId) return;
    setSending(true);
    await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: activeId, content: reply }),
    });
    setReply("");
    setSending(false);
    fetchAll();
  }

  const unread = conversations.filter(c => {
    const last = c.messages[c.messages.length - 1];
    return last?.sender === "visitor";
  }).length;

  return (
    <div className="flex h-[calc(100vh-64px)] -m-6 overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col" style={{ background: "#0F1C1A", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="font-black text-white text-lg">Live chat</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {conversations.length} gesprekken · {unread} ongelezen
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-sm p-4" style={{ color: "rgba(255,255,255,0.3)" }}>Nog geen gesprekken</p>
          ) : conversations.map(c => {
            const last = c.messages[c.messages.length - 1];
            const isUnread = last?.sender === "visitor";
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className="w-full text-left px-4 py-3.5 transition-colors"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: activeId === c.id ? "rgba(26,122,106,0.15)" : "transparent",
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm truncate">{c.visitorName || "Anoniem"}</span>
                  {isUnread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#1A7A6A" }} />}
                </div>
                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{last?.content ?? "—"}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {new Date(c.updatedAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat venster */}
      <div className="flex-1 flex flex-col" style={{ background: "#0a1412" }}>
        {!active ? (
          <div className="flex-1 flex items-center justify-center" style={{ color: "rgba(255,255,255,0.2)" }}>
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm">Selecteer een gesprek</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: "rgba(26,122,106,0.2)", color: "#5DB8A4" }}>
                {(active.visitorName ?? "?").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{active.visitorName || "Anoniem"}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{active.visitorEmail || "Geen e-mail"}</p>
              </div>
            </div>

            {/* Berichten */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {active.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm`}
                    style={{
                      background: msg.sender === "admin" ? "#1A7A6A" : "rgba(255,255,255,0.08)",
                      color: msg.sender === "admin" ? "#fff" : "rgba(255,255,255,0.85)",
                      borderRadius: msg.sender === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    }}>
                    {msg.content}
                    <p className="text-xs mt-1" style={{ color: msg.sender === "admin" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)" }}>
                      {new Date(msg.createdAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply input */}
            <form onSubmit={sendReply} className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <input
                type="text"
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Typ je antwoord..."
                className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none placeholder-gray-500"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "inherit" }}
              />
              <button type="submit" disabled={sending || !reply.trim()}
                className="text-white font-bold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0 disabled:opacity-50"
                style={{ background: "#1A7A6A" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
