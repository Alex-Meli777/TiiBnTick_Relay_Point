"use client";

import Link from "next/link";
import type { RelayParcelEntry } from "@/types/relayPoint";
import { ParcelStatusBadge } from "./RelayStatusBadge";
import { formatDate } from "@/lib/utils";

interface ParcelInventoryTableProps {
  parcels: RelayParcelEntry[];
  onDeposit?: (parcel: RelayParcelEntry) => void;
  onPickup?: (parcel: RelayParcelEntry) => void;
}

export default function ParcelInventoryTable({
  parcels,
  onDeposit,
  onPickup,
}: ParcelInventoryTableProps) {
  const atHub = parcels.filter((p) => p.status === "AT_HUB");

  if (parcels.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 py-10 text-center text-gray-500">
        Aucun colis enregistré.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-700">N° suivi</th>
            <th className="px-4 py-3 font-medium text-gray-700">Destinataire</th>
            <th className="px-4 py-3 font-medium text-gray-700">Téléphone</th>
            <th className="px-4 py-3 font-medium text-gray-700">Statut</th>
            <th className="px-4 py-3 font-medium text-gray-700">Déposé le</th>
            <th className="px-4 py-3 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {parcels.map((parcel) => (
            <tr key={parcel.trackingNumber} className="hover:bg-gray-50/80">
              <td className="px-4 py-3">
                <Link
                  href={`/relay-dashboard/parcels/${parcel.trackingNumber}`}
                  className="font-mono text-orange-600 hover:underline"
                >
                  {parcel.trackingNumber}
                </Link>
              </td>
              <td className="px-4 py-3">{parcel.maskedRecipientName}</td>
              <td className="px-4 py-3 font-mono text-gray-500">
                {parcel.maskedRecipientPhone}
              </td>
              <td className="px-4 py-3">
                <ParcelStatusBadge status={parcel.status} />
              </td>
              <td className="px-4 py-3 text-gray-500">
                {parcel.depositedAt ? formatDate(parcel.depositedAt) : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {parcel.status === "IN_TRANSIT" && onDeposit && (
                    <button
                      type="button"
                      onClick={() => onDeposit(parcel)}
                      className="rounded-lg bg-orange-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-orange-700"
                    >
                      Dépôt
                    </button>
                  )}
                  {parcel.status === "AT_HUB" && onPickup && (
                    <button
                      type="button"
                      onClick={() => onPickup(parcel)}
                      className="rounded-lg bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Retrait
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
        {atHub.length} colis en stock (AT_HUB)
      </p>
    </div>
  );
}
