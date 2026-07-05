"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import type { RelayPointApplication } from "@/types/relayPoint";
import { RELAY_POINT_TYPE_LABELS } from "@/types/relayPoint";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { OptionCard } from "@/components/ui/OptionCard";
import { CAMEROON_REGIONS, CAMEROON_CITIES } from "@/lib/utils";
import { applyForRelayPoint } from "@/services/relayPointService";
import { useToast } from "@/components/ui/Toast";

const typeOptions = (
  Object.entries(RELAY_POINT_TYPE_LABELS) as [
    RelayPointApplication["type"],
    string,
  ][]
).map(([value, label]) => ({ value, label }));

export default function ApplyRelayPointForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<RelayPointApplication>({
    applicantName: "",
    applicantPhone: "",
    applicantEmail: "",
    businessName: "",
    type: "shop",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "",
    lieuDit: "",
    description: "",
  });

  const cities = CAMEROON_CITIES[form.region] ?? [];

  function update<K extends keyof RelayPointApplication>(
    key: K,
    value: RelayPointApplication[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await applyForRelayPoint(form);
      setSuccess(true);
      toast("Candidature envoyée avec succès", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erreur lors de l'envoi",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
        <h2 className="text-lg font-semibold text-green-900">
          Candidature enregistrée
        </h2>
        <p className="mt-2 text-sm text-green-700">
          Notre équipe vous contactera sous 5 jours ouvrés.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CustomInput
          label="Nom complet"
          required
          value={form.applicantName}
          onChange={(e) => update("applicantName", e.target.value)}
        />
        <CustomInput
          label="Téléphone"
          required
          type="tel"
          value={form.applicantPhone}
          onChange={(e) => update("applicantPhone", e.target.value)}
          placeholder="+2376XXXXXXXX"
        />
      </div>

      <CustomInput
        label="Email"
        type="email"
        value={form.applicantEmail ?? ""}
        onChange={(e) => update("applicantEmail", e.target.value)}
      />

      <CustomInput
        label="Nom du commerce"
        required
        value={form.businessName}
        onChange={(e) => update("businessName", e.target.value)}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          Type de point relais <span className="text-orange-500">*</span>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {typeOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={form.type === opt.value}
              onClick={() => update("type", opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CustomSelect
          label="Région"
          value={form.region}
          onChange={(e) => {
            const v = e.target.value;
            update("region", v);
            const firstCity = CAMEROON_CITIES[v]?.[0];
            if (firstCity) update("city", firstCity);
          }}
          options={CAMEROON_REGIONS.map((r) => ({ value: r, label: r }))}
        />
        <CustomSelect
          label="Ville"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          options={cities.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <CustomInput
        label="Adresse"
        required
        value={form.address}
        onChange={(e) => update("address", e.target.value)}
      />
      <CustomInput
        label="Lieu-dit"
        value={form.lieuDit}
        onChange={(e) => update("lieuDit", e.target.value)}
        hint="Quartier, repère, carrefour..."
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description du projet
        </label>
        <textarea
          rows={4}
          value={form.description ?? ""}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-600 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Soumettre ma candidature"}
      </button>
    </form>
  );
}
