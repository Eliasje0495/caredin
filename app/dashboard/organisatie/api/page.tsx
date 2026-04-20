"use client";
import { useEffect, useState } from "react";

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  isActive: boolean;
  createdAt: string;
}

interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  description: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { deliveries: number };
}

const EVENT_LABELS: Record<string, string> = {
  "shift.applied": "Nieuwe aanmelding",
  "shift.filled": "Dienst ingevuld",
  "shift.cancelled": "Dienst geannuleerd",
  "worker.checkin": "Professional ingecheckt",
  "worker.checkout": "Professional uitgecheckt",
  "hours.approved": "Uren goedgekeurd",
};

const ALL_EVENTS = Object.keys(EVENT_LABELS);

export default function ApiIntegratiePage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Webhook state
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [webhooksLoading, setWebhooksLoading] = useState(true);
  const [whUrl, setWhUrl] = useState("");
  const [whEvents, setWhEvents] = useState<string[]>([]);
  const [whDescription, setWhDescription] = useState("");
  const [whCreating, setWhCreating] = useState(false);
  const [whError, setWhError] = useState<string | null>(null);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  async function loadKeys() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/api-keys");
      const data = await res.json();
      setKeys(data.keys ?? []);
    } catch {
      setError("Fout bij ophalen sleutels");
    } finally {
      setLoading(false);
    }
  }

  async function loadWebhooks() {
    setWebhooksLoading(true);
    try {
      const res = await fetch("/api/dashboard/webhooks");
      const data = await res.json();
      setWebhooks(data.webhooks ?? []);
    } catch {
      setWhError("Fout bij ophalen webhooks");
    } finally {
      setWebhooksLoading(false);
    }
  }

  useEffect(() => {
    loadKeys();
    loadWebhooks();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Fout"); return; }
      setCreatedKey(data.key);
      setNewName("");
      await loadKeys();
    } catch {
      setError("Fout bij aanmaken sleutel");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Weet je zeker dat je deze sleutel wilt deactiveren?")) return;
    try {
      await fetch(`/api/dashboard/api-keys/${id}`, { method: "DELETE" });
      await loadKeys();
    } catch {
      setError("Fout bij deactiveren sleutel");
    }
  }

  function handleCopy() {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleEvent(ev: string) {
    setWhEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]
    );
  }

  async function handleCreateWebhook(e: React.FormEvent) {
    e.preventDefault();
    if (!whUrl.trim() || whEvents.length === 0) return;
    setWhCreating(true);
    setWhError(null);
    try {
      const res = await fetch("/api/dashboard/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: whUrl.trim(), events: whEvents, description: whDescription.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setWhError(data.error ?? "Fout"); return; }
      setCreatedSecret(data.secret);
      setWhUrl("");
      setWhEvents([]);
      setWhDescription("");
      await loadWebhooks();
    } catch {
      setWhError("Fout bij aanmaken webhook");
    } finally {
      setWhCreating(false);
    }
  }

  async function handleDeleteWebhook(id: string) {
    if (!confirm("Weet je zeker dat je deze webhook wilt deactiveren?")) return;
    try {
      await fetch(`/api/dashboard/webhooks/${id}`, { method: "DELETE" });
      await loadWebhooks();
    } catch {
      setWhError("Fout bij deactiveren webhook");
    }
  }

  function handleCopySecret() {
    if (!createdSecret) return;
    navigator.clipboard.writeText(createdSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "32px 40px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--dark)",
            margin: 0,
            marginBottom: 8,
          }}>
            API Integratie
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            Beheer API-sleutels om diensten te beheren via de CaredIn REST API.
          </p>
        </div>

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 14,
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* New key revealed */}
        {createdKey && (
          <div style={{
            background: "#FFFBEB",
            border: "1.5px solid #FCD34D",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#92400E", marginBottom: 8 }}>
              Sla deze sleutel op — je ziet hem maar één keer
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <code style={{
                flex: 1,
                background: "#fff",
                border: "1px solid #FCD34D",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                fontFamily: "monospace",
                wordBreak: "break-all",
                color: "#1F2937",
              }}>
                {createdKey}
              </code>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? "var(--teal)" : "var(--dark)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}>
                {copied ? "Gekopieerd!" : "Kopieer"}
              </button>
            </div>
            <button
              onClick={() => setCreatedKey(null)}
              style={{
                marginTop: 12,
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}>
              Sluiten
            </button>
          </div>
        )}

        {/* Create new key */}
        <div style={{
          background: "#fff",
          border: "0.5px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--dark)",
            margin: "0 0 16px 0",
          }}>
            Nieuwe sleutel aanmaken
          </h2>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              placeholder="Naam (bijv. Mijn Systeem)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{
                flex: 1,
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 14,
                fontFamily: "inherit",
                color: "var(--dark)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              style={{
                background: "var(--teal)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: creating ? "not-allowed" : "pointer",
                opacity: creating || !newName.trim() ? 0.6 : 1,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}>
              {creating ? "Aanmaken…" : "Aanmaken"}
            </button>
          </form>
        </div>

        {/* Keys list */}
        <div style={{
          background: "#fff",
          border: "0.5px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 32,
        }}>
          <div style={{
            padding: "16px 24px",
            borderBottom: "0.5px solid var(--border)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--dark)",
              margin: 0,
            }}>
              Bestaande sleutels
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: 24, color: "var(--muted)", fontSize: 14 }}>Laden…</div>
          ) : keys.length === 0 ? (
            <div style={{ padding: 24, color: "var(--muted)", fontSize: 14 }}>
              Nog geen API-sleutels aangemaakt.
            </div>
          ) : (
            keys.map((k, i) => (
              <div
                key={k.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 24px",
                  borderTop: i > 0 ? "0.5px solid var(--border)" : undefined,
                  gap: 16,
                }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "var(--dark)" }}>{k.name}</span>
                    {k.isActive ? (
                      <span style={{
                        background: "#D1FAE5",
                        color: "#065F46",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}>Actief</span>
                    ) : (
                      <span style={{
                        background: "#FEE2E2",
                        color: "#991B1B",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}>Inactief</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--muted)" }}>
                    <code style={{ fontFamily: "monospace", fontSize: 12 }}>{k.keyPrefix}</code>
                    <span>Aangemaakt {new Date(k.createdAt).toLocaleDateString("nl-NL")}</span>
                    {k.lastUsedAt && (
                      <span>Laatst gebruikt {new Date(k.lastUsedAt).toLocaleDateString("nl-NL")}</span>
                    )}
                  </div>
                </div>
                {k.isActive && (
                  <button
                    onClick={() => handleDelete(k.id)}
                    style={{
                      background: "none",
                      border: "1px solid #FECACA",
                      color: "#DC2626",
                      borderRadius: 8,
                      padding: "6px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      flexShrink: 0,
                    }}>
                    Deactiveer
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* ── WEBHOOKS SECTION ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--dark)",
              margin: "0 0 6px 0",
            }}>
              Webhooks
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
              Ontvang real-time notificaties bij gebeurtenissen in CaredIn.
            </p>
          </div>

          {whError && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 14,
              marginBottom: 20,
            }}>
              {whError}
            </div>
          )}

          {/* New signing secret revealed */}
          {createdSecret && (
            <div style={{
              background: "#FFFBEB",
              border: "1.5px solid #FCD34D",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#92400E", marginBottom: 4 }}>
                Sla dit signing secret op — je ziet het maar één keer
              </div>
              <p style={{ fontSize: 12, color: "#92400E", margin: "0 0 12px 0" }}>
                Gebruik dit secret om de <code style={{ fontFamily: "monospace" }}>X-CaredIn-Signature</code> header te valideren.
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <code style={{
                  flex: 1,
                  background: "#fff",
                  border: "1px solid #FCD34D",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  color: "#1F2937",
                }}>
                  {createdSecret}
                </code>
                <button
                  onClick={handleCopySecret}
                  style={{
                    background: secretCopied ? "var(--teal)" : "var(--dark)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                    flexShrink: 0,
                  }}>
                  {secretCopied ? "Gekopieerd!" : "Kopieer"}
                </button>
              </div>
              <button
                onClick={() => setCreatedSecret(null)}
                style={{
                  marginTop: 12,
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                }}>
                Sluiten
              </button>
            </div>
          )}

          {/* Create webhook form */}
          <div style={{
            background: "#fff",
            border: "0.5px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}>
            <h3 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--dark)",
              margin: "0 0 16px 0",
            }}>
              Nieuwe webhook toevoegen
            </h3>
            <form onSubmit={handleCreateWebhook}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--dark)", marginBottom: 6 }}>
                  Endpoint URL
                </label>
                <input
                  type="url"
                  placeholder="https://jouwsysteem.nl/webhook"
                  value={whUrl}
                  onChange={e => setWhUrl(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "var(--dark)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--dark)", marginBottom: 8 }}>
                  Events
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {ALL_EVENTS.map((ev) => (
                    <label key={ev} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      fontSize: 13,
                      color: "var(--dark)",
                      background: whEvents.includes(ev) ? "#F0FDF4" : "#F9FAFB",
                      border: `1px solid ${whEvents.includes(ev) ? "#BBF7D0" : "var(--border)"}`,
                      borderRadius: 8,
                      padding: "6px 12px",
                      userSelect: "none",
                    }}>
                      <input
                        type="checkbox"
                        checked={whEvents.includes(ev)}
                        onChange={() => toggleEvent(ev)}
                        style={{ accentColor: "var(--teal)" }}
                      />
                      <span>{EVENT_LABELS[ev]}</span>
                      <code style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>{ev}</code>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--dark)", marginBottom: 6 }}>
                  Beschrijving (optioneel)
                </label>
                <input
                  type="text"
                  placeholder="Bijv. Koppeling met HR-systeem"
                  value={whDescription}
                  onChange={e => setWhDescription(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "var(--dark)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={whCreating || !whUrl.trim() || whEvents.length === 0}
                style={{
                  background: "var(--teal)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: whCreating || !whUrl.trim() || whEvents.length === 0 ? "not-allowed" : "pointer",
                  opacity: whCreating || !whUrl.trim() || whEvents.length === 0 ? 0.6 : 1,
                  fontFamily: "inherit",
                }}>
                {whCreating ? "Toevoegen…" : "Webhook toevoegen"}
              </button>
            </form>
          </div>

          {/* Webhooks list */}
          <div style={{
            background: "#fff",
            border: "0.5px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "16px 24px",
              borderBottom: "0.5px solid var(--border)",
            }}>
              <h3 style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: 17,
                fontWeight: 700,
                color: "var(--dark)",
                margin: 0,
              }}>
                Bestaande webhooks
              </h3>
            </div>

            {webhooksLoading ? (
              <div style={{ padding: 24, color: "var(--muted)", fontSize: 14 }}>Laden…</div>
            ) : webhooks.length === 0 ? (
              <div style={{ padding: 24, color: "var(--muted)", fontSize: 14 }}>
                Nog geen webhooks ingesteld.
              </div>
            ) : (
              webhooks.map((wh, i) => (
                <div
                  key={wh.id}
                  style={{
                    padding: "16px 24px",
                    borderTop: i > 0 ? "0.5px solid var(--border)" : undefined,
                  }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <code style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          color: "var(--dark)",
                          fontWeight: 600,
                          wordBreak: "break-all",
                        }}>
                          {wh.url}
                        </code>
                        {wh.isActive ? (
                          <span style={{
                            background: "#D1FAE5",
                            color: "#065F46",
                            borderRadius: 20,
                            padding: "2px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}>Actief</span>
                        ) : (
                          <span style={{
                            background: "#FEE2E2",
                            color: "#991B1B",
                            borderRadius: 20,
                            padding: "2px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}>Inactief</span>
                        )}
                      </div>

                      {wh.description && (
                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                          {wh.description}
                        </div>
                      )}

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                        {wh.events.map((ev) => (
                          <span key={ev} style={{
                            background: "#EEF2FF",
                            color: "#3730A3",
                            borderRadius: 6,
                            padding: "2px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "monospace",
                          }}>
                            {ev}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 16 }}>
                        <span>{wh._count.deliveries} leveringen</span>
                        <span>Aangemaakt {new Date(wh.createdAt).toLocaleDateString("nl-NL")}</span>
                      </div>
                    </div>

                    {wh.isActive && (
                      <button
                        onClick={() => handleDeleteWebhook(wh.id)}
                        style={{
                          background: "none",
                          border: "1px solid #FECACA",
                          color: "#DC2626",
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          flexShrink: 0,
                        }}>
                        Deactiveer
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Documentation */}
        <div style={{
          background: "#fff",
          border: "0.5px solid var(--border)",
          borderRadius: 16,
          padding: 24,
        }}>
          <h2 style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--dark)",
            margin: "0 0 16px 0",
          }}>
            Documentatie
          </h2>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Base URL
            </div>
            <code style={{
              display: "block",
              background: "#F9FAFB",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              fontFamily: "monospace",
              color: "var(--dark)",
            }}>
              https://caredin.nl/api/v1
            </code>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Authenticatie
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 8px 0" }}>
              Voeg je API-sleutel toe als Bearer token in de Authorization header.
            </p>
            <pre style={{
              background: "#1E293B",
              color: "#94A3B8",
              borderRadius: 10,
              padding: "14px 18px",
              fontSize: 12,
              fontFamily: "monospace",
              overflowX: "auto",
              margin: 0,
            }}>
{`Authorization: Bearer sk_live_...`}
            </pre>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Voorbeelden
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Diensten ophalen</div>
              <pre style={{
                background: "#1E293B",
                color: "#94A3B8",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 12,
                fontFamily: "monospace",
                overflowX: "auto",
                margin: 0,
              }}>
{`curl https://caredin.nl/api/v1/shifts \\
  -H "Authorization: Bearer sk_live_..."`}
              </pre>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Dienst aanmaken</div>
              <pre style={{
                background: "#1E293B",
                color: "#94A3B8",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 12,
                fontFamily: "monospace",
                overflowX: "auto",
                margin: 0,
              }}>
{`curl -X POST https://caredin.nl/api/v1/shifts \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Verpleegkundige nachtdienst",
    "sector": "VVT",
    "function": "VERPLEEGKUNDIGE",
    "address": "Kerkstraat 1",
    "city": "Amsterdam",
    "postalCode": "1012 AB",
    "startTime": "2026-05-01T22:00:00Z",
    "endTime": "2026-05-02T06:00:00Z",
    "hourlyRate": 38.50
  }'`}
              </pre>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Aanmelding accepteren</div>
              <pre style={{
                background: "#1E293B",
                color: "#94A3B8",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 12,
                fontFamily: "monospace",
                overflowX: "auto",
                margin: 0,
              }}>
{`curl -X PATCH https://caredin.nl/api/v1/applications/{id} \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"status": "ACCEPTED"}'`}
              </pre>
            </div>
          </div>

          <div style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 13,
            color: "#15803D",
          }}>
            <strong>Endpoints:</strong> GET/POST /shifts &nbsp;|&nbsp; GET/PATCH/DELETE /shifts/{"{id}"} &nbsp;|&nbsp; GET /shifts/{"{id}"}/applications &nbsp;|&nbsp; PATCH /applications/{"{id}"} &nbsp;|&nbsp; GET /workers &nbsp;|&nbsp; GET /workers/{"{id}"} &nbsp;|&nbsp; GET /timesheets &nbsp;|&nbsp; GET /timesheets/export
          </div>
        </div>
      </div>
    </div>
  );
}
