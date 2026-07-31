"use client";

import dynamic from "next/dynamic";
import type { RelayPoint } from "@/types/relayPoint";

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="h-56 animate-pulse rounded-2xl bg-gray-200" />
  ),
});

export default function RelayPointDetailMap({ point }: { point: RelayPoint }) {
  return (
    <MapLeaflet
      center={{ latitude: point.latitude, longitude: point.longitude }}
      zoom={15}
      markers={[
        {
          id: point.id,
          latitude: point.latitude,
          longitude: point.longitude,
          color: point.currentLoad >= point.capacity ? "red" : "green",
          label: point.name,
        },
      ]}
      className="h-56 w-full rounded-2xl border border-gray-200"
    />
  );
}
