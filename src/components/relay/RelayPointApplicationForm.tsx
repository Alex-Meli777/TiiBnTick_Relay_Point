"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { CheckCircle, ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import type { RelayPointApplication } from "@/types/relayPoint";
import { RELAY_POINT_TYPE_LABELS, DAY_LABELS } from "@/types/relayPoint";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { OptionCard } from "@/components/ui/OptionCard";
import { CAMEROON_REGIONS, CAMEROON_CITIES } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const MapLeaflet = dynamic(
  () => import("@/components/MapLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full animate-pulse rounded-3xl bg-gray-100" />
    ),
  }
);

type RelayPointApplicationFormProps = {
  submitUrl: string;
  submitLabel?: string;
  successTitle?: string;
  successDescription?: string;
  onSuccess?: () => void;
};

const defaultOpeningHours: RelayPointApplication["openingHours"] = [
  { day: "mon", open: "08:00", close: "18:00" },
  { day: "tue", open: "08:00", close: "18:00" },
  { day: "wed", open: "08:00", close: "18:00" },
  { day: "thu", open: "08:00", close: "18:00" },
  { day: "fri", open: "08:00", close: "18:00" },
  { day: "sat", open: "09:00", close: "13:00" },
  { day: "sun", open: "00:00", close: "00:00" },
];

