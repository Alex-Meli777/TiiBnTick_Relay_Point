"use client";

import { useEffect, useState } from "react";
import { Shield, Lock } from "lucide-react";
import type { RelayPoint, StoredRelayPointApplication } from "@/types/relayPoint";
import { RELAY_POINT_TYPE_LABELS } from "@/types/relayPoint";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "points" | "applications" | "creer";
type Toast = { message: string; type: "success" | "error" } | null;

// ─── Composant Toast ──────────────────────────────────────────────────────────

function ToastMsg({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {toast.type === "success" ? "✓" : "✗"} {toast.message}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("points");
  const [connected, setConnected] = useState(false);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [pointsCount, setPointsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const [pointsRes, appsRes] = await Promise.all([
          fetch("/api/relay-points?latitude=3.87&longitude=11.52&radiusKm=9999"),
          fetch("/api/relay-points/applications?status=pending"),
        ]);

        const pointsData = await pointsRes.json();
        const appsData = await appsRes.json();

        if (pointsData?.success) {
          setPointsCount(Array.isArray(pointsData.data) ? pointsData.data.length : 0);
        }
        if (appsData?.success) {
          setApplicationsCount(Array.isArray(appsData.data) ? appsData.data.length : 0);
        }
      } catch (error) {
        console.error("Unable to load dashboard stats", error);
      }
    }

    loadDashboardStats();
  }, []);

  // ── Login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setConnected(true);
        showToast("Connecté en admin ✓", "success");
      } else {
        showToast("Mot de passe incorrect", "error");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-4">
        <ToastMsg toast={toast} onClose={() => setToast(null)} />
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-[#1e2a4a] mb-2">Espace Admin</h1>
            <p className="text-sm text-[#5a6b8a]">Connectez-vous pour gérer les points relais.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-[#1e2a4a] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Mot de passe admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
                  required
                />
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-2xl bg-orange-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-7 rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-800">Gestion sécurisée des points relais</p>
            <p className="mt-2">Cet espace est réservé aux administrateurs. Vos actions sont enregistrées.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">TiiBnTick Admin</p>
            <h1 className="text-3xl font-black text-gray-900 md:text-4xl">Tableau de bord point relais</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">Gérez les points relais, validez les candidatures et suivez l’activité depuis un seul espace.</p>
          </div>
          <button
            onClick={async () => { await fetch("/api/admin-auth/login", { method: "DELETE" }); setConnected(false); }}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 transition hover:opacity-95"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="rounded-[32px] border border-orange-100 bg-white/90 p-6 shadow-sm shadow-orange-50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Action rapide</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">Administration</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      { label: "Points", value: "points" as Tab },
                      { label: "Candidatures", value: "applications" as Tab },
                      { label: "Créer", value: "creer" as Tab },
                    ]
                  ).map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setTab(item.value)}
                      className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${tab === item.value ? "bg-orange-600 text-white shadow-lg shadow-orange-200/50" : "bg-orange-50 text-orange-700 hover:bg-orange-100"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-orange-100 bg-white/90 p-6 shadow-sm shadow-orange-50">
              {tab === "points" && <PointsTab showToast={showToast} />}
              {tab === "applications" && <ApplicationsTab showToast={showToast} />}
              {tab === "creer" && <CreerTab showToast={showToast} onCreated={() => setTab("points")} />}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-orange-100 bg-white/90 p-6 shadow-sm shadow-orange-50">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">Statut</p>
              <h3 className="mt-3 text-lg font-bold text-gray-900">Vue globale</h3>
              <p className="mt-2 text-sm text-gray-600">Résumé rapide des candidats, des points relais et des actions à valider.</p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-sm font-medium text-orange-700">Points relais actifs</p>
                  <p className="mt-2 text-3xl font-black text-gray-900">{pointsCount}</p>
                </div>
                <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-sm font-medium text-orange-700">Candidatures en attente</p>
                  <p className="mt-2 text-3xl font-black text-gray-900">{applicationsCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-orange-100 bg-white/90 p-6 shadow-sm shadow-orange-50">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">Aide rapide</p>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>Utilisez l’onglet <span className="font-semibold text-gray-900">Points relais</span> pour modifier ou supprimer les points actifs.</p>
                <p>Validez les candidatures dans <span className="font-semibold text-gray-900">Candidatures</span>.</p>
                <p>Créez un nouveau point relais depuis <span className="font-semibold text-gray-900">Créer</span>.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// ─── Onglet : Liste des points relais ─────────────────────────────────────────

function PointsTab({ showToast }: { showToast: (m: string, t: "success" | "error") => void }) {
  const [points, setPoints] = useState<RelayPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPoint, setEditPoint] = useState<RelayPoint | null>(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editStatus, setEditStatus] = useState<RelayPoint["status"]>("active");
  const [editFee, setEditFee] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/relay-points?latitude=3.87&longitude=11.52&radiusKm=9999");
      const data = await res.json();
      if (data.success) setPoints(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openEdit(p: RelayPoint) {
    setEditPoint(p);
    setEditName(p.name);
    setEditCapacity(String(p.capacity));
    setEditStatus(p.status);
    setEditFee(String(p.handlingFee));
  }

  async function handleSave() {
    if (!editPoint) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/relay-points/${editPoint.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, capacity: Number(editCapacity), status: editStatus, handlingFee: Number(editFee) }),
      });
      if (res.ok) {
        showToast("Point relais modifié avec succès !", "success");
        setEditPoint(null);
        load();
      } else {
        const d = await res.json();
        showToast(d.error ?? "Erreur lors de la modification", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    const res = await fetch(`/api/relay-points/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      showToast("Point relais supprimé.", "success");
      load();
    } else {
      showToast(data.error ?? "Suppression impossible", "error");
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Points relais ({points.length})</h2>
        <button onClick={load} className="text-sm text-blue-600 hover:underline">↻ Actualiser</button>
      </div>

      {points.length === 0 && (
        <div className="text-center py-12 text-gray-400">Aucun point relais. Créez-en un dans l'onglet "Créer".</div>
      )}

      <div className="grid gap-4">
        {points.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800 truncate">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : p.status === "suspended" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {p.status === "active" ? "Actif" : p.status === "suspended" ? "Suspendu" : "En attente"}
                </span>
              </div>
              <p className="text-sm text-gray-500">{p.address}, {p.city} · {RELAY_POINT_TYPE_LABELS[p.type]}</p>
              <p className="text-xs text-gray-400 mt-1">Capacité : {p.currentLoad}/{p.capacity} · Frais : {p.handlingFee} FCFA · ID : {p.id}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition">✏️ Modifier</button>
              <button onClick={() => handleDelete(p.id, p.name)} className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg transition">🗑 Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal modification */}
      {editPoint && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Modifier le point relais</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nom</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Capacité</label>
                <input type="number" value={editCapacity} onChange={e => setEditCapacity(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Frais de manutention (FCFA)</label>
                <input type="number" value={editFee} onChange={e => setEditFee(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Statut</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value as RelayPoint["status"])} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="active">Actif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="pending_validation">En attente de validation</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditPoint(null)} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Onglet : Candidatures ────────────────────────────────────────────────────

function ApplicationsTab({ showToast }: { showToast: (m: string, t: "success" | "error") => void }) {
  const [applications, setApplications] = useState<StoredRelayPointApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  async function load() {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/relay-points/applications" : `/api/relay-points/applications?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter]);

  async function handleApprove(id: string) {
    const res = await fetch(`/api/relay-points/applications/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.success) {
      showToast("Candidature approuvée — point relais créé !", "success");
      load();
    } else {
      showToast(data.error ?? "Erreur", "error");
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Rejeter cette candidature ?")) return;
    const res = await fetch(`/api/relay-points/applications/${id}/reject`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      showToast("Candidature refusée.", "success");
      load();
    } else {
      showToast(data.error ?? "Erreur", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Candidatures</h2>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg transition ${filter === f ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f === "pending" ? "En attente" : f === "approved" ? "Approuvées" : f === "rejected" ? "Refusées" : "Toutes"}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center py-12 text-gray-400">Chargement...</div>}

      {!loading && applications.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          {filter === "pending" ? "Aucune candidature en attente." : "Aucune candidature dans cette catégorie."}
          <br />
          <span className="text-sm">Pour tester, utilisez la page <a href="/relay-points/postuler" target="_blank" className="text-orange-600 underline">Postuler</a></span>
        </div>
      )}

      <div className="grid gap-4">
        {applications.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{a.businessName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === "pending" ? "bg-yellow-100 text-yellow-700" : a.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {a.status === "pending" ? "En attente" : a.status === "approved" ? "Approuvée" : "Refusée"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">👤 {a.applicantName} · 📞 {a.applicantPhone}</p>
                <p className="text-sm text-gray-500">{a.address}, {a.city} ({a.region}) · {RELAY_POINT_TYPE_LABELS[a.type]}</p>
                <p className="text-xs text-gray-400 mt-1">Soumis le {new Date(a.submittedAt).toLocaleDateString("fr-FR")} · ID : {a.id}</p>
              </div>
              {a.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleApprove(a.id)} className="text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg transition">✅ Autoriser</button>
                  <button onClick={() => handleReject(a.id)} className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg transition">❌ Refuser</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Onglet : Créer un point relais ──────────────────────────────────────────

function CreerTab({ showToast, onCreated }: { showToast: (m: string, t: "success" | "error") => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "", type: "shop", country: "Cameroun", region: "", city: "",
    address: "", lieuDit: "", latitude: "", longitude: "",
    ownerName: "", ownerPhone: "", capacity: "", handlingFee: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/relay-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          capacity: Number(form.capacity),
          handlingFee: Number(form.handlingFee),
          currentLoad: 0,
          status: "active",
          openingHours: [
            { day: "mon", open: "08:00", close: "18:00" },
            { day: "tue", open: "08:00", close: "18:00" },
            { day: "wed", open: "08:00", close: "18:00" },
            { day: "thu", open: "08:00", close: "18:00" },
            { day: "fri", open: "08:00", close: "18:00" },
            { day: "sat", open: "09:00", close: "13:00" },
            { day: "sun", open: "00:00", close: "00:00" },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Point relais "${data.data.name}" créé avec succès !`, "success");
        onCreated();
      } else {
        showToast(data.error ?? "Erreur lors de la création", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  const input = (label: string, k: string, type = "text", placeholder = "") => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <input type={type} value={(form as Record<string, string>)[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Créer un nouveau point relais</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

        <div className="grid grid-cols-2 gap-4">
          {input("Nom du point relais *", "name", "text", "ex: Boutique Mama Ngo")}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Type *</label>
            <select value={form.type} onChange={e => set("type", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="shop">Boutique</option>
              <option value="pharmacy">Pharmacie</option>
              <option value="kiosk">Kiosque</option>
              <option value="official_agency">Agence officielle</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {input("Pays *", "country", "text", "Cameroun")}
          {input("Région *", "region", "text", "ex: Centre")}
          {input("Ville *", "city", "text", "ex: Yaoundé")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {input("Adresse *", "address", "text", "ex: Rue de la Paix")}
          {input("Lieu-dit", "lieuDit", "text", "ex: Face à la station Total")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {input("Latitude *", "latitude", "number", "ex: 3.8667")}
          {input("Longitude *", "longitude", "number", "ex: 11.5167")}
        </div>

        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
          {input("Nom du propriétaire *", "ownerName", "text", "ex: Jean Dupont")}
          {input("Téléphone *", "ownerPhone", "tel", "ex: +237699000000")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {input("Capacité (colis) *", "capacity", "number", "ex: 20")}
          {input("Frais de manutention (FCFA) *", "handlingFee", "number", "ex: 500")}
        </div>

        <div className="bg-orange-50 rounded-lg px-4 py-3 text-sm text-orange-700">
          ℹ️ Les horaires d'ouverture seront définis par défaut (Lun-Ven 8h-18h, Sam 9h-13h).
        </div>

        <button type="submit" disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-semibold transition disabled:opacity-50">
          {saving ? "Création en cours..." : "Créer le point relais"}
        </button>
      </form>
    </div>
  );
}
