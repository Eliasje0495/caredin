"use client";
import { useEffect, useRef, useState } from "react";

type VogStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

interface VogData {
  vogUrl: string | null;
  vogStatus: VogStatus;
  vogVerifiedAt: string | null;
  vogExpiresAt: string | null;
  vogRejectedReason: string | null;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export default function VogPage() {
  const [vog, setVog] = useState<VogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchVog() {
    const res = await fetch("/api/profile/vog");
    if (res.ok) {
      const data = await res.json();
      setVog(data.vog);
    }
    setLoading(false);
  }

  useEffect(() => { fetchVog(); }, []);

  function handleFileSelect(file: File) {
    setUploadError(null);
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Alleen PDF, JPG of PNG toegestaan");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Bestand mag maximaal 5MB zijn");
      return;
    }
    setSelectedFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch("/api/profile/vog", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload mislukt");
      } else {
        setSelectedFile(null);
        await fetchVog();
      }
    } catch {
      setUploadError("Er is een fout opgetreden. Probeer opnieuw.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Weet je zeker dat je je VOG wilt verwijderen?")) return;
    await fetch("/api/profile/vog", { method: "DELETE" });
    await fetchVog();
  }

  const showUploadForm = !vog || vog.vogStatus === "UNVERIFIED" || vog.vogStatus === "REJECTED";

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 rounded-xl bg-gray-100 w-48" />
          <div className="h-32 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          VOG uploaden
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Een Verklaring Omtrent Gedrag (VOG) is vereist voor sommige zorginstellingen. Je VOG wordt geverifieerd door CaredIn.
        </p>
      </div>

      {/* Status banner */}
      {vog?.vogStatus === "UNVERIFIED" || !vog ? (
        <div className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ background: "#F3F4F6", border: "0.5px solid #E5E7EB" }}>
          <span className="text-xl">📄</span>
          <span className="text-sm font-medium" style={{ color: "#6B7280" }}>Nog geen VOG geüpload</span>
        </div>
      ) : vog.vogStatus === "PENDING" ? (
        <div className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ background: "#FFF7ED", border: "0.5px solid #FED7AA" }}>
          <span className="text-xl">⏳</span>
          <span className="text-sm font-medium" style={{ color: "#92400E" }}>
            VOG in behandeling — we controleren je document binnen 1 werkdag
          </span>
        </div>
      ) : vog.vogStatus === "VERIFIED" ? (
        <div className="rounded-2xl px-5 py-4 space-y-1"
          style={{ background: "#ECFDF5", border: "0.5px solid #A7F3D0" }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <span className="text-sm font-bold" style={{ color: "#065F46" }}>VOG geverifieerd</span>
          </div>
          <p className="text-xs pl-9" style={{ color: "#065F46" }}>
            Geldig tot: {formatDate(vog.vogExpiresAt)}
          </p>
          {vog.vogUrl && (
            <div className="pl-9 pt-1">
              <button
                onClick={() => {
                  const win = window.open();
                  if (win && vog.vogUrl) {
                    win.document.write(`<iframe src="${vog.vogUrl}" style="width:100%;height:100vh;border:none;"></iframe>`);
                  }
                }}
                className="text-xs font-semibold underline cursor-pointer"
                style={{ color: "#065F46", background: "none", border: "none" }}
              >
                Document bekijken →
              </button>
            </div>
          )}
          <div className="pl-9 pt-1">
            <button
              onClick={handleDelete}
              className="text-xs cursor-pointer"
              style={{ color: "#6B7280", background: "none", border: "none" }}
            >
              Verwijderen
            </button>
          </div>
        </div>
      ) : vog.vogStatus === "REJECTED" ? (
        <div className="rounded-2xl px-5 py-4 space-y-1"
          style={{ background: "#FEF2F2", border: "0.5px solid #FECACA" }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">❌</span>
            <span className="text-sm font-bold" style={{ color: "#991B1B" }}>
              VOG afgekeurd: {vog.vogRejectedReason ?? "Niet goedgekeurd"}
            </span>
          </div>
          <p className="text-xs pl-9" style={{ color: "#991B1B" }}>
            Upload een nieuw document hieronder.
          </p>
        </div>
      ) : null}

      {/* Upload form */}
      {showUploadForm && (
        <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
          <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--dark)" }}>
            VOG document uploaden
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drag & drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelect(file);
              }}
              className="rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-10 px-6 text-center transition-colors"
              style={{
                borderColor: dragOver ? "var(--teal)" : "var(--border)",
                background: dragOver ? "var(--teal-light)" : "#FAFAFA",
              }}
            >
              <div className="text-3xl mb-3">📎</div>
              {selectedFile ? (
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{selectedFile.name}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>
                    Sleep je bestand hierheen of klik om te kiezen
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    PDF, JPG of PNG — max. 5 MB
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            {uploadError && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#FEF2F2", color: "#991B1B" }}>
                {uploadError}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-opacity"
              style={{
                background: "var(--teal)",
                opacity: !selectedFile || uploading ? 0.5 : 1,
                border: "none",
                cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {uploading ? "Bezig met uploaden…" : "VOG uploaden"}
            </button>
          </form>
        </div>
      )}

      {/* Info card */}
      <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">ℹ️</span>
          <h3 className="text-[14px] font-bold" style={{ color: "var(--dark)" }}>Wat is een VOG?</h3>
        </div>
        <div className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          <p>
            Een VOG (Verklaring Omtrent Gedrag) is een officieel document van de overheid waaruit blijkt dat jouw gedrag uit het verleden geen bezwaar vormt voor de functie die je wil uitoefenen.
          </p>
          <p>
            <strong style={{ color: "var(--dark)" }}>Aanvragen via:</strong>{" "}
            <a href="https://www.justis.nl" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--teal)" }}>
              justis.nl
            </a>
          </p>
          <p>
            <strong style={{ color: "var(--dark)" }}>Kosten:</strong> €41,35
          </p>
          <p>
            <strong style={{ color: "var(--dark)" }}>Verwerkingstijd:</strong> 4–8 weken (digitaal via DigiD vaak sneller)
          </p>
          <p>
            <strong style={{ color: "var(--dark)" }}>Geldigheid op CaredIn:</strong> 3 jaar na verificatie
          </p>
        </div>
      </div>
    </div>
  );
}
