import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { RelayPointSearchResult } from "@/types/relayPoint";
import {
  RELAY_POINT_TYPE_LABELS,
  DAY_LABELS,
} from "@/types/relayPoint";
import { formatFcfa } from "@/lib/utils";
import { CapacityBadge, RelayStatusBadge } from "./RelayStatusBadge";

interface RelayPointCardProps {
  point: RelayPointSearchResult;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function RelayPointCard({
  point,
  selected,
  onSelect,
}: RelayPointCardProps) {
  const today = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
    new Date().getDay()
  ] as (typeof point.openingHours)[number]["day"];
  const todayHours = point.openingHours.find((h) => h.day === today);

  const content = (
    <>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{point.name}</h3>
          <p className="text-xs text-gray-500">
            {RELAY_POINT_TYPE_LABELS[point.type]} · {point.distanceKm} km
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <CapacityBadge
            currentLoad={point.currentLoad}
            capacity={point.capacity}
          />
          <RelayStatusBadge status={point.status} />
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
          <span>
            {point.address}, {point.lieuDit} — {point.city}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-orange-500" />
          <span>
            {todayHours
              ? `${DAY_LABELS[todayHours.day]} : ${todayHours.open} – ${todayHours.close}`
              : "Horaires non disponibles"}
          </span>
        </div>
        <p className="font-medium text-orange-600">
          Frais : {formatFcfa(point.handlingFee)}
        </p>
        <p className="text-xs text-gray-400">
          {point.currentLoad}/{point.capacity} colis
        </p>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(point.id)}
        className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md ${
          selected ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-200"
        }`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/relay-points/${point.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-300 hover:shadow-md"
    >
      {content}
    </Link>
  );
}
