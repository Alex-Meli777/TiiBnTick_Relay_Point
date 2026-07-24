"use client";

import { useEffect, useState } from "react";
import { Shield, Lock } from "lucide-react";
import type { RelayPoint, StoredRelayPointApplication, RelayPointManager } from "@/types/relayPoint";
import type { RelayPointDetail } from "@/services/relayPointService";
import { RELAY_POINT_TYPE_LABELS } from "@/types/relayPoint";
import { getRelayPointDetail, getRelayManagers } from "@/services/relayPointService";
import RelayPointApplicationForm from "@/components/relay/RelayPointApplicationForm";

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
      <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white shadow-sm">
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
  const [expandedPointId, setExpandedPointId] = useState<string | null>(null);
  const [expandedPointDetails, setExpandedPointDetails] = useState<Record<string, RelayPointDetail>>({});
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
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

  async function toggleDetail(id: string) {
    if (expandedPointId === id) {
      setExpandedPointId(null);
      return;
    }

    setExpandedPointId(id);
    if (expandedPointDetails[id]) return;

    setDetailLoadingId(id);
    try {
      const data = await getRelayPointDetail(id);
      setExpandedPointDetails((prev) => ({ ...prev, [id]: data }));
    } catch (error) {
      showToast("Impossible de charger les détails du point relais", "error");
    } finally {
      setDetailLoadingId(null);
    }
  }

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
        {points.map((p) => {
          const detail = expandedPointDetails[p.id];
          const isExpanded = expandedPointId === p.id;
          const isLoadingDetails = detailLoadingId === p.id;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-xl border border-gray-200 p-5 transition hover:shadow-lg ${isExpanded ? "shadow-xl" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  onClick={() => toggleDetail(p.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 truncate">{p.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : p.status === "suspended" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.status === "active" ? "Actif" : p.status === "suspended" ? "Suspendu" : "En attente"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{p.address}, {p.city} · {RELAY_POINT_TYPE_LABELS[p.type]}</p>
                  <p className="text-xs text-gray-400 mt-1">Capacité : {p.currentLoad}/{p.capacity} · Frais : {p.handlingFee} FCFA · ID : {p.id}</p>
                </button>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                    className="text-sm bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg transition"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }}
                    className="text-sm bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1.5 rounded-lg transition font-bold"
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-5 border-t border-gray-100 pt-5 text-sm text-gray-700">
                  {isLoadingDetails ? (
                    <div className="text-gray-500">Chargement des détails...</div>
                  ) : detail ? (
                    <>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations du gestionnaire</h4>
                          {detail.manager ? (
                            <div className="space-y-3 text-sm text-gray-700">
                              <p><span className="font-medium">Nom :</span> {detail.manager.fullName}</p>
                              <p><span className="font-medium">Téléphone :</span> {detail.manager.phone}</p>
                              <p><span className="font-medium">Email :</span> {detail.manager.email}</p>
                              <p className="text-xs text-gray-500">Mot de passe masqué pour sécurité.</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">Aucun gestionnaire associé à ce point relais.</p>
                          )}
                        </div>

                        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations générales</h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium">Type :</span> {RELAY_POINT_TYPE_LABELS[detail.type]}</p>
                            <p><span className="font-medium">Statut :</span> {detail.status === "active" ? "Actif" : detail.status === "suspended" ? "Suspendu" : "En attente"}</p>
                            <p><span className="font-medium">Capacité :</span> {detail.currentLoad}/{detail.capacity}</p>
                            <p><span className="font-medium">Frais de manutention :</span> {detail.handlingFee} FCFA</p>
                            <p><span className="font-medium">Adresse :</span> {detail.address}, {detail.city}, {detail.region}, {detail.country}</p>
                            <p><span className="font-medium">Lieu-dit :</span> {detail.lieuDit || "—"}</p>
                            <p><span className="font-medium">Coordonnées :</span> {detail.latitude}, {detail.longitude}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-3xl border border-gray-200 bg-gray-50 p-5">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations d’exploitation</h4>
                        <div className="grid gap-4 lg:grid-cols-2 text-sm text-gray-700">
                          <div>
                            <p className="font-medium text-gray-900">Responsable du point relais</p>
                            <p className="mt-2"><span className="font-medium">Nom du propriétaire :</span> {detail.ownerName}</p>
                            <p><span className="font-medium">Téléphone :</span> {detail.ownerPhone}</p>
                            {detail.ownerEmail && <p><span className="font-medium">Email :</span> {detail.ownerEmail}</p>}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Horaires d’ouverture</p>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                              {detail.openingHours.map((slot: RelayPoint["openingHours"][number]) => (
                                <li key={slot.day} className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="capitalize">{slot.day}</span>
                                  <span>{slot.open} — {slot.close}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {detail.photos?.length ? (
                        <div className="mt-5 rounded-3xl border border-gray-200 bg-gray-50 p-5">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Photos</h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {detail.photos.map((photo: string, index: number) => (
                              <img key={index} src={photo} alt={`Photo ${index + 1}`} className="h-40 w-full rounded-2xl object-cover" />
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-gray-500">Aucun détail disponible pour ce point relais.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);

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
        <div className="flex gap-2 flex-wrap">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition ${filter === f ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
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
        {applications.map((a) => {
          const isExpanded = expandedApplicationId === a.id;
          return (
            <div key={a.id} className="rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
              <button
                type="button"
                onClick={() => setExpandedApplicationId(isExpanded ? null : a.id)}
                className="w-full text-left p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900 truncate">{a.businessName}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${a.status === "pending" ? "bg-yellow-100 text-yellow-700" : a.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {a.status === "pending" ? "En attente" : a.status === "approved" ? "Approuvée" : "Refusée"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{RELAY_POINT_TYPE_LABELS[a.type]} · {a.address}, {a.city}</p>
                    <p className="mt-2 text-sm text-gray-500">Demande par {a.manager.firstName} {a.manager.lastName} · {a.manager.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400">Soumis le {new Date(a.submittedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                      {isExpanded ? "Réduire" : "Voir détails"}
                    </span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-5 text-sm text-gray-700">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Détails du gestionnaire</h3>
                      <p><span className="font-medium">Nom :</span> {a.manager.firstName} {a.manager.lastName}</p>
                      <p><span className="font-medium">Téléphone :</span> {a.manager.phone}</p>
                      <p><span className="font-medium">Email :</span> {a.manager.email}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Adresse du point</h3>
                      <p><span className="font-medium">Type :</span> {RELAY_POINT_TYPE_LABELS[a.type]}</p>
                      <p><span className="font-medium">Adresse :</span> {a.address}</p>
                      <p><span className="font-medium">Complément :</span> {a.lieuDit || "—"}</p>
                      <p><span className="font-medium">Localité :</span> {a.city}, {a.region}, {a.country}</p>
                      <p><span className="font-medium">Coordonnées :</span> {a.latitude}, {a.longitude}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Conditions d’exploitation</h3>
                      <p><span className="font-medium">Capacité :</span> {a.capacity} colis</p>
                      <p><span className="font-medium">Frais :</span> {a.handlingFee} FCFA</p>
                      {a.description ? <p className="mt-3"><span className="font-medium">Description :</span> {a.description}</p> : null}
                    </div>
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Horaires</h3>
                      {a.openingHours?.length ? (
                        <ul className="space-y-2">
                          {a.openingHours.map((slot) => (
                            <li key={slot.day} className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="capitalize">{slot.day}</span>
                              <span>{slot.open} — {slot.close}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Aucun horaire fourni.</p>
                      )}
                    </div>
                  </div>

                  {a.photos?.length ? (
                    <div className="mt-5 rounded-3xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Photos</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {a.photos.map((photo, index) => (
                          <img key={index} src={photo} alt={`Photo ${index + 1}`} className="h-40 w-full rounded-2xl object-cover" />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    {a.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReject(a.id)}
                          className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                        >
                          ❌ Refuser
                        </button>
                        <button
                          onClick={() => handleApprove(a.id)}
                          className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                        >
                          ✅ Approuver
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Onglet : Créer un point relais ──────────────────────────────────────────

function CreerTab({ showToast, onCreated }: { showToast: (m: string, t: "success" | "error") => void; onCreated: () => void }) {
  const [managers, setManagers] = useState<Array<Pick<RelayPointManager, "id" | "firstName" | "lastName" | "phone" | "email">>>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  useEffect(() => {
    let mounted = true;
    getRelayManagers()
      .then((list) => {
        if (!mounted) return;
        setManagers(list.map((manager) => ({
          id: manager.id,
          firstName: manager.firstName,
          lastName: manager.lastName,
          phone: manager.phone,
          email: manager.email,
        })));
      })
      .finally(() => {
        if (mounted) setLoadingManagers(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Créer un nouveau point relais</h2>
      <p className="mb-6 text-sm text-gray-500">
        Créez un point relais pour un gestionnaire existant ou ajoutez un nouveau manager directement depuis l’espace admin.
      </p>
      {loadingManagers ? (
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          Chargement des gestionnaires...
        </div>
      ) : null}
      <RelayPointApplicationForm
        submitUrl="/api/relay-points"
        submitLabel="Créer le point relais"
        successTitle="Point relais créé"
        successDescription="Le point relais a été créé et lié au gestionnaire."
        existingManagers={managers}
        onSuccess={() => {
          showToast("Point relais créé avec succès !", "success");
          onCreated();
        }}
      />
    </div>
  );
}