export default function RelayPointApplicationForm({
  submitUrl,
  submitLabel = "Soumettre ma candidature",
  successTitle = "Candidature envoyée",
  successDescription = "Nous avons bien reçu votre demande. Notre équipe vous contactera rapidement.",
  onSuccess,
}: RelayPointApplicationFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [mapSelection, setMapSelection] = useState({ latitude: 3.87, longitude: 11.52 });
  const [photoFrontUrl, setPhotoFrontUrl] = useState("");
  const [photoBackUrl, setPhotoBackUrl] = useState("");
  const [photoFrontFile, setPhotoFrontFile] = useState<File | null>(null);
  const [photoBackFile, setPhotoBackFile] = useState<File | null>(null);
  const [photoFrontPreview, setPhotoFrontPreview] = useState<string>("");
  const [photoBackPreview, setPhotoBackPreview] = useState<string>("");

  const [form, setForm] = useState<RelayPointApplication>({
    manager: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
    },
    businessName: "",
    type: "shop",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "",
    lieuDit: "",
    latitude: 3.87,
    longitude: 11.52,
    openingHours: defaultOpeningHours,
    capacity: 20,
    handlingFee: 500,
    description: "",
    photos: [],
  });

  const cities = useMemo(
    () => CAMEROON_CITIES[form.region] ?? [],
    [form.region]
  );

  function updateManager<K extends keyof RelayPointApplication["manager"]>(
    key: K,
    value: RelayPointApplication["manager"][K]
  ) {
    setForm((current) => ({
      ...current,
      manager: {
        ...current.manager,
        [key]: value,
      },
    }));
  }

  function updateField<K extends keyof Omit<RelayPointApplication, "manager">>(
    key: K,
    value: RelayPointApplication[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateOpeningHour(day: RelayPointApplication["openingHours"][number]["day"], key: "open" | "close", value: string) {
    setForm((current) => ({
      ...current,
      openingHours: current.openingHours?.map((entry) =>
        entry.day === day ? { ...entry, [key]: value } : entry
      ),
    }));
  }

  const summaryItems = [
    { label: "Manager", value: `${form.manager.firstName} ${form.manager.lastName}` },
    { label: "Téléphone", value: form.manager.phone },
    { label: "Email", value: form.manager.email },
    { label: "Nom du point relais", value: form.businessName },
    { label: "Type", value: RELAY_POINT_TYPE_LABELS[form.type] },
    { label: "Adresse", value: `${form.address}, ${form.lieuDit}`.trim() },
    { label: "Ville", value: `${form.city} - ${form.region}` },
    { label: "Coordonnées", value: `${form.latitude.toFixed(5)}, ${form.longitude.toFixed(5)}` },
    { label: "Capacité", value: `${form.capacity} colis` },
    { label: "Frais", value: `${form.handlingFee} FCFA` },
  ];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        photos: [photoFrontUrl.trim(), photoBackUrl.trim()].filter(Boolean),
      };

      const response = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Impossible d'envoyer la candidature.");
      }

      setSuccess(true);
      toast(successTitle, "success");
      onSuccess?.();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Erreur lors de l'envoi",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  function validateStep1() {
    const m = form.manager;
    if (!m.firstName?.trim() || !m.lastName?.trim() || !m.phone?.trim() || !m.email?.trim() || !m.password?.trim()) {
      toast("Veuillez renseigner toutes les informations du gestionnaire.", "error");
      return false;
    }
    return true;
  }

  function handleNext(e?: React.MouseEvent) {
    e?.preventDefault();
    // Validate step 1 -> step 2
    if (step === 1) {
      if (!validateStep1()) return;
    }
    setStep((s) => Math.min(3, s + 1));
  }

  function openMapModal() {
    setMapSelection({ latitude: form.latitude || 3.87, longitude: form.longitude || 11.52 });
    setLocationModalOpen(true);
  }

  function handleLocationPick() {
    updateField("latitude", Number(mapSelection.latitude));
    updateField("longitude", Number(mapSelection.longitude));
    setLocationModalOpen(false);
  }

  function renderStep() {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="space-y-3 rounded-3xl border border-orange-100 bg-orange-50/80 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Étape 1</p>
            <h2 className="text-xl font-bold text-gray-900">Informations du gestionnaire</h2>
            <p className="text-sm text-gray-600">Renseignez les informations du manager qui sera lié au point relais.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput
              label="Prénom"
              required
              value={form.manager.firstName}
              onChange={(e) => updateManager("firstName", e.target.value)}
            />
            <CustomInput
              label="Nom"
              required
              value={form.manager.lastName}
              onChange={(e) => updateManager("lastName", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput
              label="Téléphone"
              type="tel"
              required
              value={form.manager.phone}
              onChange={(e) => updateManager("phone", e.target.value)}
              placeholder="+2376XXXXXXXX"
            />
            <CustomInput
              label="Email"
              type="email"
              required
              value={form.manager.email}
              onChange={(e) => updateManager("email", e.target.value)}
            />
          </div>

          <CustomInput
            label="Mot de passe"
            type="password"
            required
            value={form.manager.password}
            onChange={(e) => updateManager("password", e.target.value)}
            hint="Ce mot de passe servira au login du gestionnaire après validation."
          />
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <div className="space-y-3 rounded-3xl border border-orange-100 bg-orange-50/80 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Étape 2</p>
            <h2 className="text-xl font-bold text-gray-900">Informations du point relais</h2>
            <p className="text-sm text-gray-600">Complétez l’adresse, la capacité, les horaires et la présentation du projet.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput
              label="Nom du point relais"
              required
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Type de point relais</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.entries(RELAY_POINT_TYPE_LABELS) as [RelayPointApplication["type"], string][]).map(
                  ([value, label]) => (
                    <OptionCard
                      key={value}
                      label={label}
                      selected={form.type === value}
                      onClick={() => updateField("type", value)}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <CustomInput label="Pays" value={form.country} readOnly />
            <CustomSelect
              label="Région"
              value={form.region}
              onChange={(e) => {
                const region = e.target.value;
                updateField("region", region);
                updateField("city", CAMEROON_CITIES[region]?.[0] ?? "");
              }}
              options={CAMEROON_REGIONS.map((region) => ({ value: region, label: region }))}
            />
            <CustomSelect
              label="Ville"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              options={cities.map((city) => ({ value: city, label: city }))}
            />
          </div>

          <CustomInput
            label="Adresse"
            required
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
          <CustomInput
            label="Lieu-dit"
            value={form.lieuDit}
            onChange={(e) => updateField("lieuDit", e.target.value)}
            hint="Repère ou description courte du lieu"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CustomInput
              label="Latitude"
              type="number"
              required
              value={String(form.latitude)}
              onChange={(e) => updateField("latitude", Number(e.target.value))}
            />
            <CustomInput
              label="Longitude"
              type="number"
              required
              value={String(form.longitude)}
              onChange={(e) => updateField("longitude", Number(e.target.value))}
            />
            <button
              type="button"
              onClick={openMapModal}
              className="mt-6 inline-flex items-center justify-center rounded-3xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Choisir sur la carte
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput
              label="Capacité (colis)"
              type="number"
              required
              value={String(form.capacity)}
              onChange={(e) => updateField("capacity", Number(e.target.value))}
            />
            <CustomInput
              label="Frais de manutention (FCFA)"
              type="number"
              required
              value={String(form.handlingFee)}
              onChange={(e) => updateField("handlingFee", Number(e.target.value))}
            />
          </div>

          <div className="space-y-3 rounded-3xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-700">Horaires d'ouverture</p>
            <div className="grid gap-3">
              {form.openingHours?.map((entry) => (
                <div key={entry.day} className="grid grid-cols-3 gap-3 items-center rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="font-medium text-gray-700">{DAY_LABELS[entry.day]}</span>
                  <input
                    type="time"
                    value={entry.open}
                    onChange={(e) => updateOpeningHour(entry.day, "open", e.target.value)}
                    className="rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="time"
                    value={entry.close}
                    onChange={(e) => updateOpeningHour(entry.day, "close", e.target.value)}
                    className="rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description du projet
            </label>
            <textarea
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <label htmlFor="photo-front" className="block">
              <div className={`border-2 border-dashed rounded-lg p-3 md:p-4 cursor-pointer hover:border-orange-500 transition-colors text-center bg-orange-100/50 ${photoFrontPreview ? 'border-green-400' : 'border-orange-400'}`}>
                <div className="flex flex-col items-center gap-2">
                  {photoFrontPreview ? (
                    <img src={photoFrontPreview} alt="Façade" className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover" />
                  ) : (
                    <div className="bg-orange-500 rounded-full p-2 shadow-sm">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4m-6 4h20"/></svg>
                    </div>
                  )}
                  <p className="text-xs font-bold text-orange-600">Photo - Façade</p>
                  <p className="text-[10px] text-gray-500">PNG, JPG, Max 5MB</p>
                </div>
              </div>
              <input id="photo-front" type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setPhotoFrontFile(f);
                if (f) {
                  const reader = new FileReader();
                  reader.onload = () => { setPhotoFrontPreview(String(reader.result)); setPhotoFrontUrl(String(reader.result)); };
                  reader.readAsDataURL(f);
                } else { setPhotoFrontPreview(""); setPhotoFrontUrl(""); }
              }} className="hidden" />
            </label>

            <label htmlFor="photo-back" className="block">
              <div className={`border-2 border-dashed rounded-lg p-3 md:p-4 cursor-pointer hover:border-orange-500 transition-colors text-center bg-orange-100/50 ${photoBackPreview ? 'border-green-400' : 'border-orange-400'}`}>
                <div className="flex flex-col items-center gap-2">
                  {photoBackPreview ? (
                    <img src={photoBackPreview} alt="Intérieur" className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover" />
                  ) : (
                    <div className="bg-orange-500 rounded-full p-2 shadow-sm">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4m-6 4h20"/></svg>
                    </div>
                  )}
                  <p className="text-xs font-bold text-orange-600">Photo - Arrière / Intérieur</p>
                  <p className="text-[10px] text-gray-500">PNG, JPG, Max 5MB</p>
                </div>
              </div>
              <input id="photo-back" type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setPhotoBackFile(f);
                if (f) {
                  const reader = new FileReader();
                  reader.onload = () => { setPhotoBackPreview(String(reader.result)); setPhotoBackUrl(String(reader.result)); };
                  reader.readAsDataURL(f);
                } else { setPhotoBackPreview(""); setPhotoBackUrl(""); }
              }} className="hidden" />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="space-y-3 rounded-3xl border border-orange-100 bg-orange-50/80 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Étape 3</p>
          <h2 className="text-xl font-bold text-gray-900">Résumé et validation</h2>
          <p className="text-sm text-gray-600">Vérifiez toutes les informations avant d’envoyer votre demande.</p>
        </div>

        <div className="grid gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-xs uppercase tracking-[0.25em] text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-gray-700">Résumé final</p>
          <p className="mt-3 text-sm text-gray-600">
            Votre candidature sera enregistrée et transmise à l’équipe TiiBnTick. Le gestionnaire recevra un accès pour se connecter lorsque l’application sera validée.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
        <h2 className="text-2xl font-semibold text-green-900">{successTitle}</h2>
        <p className="mt-3 text-sm text-green-700">{successDescription}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 rounded-3xl bg-orange-50 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">Démarche</p>
          <p className="mt-2 text-lg font-bold text-gray-900">Devenir point relais</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold text-orange-700">Étape {step}/3</span>
        </div>
      </div>

      {renderStep()}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          {step < 3 ? (
            <button
              type="button"
              onClick={(e) => handleNext(e)}
              className="inline-flex items-center gap-2 rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Suivant <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? "Envoi..." : submitLabel}
            </button>
          )}
        </div>
      </div>

      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Choisir l'emplacement</h3>
                <p className="text-sm text-gray-600">Cliquez sur la carte pour placer le point relais puis validez.</p>
              </div>
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="rounded-3xl border border-gray-200 p-3">
                <MapLeaflet
                  center={{ latitude: mapSelection.latitude, longitude: mapSelection.longitude }}
                  markers={[
                    {
                      id: "selected",
                      latitude: mapSelection.latitude,
                      longitude: mapSelection.longitude,
                      label: "Position choisie",
                    },
                  ]}
                  onMapClick={(lat, lng) => setMapSelection({ latitude: lat, longitude: lng })}
                  className="h-72 w-full rounded-3xl"
                />
              </div>
              <div className="space-y-4 rounded-3xl border border-gray-200 bg-slate-50 p-5">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">Coordonnées sélectionnées</p>
                  <p className="text-sm text-gray-600">Latitude : {mapSelection.latitude.toFixed(5)}</p>
                  <p className="text-sm text-gray-600">Longitude : {mapSelection.longitude.toFixed(5)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLocationPick}
                  className="w-full rounded-3xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Utiliser cette position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

