"use client";

import dynamic from "next/dynamic";
import type { RelayPointSearchResult } from "@/types/relayPoint";
import { RELAY_POINT_TYPE_LABELS } from "@/types/relayPoint";
import { formatFcfa } from "@/lib/utils";
import type { MapMarker } from "@/components/MapLeaflet";

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full animate-pulse rounded-xl bg-gray-200" />
  ),
});

interface RelayPointMapProps {
  points: RelayPointSearchResult[];
  center: { latitude: number; longitude: number };
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onCenterChange?: (coords: { latitude: number; longitude: number }) => void;
  radiusKm?: number;
  className?: string;
  zoom?: number;
}

export default function RelayPointMap({
  points,
  center,
  selectedId,
  onSelect,
  onCenterChange,
  radiusKm,
  className = "h-80 w-full",
  zoom = 13,
}: RelayPointMapProps) {
  const relayMarkers: MapMarker[] = points.map((p) => {
    const isFull = p.currentLoad >= p.capacity;
    return {
      id: p.id,
      latitude: p.latitude,
      longitude: p.longitude,
      // Visual cue: Red for full, Green for available
      color: isFull ? "#ef4444" : "#10b981",
      label: p.name,
      popupContent: (
        <div className="text-sm p-1">
          <p className="font-bold border-b mb-1">{p.name}</p>
          <p className={isFull ? "text-red-500 font-bold" : "text-green-600"}>
            {isFull
              ? "🚫 Complet"
              : `✅ Disponible (${p.capacity - p.currentLoad} places)`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Frais: {p.handlingFee} FCFA
          </p>
        </div>
      ),
    };
  });

  const centerMarker: MapMarker = {
    id: "selected",
    latitude: center.latitude,
    longitude: center.longitude,
    label: "Centre de recherche",
    color: "blue",
    popupContent: (
      <div className="text-sm font-medium">Centre de recherche</div>
    ),
  };

  return (
    <MapLeaflet
      center={center}
      zoom={zoom}
      markers={[centerMarker, ...relayMarkers]}
      radiusKm={radiusKm}
      className={className}
      onMarkerClick={(id) => {
        if (id !== "selected") onSelect?.(id);
      }}
      onMapClick={(latitude, longitude) =>
        onCenterChange?.({ latitude, longitude })
      }
    />
  );
}
