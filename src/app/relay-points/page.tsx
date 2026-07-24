"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { List, Map, Navigation, Plus } from "lucide-react";
import { searchRelayPoints } from "@/services/relayPointService";
import type { RelayPointSearchResult } from "@/types/relayPoint";
import RelayPointMap from "@/components/relay/RelayPointMap";
import RelayPointList from "@/components/relay/RelayPointList";
import RelayPointCard from "@/components/relay/RelayPointCard";
import {
  DEFAULT_MAP_CENTER,
  getDeviceLocation,
} from "@/lib/geocoding";

export default function RelayPointsPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [points, setPoints] = useState<RelayPointSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [center, setCenter] = useState(DEFAULT_MAP_CENTER);
  const [radiusKm, setRadiusKm] = useState(10);
  const [radiusInput, setRadiusInput] = useState(String(10));
  const [radiusError, setRadiusError] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const loadPoints = useCallback(async () => {
    setLoading(true);
    try {
      const results = await searchRelayPoints({
        latitude: center.latitude,
        longitude: center.longitude,
        radiusKm,
        onlyAvailable,
      });
      setPoints(results);
    } catch {
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, [center, radiusKm, onlyAvailable]);

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  useEffect(() => {
    setRadiusInput(String(radiusKm));
  }, [radiusKm]);

  function handleRadiusInput(value: string) {
    setRadiusInput(value);
    const numeric = Number(value);
    if (value.trim() === "") {
      setRadiusError("Entrez un rayon valide.");
      return;
    }
    if (Number.isNaN(numeric) || numeric <= 0) {
      setRadiusError("Le rayon doit être un nombre positif.");
      return;
    }
    setRadiusError(null);
    setRadiusKm(numeric);
  }

  async function handleUseMyLocation() {
    setLocating(true);
    try {
      const loc = await getDeviceLocation();
      setCenter({ latitude: loc.latitude, longitude: loc.longitude });
      setSelectedId(null);
    } catch {
      alert("Impossible d'obtenir votre position");
    } finally {
      setLocating(false);
    }
  }

  const selected = points.find((p) => p.id === selectedId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Points relais</h1>
          <p className="text-sm text-gray-500">
            Trouvez un point relais près de vous
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-700"
          >
            ← Retour
          </Link>
          <Link
            href="/relay-points/postuler"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Devenir point relais
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
        >
          <Navigation className="h-4 w-4" />
          {locating ? "Localisation..." : "Utiliser ma position"}
        </button>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {[5, 10, 25, 50].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleRadiusInput(String(preset))}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  radiusKm === preset
                    ? "bg-orange-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300"
                }`}
              >
                {preset} km
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={radiusInput}
              onChange={(e) => handleRadiusInput(e.target.value)}
              placeholder="Ou entrez une valeur"
              className={`rounded-xl border px-3 py-2 text-sm flex-1 ${
                radiusError ? "border-red-500" : "border-gray-200"
              }`}
              aria-label="Rayon de recherche personnalisé en kilomètres"
              pattern="[0-9]*"
            />
            <span className="text-sm font-medium text-gray-600">km</span>
          </div>
          {radiusError ? (
            <span className="text-xs text-red-500">{radiusError}</span>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="rounded border-gray-300 text-orange-600"
          />
          Uniquement disponibles
        </label>

        <div className="ml-auto flex rounded-xl border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => setView("map")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              view === "map" ? "bg-orange-600 text-white" : "text-gray-600"
            }`}
          >
            <Map className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              view === "list" ? "bg-orange-600 text-white" : "text-gray-600"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      ) : view === "map" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <RelayPointMap
            points={points}
            center={center}
            selectedId={selectedId}
            onCenterChange={(coords) => {
              setCenter(coords);
              setSelectedId(null);
            }}
            radiusKm={radiusKm}
            className="h-[420px] w-full rounded-2xl border border-gray-200"
          />
          <div className="space-y-3">
            <RelayPointList points={points.slice(0, 5)} selectedId={selectedId} />
          </div>
        </div>
      ) : (
        <RelayPointList points={points} />
      )}
    </div>
  );
}
