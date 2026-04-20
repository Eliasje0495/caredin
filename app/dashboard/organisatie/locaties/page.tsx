"use client";
import { useState, useEffect } from "react";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
}

const emptyForm = { name: "", address: "", city: "", postalCode: "" };

export default function LocatiesPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/locations");
    const data = await res.json();
    setLocations(data.locations ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAdding(true);
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Fout"); setAdding(false); return; }
    setForm(emptyForm);
    await load();
    setAdding(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Locatie verwijderen?")) return;
    await fetch(`/api/locations/${id}`, { method: "DELETE" });
    await load();
  }

  function startEdit(loc: Location) {
    setEditId(loc.id);
    setEditForm({ name: loc.name, address: loc.address, city: loc.city, postalCode: loc.postalCode });
  }

  async function handleSave(id: string) {
    setSaving(true);
    await fetch(`/api/locations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditId(null);
    await load();
    setSaving(false);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Locaties
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Beheer de locaties van jouw organisatie.</p>
        </div>

        {/* Add form */}
        <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: "0.5px solid var(--border)" }}>
          <h2 className="text-base font-bold mb-4" style={{ color: "var(--dark)" }}>Nieuwe locatie toevoegen</h2>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Naam locatie</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="bijv. Locatie Noord"
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Adres</label>
                <input
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Straatnaam 1"
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Stad</label>
                <input
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Amsterdam"
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Postcode</label>
                <input
                  value={form.postalCode}
                  onChange={e => setForm({ ...form, postalCode: e.target.value })}
                  placeholder="1234 AB"
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--teal)", border: "none", fontFamily: "inherit", cursor: "pointer", opacity: adding ? 0.6 : 1 }}
            >
              {adding ? "Toevoegen…" : "Locatie toevoegen"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--muted)" }}>Laden…</div>
          ) : locations.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--muted)" }}>Nog geen locaties toegevoegd.</div>
          ) : (
            <ul>
              {locations.map((loc, i) => (
                <li key={loc.id} style={{ borderBottom: i < locations.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                  {editId === loc.id ? (
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Naam</label>
                          <input
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Adres</label>
                          <input
                            value={editForm.address}
                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Stad</label>
                          <input
                            value={editForm.city}
                            onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Postcode</label>
                          <input
                            value={editForm.postalCode}
                            onChange={e => setEditForm({ ...editForm, postalCode: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(loc.id)}
                          disabled={saving}
                          className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                          style={{ background: "var(--teal)", border: "none", fontFamily: "inherit", cursor: "pointer" }}
                        >
                          {saving ? "Opslaan…" : "Opslaan"}
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-4 py-1.5 rounded-xl text-xs font-semibold"
                          style={{ background: "var(--bg)", border: "0.5px solid var(--border)", fontFamily: "inherit", cursor: "pointer", color: "var(--muted)" }}
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center px-5 py-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: "var(--dark)" }}>{loc.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {loc.address}, {loc.postalCode} {loc.city}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(loc)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                          style={{ background: "var(--bg)", border: "0.5px solid var(--border)", fontFamily: "inherit", cursor: "pointer", color: "var(--dark)" }}
                        >
                          Bewerken
                        </button>
                        <button
                          onClick={() => handleDelete(loc.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                          style={{ background: "#FEF2F2", border: "0.5px solid #FECACA", fontFamily: "inherit", cursor: "pointer", color: "#991B1B" }}
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
