"use client";
import { useState, useEffect, useRef } from "react";

const FAQS = [
  { q: "Hoe werkt CaredIn?",                  href: "/hoe-het-werkt" },
  { q: "Hoe maak ik een profiel aan?",         href: "/aanmelden" },
  { q: "Welke verificaties zijn vereist?",     href: "/veelgestelde-vragen" },
  { q: "Hoe worden tarieven berekend?",        href: "/veelgestelde-vragen" },
  { q: "Kan ik ook als instelling meedoen?",   href: "/voor-instellingen" },
];

type Tab = "home" | "berichten" | "help";
interface Message { id: string; sender: string; content: string; createdAt: string; }

export default function ChatWidget() {
  const [open, setOpen]                       = useState(false);
  const [tab, setTab]                         = useState<Tab>("home");
  const [name, setName]                       = useState("");
  const [email, setEmail]                     = useState("");
  const [input, setInput]                     = useState("");
  const [sending, setSending]                 = useState(false);
  const [conversationId, setConversationId]   = useState<string | null>(null);
  const [messages, setMessages]               = useState<Message[]>([]);
  const [lastAt, setLastAt]                   = useState<string | null>(null);
  const [hasUnread, setHasUnread]             = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll for new messages every 3s
  useEffect(() => {
    if (!conversationId) return;
    const poll = async () => {
      const url = `/api/chat/conversation?id=${conversationId}${lastAt ? `&after=${encodeURIComponent(lastAt)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.messages?.length) {
        setMessages(prev => {
          const ids = new Set(prev.map(m => m.id));
          const newMsgs = data.messages.filter((m: Message) => !ids.has(m.id));
          if (newMsgs.length) {
            setLastAt(newMsgs[newMsgs.length - 1].createdAt);
            if (!open || tab !== "berichten") setHasUnread(true);
            return [...prev, ...newMsgs];
          }
          return prev;
        });
      }
    };
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [conversationId, lastAt, open, tab]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open && tab === "berichten") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasUnread(false);
    }
  }, [messages, open, tab]);

  async function startOrSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);

    if (!conversationId) {
      if (!email || !email.includes("@")) { setSending(false); return; }
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorName: name, visitorEmail: email, message: input }),
      });
      const data = await res.json();
      if (data.conversationId) {
        setConversationId(data.conversationId);
        setMessages([{ id: "tmp-" + Date.now(), sender: "visitor", content: input, createdAt: new Date().toISOString() }]);
      }
    } else {
      const res = await fetch("/api/chat/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: conversationId, content: input }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        setLastAt(data.message.createdAt);
      }
    }

    setInput("");
    setSending(false);
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[580px] bg-white rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden"
          style={{ border: "1px solid #e5e7eb" }}>

          {/* Header */}
          <div className="px-5 pt-5 pb-14 flex-shrink-0" style={{ background: "#0F1C1A" }}>
            <div className="flex items-center justify-between mb-5">
              <span className="font-black text-sm tracking-tight" style={{ color: "#5DB8A4" }}>
                Care<span style={{ color: "rgba(255,255,255,0.8)" }}>din</span>
              </span>
              <button onClick={() => setOpen(false)} style={{ color: "rgba(255,255,255,0.5)" }}
                className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="flex mb-4">
              <div className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center font-black text-base shadow-md"
                style={{ background: "#1A7A6A", color: "#fff" }}>C</div>
            </div>
            <h2 className="font-black text-2xl leading-snug" style={{ color: "#fff" }}>
              Hoi 👋<br />Hoe kunnen we je helpen?
            </h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto -mt-6 px-3 pb-3 space-y-3">

            {/* HOME */}
            {tab === "home" && (
              <>
                <button onClick={() => setTab("berichten")}
                  className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-bold text-gray-950 text-sm">Stuur ons een bericht</p>
                    <p className="text-gray-400 text-xs mt-0.5">We reageren live of binnen 1 werkdag</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>

                <a href="https://wa.me/31613038950" target="_blank" rel="noopener noreferrer"
                  className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-950 text-sm">WhatsApp ons</p>
                      <p className="text-gray-400 text-xs mt-0.5">Snel antwoord via WhatsApp</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="m9 18 6-6-6-6"/></svg>
                </a>

                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                    <p className="font-bold text-gray-950 text-sm">Vind je antwoord</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </div>
                  {FAQS.map((f, i) => (
                    <a key={f.q} href={f.href}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-white transition-colors ${i < FAQS.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <span className="text-gray-700 text-sm">{f.q}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 flex-shrink-0"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* BERICHTEN */}
            {tab === "berichten" && (
              <div className="flex flex-col gap-3">
                {!conversationId && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-2">
                    <p className="text-xs text-gray-500 font-semibold">Laat je gegevens achter zodat we je kunnen bereiken</p>
                    <input type="text" placeholder="Jouw naam" value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                      style={{ fontFamily: "inherit" }} />
                    <input type="email" placeholder="E-mailadres (verplicht)" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                      style={{ fontFamily: "inherit" }} />
                  </div>
                )}

                <div className="space-y-2 px-1">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                      style={{ background: "#1A7A6A" }}>C</div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
                      <p className="text-gray-800 text-sm">Hoi! 👋 We proberen zo snel mogelijk te reageren.</p>
                    </div>
                  </div>
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "visitor" ? "justify-end" : "items-end gap-2"}`}>
                      {msg.sender === "admin" && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                          style={{ background: "#1A7A6A" }}>C</div>
                      )}
                      <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                        msg.sender === "visitor"
                          ? "text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`} style={msg.sender === "visitor" ? { background: "#1A7A6A" } : {}}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={startOrSend} className="flex gap-2 items-end">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Typ een bericht..."
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                    style={{ fontFamily: "inherit" }}
                  />
                  <button type="submit" disabled={sending || !input.trim()}
                    className="w-9 h-9 text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50"
                    style={{ background: "#1A7A6A" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </button>
                </form>
              </div>
            )}

            {/* HELP */}
            {tab === "help" && (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-950 text-sm">Veelgestelde vragen</p>
                </div>
                {FAQS.map((f, i) => (
                  <a key={f.q} href={f.href}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-white transition-colors ${i < FAQS.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="text-gray-700 text-sm">{f.q}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 flex-shrink-0"><path d="m9 18 6-6-6-6"/></svg>
                  </a>
                ))}
                <div className="px-4 py-3 border-t border-gray-100">
                  <a href="/veelgestelde-vragen" className="text-xs font-semibold hover:underline" style={{ color: "#1A7A6A" }}>
                    Alle vragen →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bottom nav */}
          <div className="border-t border-gray-100 flex flex-shrink-0 bg-white">
            {([
              { id: "home",      label: "Home",      icon: <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
              { id: "berichten", label: "Berichten",  icon: <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
              { id: "help",      label: "Help",       icon: <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors relative ${tab === t.id ? "" : "text-gray-400"}`}
                style={tab === t.id ? { color: "#1A7A6A" } : {}}>
                {t.icon}
                {t.label}
                {t.id === "berichten" && hasUnread && (
                  <span className="absolute top-2 right-6 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button onClick={() => { setOpen(o => !o); if (!open) setHasUnread(false); }}
        className="fixed bottom-5 right-5 sm:right-6 w-14 h-14 text-white rounded-full shadow-2xl z-[9999] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ background: "#1A7A6A", boxShadow: "0 8px 32px rgba(26,122,106,0.4)" }}
        aria-label="Chat openen">
        {hasUnread && !open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
        )}
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  );
}
