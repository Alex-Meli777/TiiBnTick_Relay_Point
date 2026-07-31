"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { RelayParcelEntry, HandoverEvent } from "@/types/relayPoint";
import { ParcelStatusBadge } from "@/components/relay/RelayStatusBadge";
import { formatDate } from "@/lib/utils";
import { getHandoverHistory } from "@/services/handoverService";
import { getRelayPointParcels } from "@/services/relayPointService";

interface PageProps {
  params: { trackingNumber: string };
}

export default function ParcelDetailPage({ params }: PageProps) {
  const [parcel, setParcel] = useState<RelayParcelEntry | null>(null);
  const [events, setEvents] = useState<HandoverEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/relay-auth/me");
        const meData = await meRes.json();
        if (!meData.success) return;

        const rpId = meData.data.managedRelayPointIds[0];
        const [parcelList, history] = await Promise.all([
          getRelayPointParcels(rpId),
          getHandoverHistory(params.trackingNumber),
        ]);

        setParcel(
          parcelList.find((p) => p.trackingNumber === params.trackingNumber) ??
            null
        );
        setEvents(history);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.trackingNumber]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Colis introuvable.</p>
        <Link href="/rp-manager" className="mt-4 text-orange-600">
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <Link
        href="/rp-manager"
        className="mb-4 inline-flex items-center gap-1 text-sm text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <p className="font-mono text-lg font-bold text-orange-600">
            {parcel.trackingNumber}
          </p>
          <ParcelStatusBadge status={parcel.status} />
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Destinataire</dt>
            <dd>{parcel.maskedRecipientName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Téléphone</dt>
            <dd className="font-mono">{parcel.maskedRecipientPhone}</dd>
          </div>
          {parcel.depositedAt && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Déposé le</dt>
              <dd>{formatDate(parcel.depositedAt)}</dd>
            </div>
          )}
          {parcel.pickedUpAt && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Retiré le</dt>
              <dd>{formatDate(parcel.pickedUpAt)}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold">Historique des opérations</h2>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun événement.</p>
        ) : (
          <ol className="space-y-3">
            {events.map((e) => (
              <li
                key={e.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm"
              >
                <p className="font-medium">
                  {e.eventType === "DEPOSIT" ? "Dépôt" : "Retrait"} —{" "}
                  {e.verificationMethod}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(e.timestamp)} · {e.actorRole}
                </p>
                {e.txHash && (
                  <p className="mt-1 font-mono text-xs text-gray-400">
                    {e.txHash}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
