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
  className?: string;
  zoom?: number;
}

export default function RelayPointMap({
  points,
  center,
  selectedId,
  onSelect,
  className = "h-80 w-full",
  zoom = 13,
}: RelayPointMapProps) {
  const markers: MapMarker[] = points.map((p) => {
    const full = p.currentLoad >= p.capacity;
    return {
      id: p.id,
      latitude: p.latitude,
      longitude: p.longitude,
      color: full ? "red" : "green",
      label: p.name,
      popupContent: (
        <div className="text-sm">
          <p className="font-semibold">{p.name}</p>
          <p className="text-gray-500">{RELAY_POINT_TYPE_LABELS[p.type]}</p>
          <p className="text-gray-500">{p.distanceKm} km</p>
          <p className="text-orange-600">{formatFcfa(p.handlingFee)}</p>
        </div>
      ),
    };
  });

  return (
    <MapLeaflet
      center={center}
      zoom={zoom}
      markers={markers}
      className={className}
      onMarkerClick={onSelect}
    />
  );
}
