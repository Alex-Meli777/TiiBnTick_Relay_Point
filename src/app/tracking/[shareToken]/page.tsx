"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getTrackingByToken } from "@/services/handoverService";
import type { DeliveryTrackingSession } from "@/types/relayPoint";

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
  ),
});

interface PageProps {
  params: { shareToken: string };
}

export default function TrackingLivePage({ params }: PageProps) {
  const [session, setSession] = useState<DeliveryTrackingSession | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrackingByToken(params.shareToken);
        setSession(data);
      } catch {
        setError("Lien expiré ou invalide");
      }
    }
    load();

    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [params.shareToken]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        {error}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-xl font-bold">Suivi en direct</h1>
      <p className="mb-4 font-mono text-sm text-orange-600">
        {session.trackingNumber}
      </p>

      <MapLeaflet
        center={{
          latitude: session.driverLatitude,
          longitude: session.driverLongitude,
        }}
        zoom={14}
        markers={[
          {
            id: "driver",
            latitude: session.driverLatitude,
            longitude: session.driverLongitude,
            color: "orange",
            label: "Livreur",
            popupContent: (
              <span className="text-sm">Position du livreur</span>
            ),
          },
        ]}
        className="h-96 w-full rounded-2xl border border-gray-200"
      />

      <p className="mt-4 text-center text-xs text-gray-400">
        Actualisation automatique toutes les 10 secondes
      </p>
    </div>
  );
}
