import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Clock, Wallet } from "lucide-react";
import { getRelayPointById } from "@/lib/relayData";
import {
  RELAY_POINT_TYPE_LABELS,
  DAY_LABELS,
} from "@/types/relayPoint";
import { formatFcfa } from "@/lib/utils";
import { RelayStatusBadge, CapacityBadge } from "@/components/relay/RelayStatusBadge";
import RelayPointDetailMap from "@/components/relay/RelayPointDetailMap";

interface PageProps {
  params: { id: string };
  searchParams: { from?: string };
}

export default function RelayPointDetailPage({
  params,
  searchParams,
}: PageProps) {
  const point = getRelayPointById(params.id);
  if (!point) notFound();

  const fromOrder = searchParams.from === "order";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Link
        href="/relay-points"
        className="mb-4 inline-flex items-center gap-1 text-sm text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {RELAY_POINT_TYPE_LABELS[point.type]}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{point.name}</h1>
          <p className="text-gray-500">
            {point.address}, {point.lieuDit} — {point.city}, {point.region}
          </p>
        </div>
        <div className="flex gap-2">
          <RelayStatusBadge status={point.status} />
          <CapacityBadge
            currentLoad={point.currentLoad}
            capacity={point.capacity}
          />
        </div>
      </div>

      <RelayPointDetailMap point={point} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">Informations</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>
                {point.address}, {point.lieuDit}
              </span>
            </div>
            {/* The property ownerPhone was removed from RelayPoint. We should hide it or use a placeholder until the "Manager" data is fetched. 
            FIX: Access via manager info if available, or just hide for now */}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500" />
              <span>Contact indisponible (voir manager)</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-orange-500" />
              <span>
                Frais de manutention : {formatFcfa(point.handlingFee)}
              </span>
            </div>
            <div className="text-gray-500">
              Capacité : {point.currentLoad}/{point.capacity} colis
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Clock className="h-4 w-4 text-orange-500" />
            Horaires
          </h2>
          <ul className="space-y-1 text-sm">
            {point.openingHours.map((h) => (
              <li key={h.day} className="flex justify-between">
                <span>{DAY_LABELS[h.day]}</span>
                <span className="text-gray-500">
                  {h.open === "00:00" && h.close === "00:00"
                    ? "Fermé"
                    : `${h.open} – ${h.close}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {fromOrder && point.currentLoad < point.capacity && (
        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-orange-600 py-3.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Choisir ce point relais
        </button>
      )}
    </div>
  );
}
