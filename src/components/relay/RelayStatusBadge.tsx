import type { RelayPoint, ParcelHubStatus } from "@/types/relayPoint";
import { cn } from "@/lib/utils";

const relayStatusConfig: Record<
  RelayPoint["status"],
  { label: string; className: string }
> = {
  active: { label: "Actif", className: "bg-green-100 text-green-800" },
  suspended: { label: "Suspendu", className: "bg-red-100 text-red-800" },
  pending_validation: {
    label: "En validation",
    className: "bg-yellow-100 text-yellow-800",
  },
};

const parcelStatusConfig: Record<
  ParcelHubStatus,
  { label: string; className: string }
> = {
  IN_TRANSIT: {
    label: "En transit",
    className: "bg-blue-100 text-blue-800",
  },
  AT_HUB: {
    label: "Au point relais",
    className: "bg-orange-100 text-orange-800",
  },
  PICKED_UP_FROM_HUB: {
    label: "Retiré",
    className: "bg-green-100 text-green-800",
  },
  RETURNED_TO_SENDER: {
    label: "Retourné",
    className: "bg-gray-100 text-gray-700",
  },
};

export function RelayStatusBadge({ status }: { status: RelayPoint["status"] }) {
  const config = relayStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function ParcelStatusBadge({ status }: { status: ParcelHubStatus }) {
  const config = parcelStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function CapacityBadge({
  currentLoad,
  capacity,
}: {
  currentLoad: number;
  capacity: number;
}) {
  const full = currentLoad >= capacity;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        full ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
      )}
    >
      {full ? "Complet" : "Disponible"}
    </span>
  );
}
