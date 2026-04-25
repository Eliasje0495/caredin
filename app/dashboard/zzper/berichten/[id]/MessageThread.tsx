"use client";
import { useState, useRef, useEffect } from "react";

interface Msg { id: string; senderId: string; content: string; createdAt: string; read: boolean; }

export default function MessageThread({
  conversationId, currentUserId, initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input,    setInput]    = useState("");
  const [sending,  setSending]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || sending) return;
    setSending(true);
    const res = await fetch(`/api/berichten/${conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setInput("");
    }
    setSending(false);
  }

  return (
    <div className="rounded-2xl bg-white overflow-hidden flex flex-col" style={{ border: "0.5px solid var(--border)", minHeight: 480 }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ maxHeight: 500 }}>
        {messages.length === 0 && (
          <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>Stuur het eerste bericht.</p>
        )}
        {messages.map(m => {
          const mine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                style={{
                  background: mine ? "var(--teal)" : "var(--teal-light)",
                  color: mine ? "#fff" : "var(--dark)",
                  borderBottomRightRadius: mine ? 4 : undefined,
                  borderBottomLeftRadius: mine ? undefined : 4,
                }}>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{m.content}</p>
                <div className="text-[10px] mt-1" style={{ color: mine ? "rgba(255,255,255,0.6)" : "var(--muted)" }}>
                  {new Date(m.createdAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex gap-3" style={{ borderTop: "0.5px solid var(--border)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Typ een bericht..."
          className="flex-1 px-4 py-2 rounded-[40px] text-sm outline-none"
          style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--dark)" }}
        />
        <button onClick={send} disabled={sending || !input.trim()}
          className="px-5 py-2 rounded-[40px] text-sm font-semibold text-white"
          style={{ background: sending || !input.trim() ? "var(--muted)" : "var(--teal)", border: "none", cursor: sending ? "not-allowed" : "pointer" }}>
          Stuur
        </button>
      </div>
    </div>
  );
}
