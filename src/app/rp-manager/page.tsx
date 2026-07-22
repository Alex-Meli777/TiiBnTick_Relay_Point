"use client";

import { useCallback, useEffect, useState } from "react";
import { Package, ScanLine, Bell } from "lucide-react";
import type {
  RelayPoint,
  RelayParcelEntry,
  RelayNotification,
} from "@/types/relayPoint";
import { formatFcfa } from "@/lib/utils";
import { CapacityBadge } from "@/components/relay/RelayStatusBadge";
import ParcelInventoryTable from "@/components/relay/ParcelInventoryTable";
import HandoverModal, {
  type HandoverMode,
} from "@/components/relay/HandoverModal";
import {
  getRelayPointParcels,
  getRelayNotifications,
} from "@/services/relayPointService";

interface OwnerMe {
  fullName: string;
  managedRelayPointIds: string[];
  relayPoint?: RelayPoint;
}

export default function RelayDashboardPage() {
  const [owner, setOwner] = useState<OwnerMe | null>(null);
  const [parcels, setParcels] = useState<RelayParcelEntry[]>([]);
  const [notifications, setNotifications] = useState<RelayNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalParcel, setModalParcel] = useState<RelayParcelEntry | null>(null);
  const [modalMode, setModalMode] = useState<HandoverMode | null>(null);

  const relayPointId = owner?.managedRelayPointIds[0];
  const relayPoint = owner?.relayPoint;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/relay-auth/me");
      const meData = await meRes.json();
      if (!meData.success) return;

      setOwner(meData.data);
      const rpId = meData.data.managedRelayPointIds[0];
      if (!rpId) return;

      const [parcelList, notifs] = await Promise.all([
        getRelayPointParcels(rpId),
        getRelayNotifications(rpId),
      ]);
      setParcels(parcelList);
      setNotifications(notifs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const atHub = parcels.filter((p) => p.status === "AT_HUB");
  const estimatedRevenue = atHub.length * (relayPoint?.handlingFee ?? 0);

  function openModal(mode: HandoverMode, parcel?: RelayParcelEntry) {
    if (parcel) {
      setModalParcel(parcel);
      setModalMode(mode);
      return;
    }
    if (mode === "pickup" && atHub.length > 0) {
      setModalParcel(atHub[0]);
      setModalMode(mode);
      return;
    }
    if (mode === "deposit") {
      const inTransit = parcels.filter((p) => p.status === "IN_TRANSIT");
      setModalParcel(inTransit[0] ?? null);
      setModalMode(mode);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!owner || !relayPoint) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucun point relais associé à ce compte.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Bonjour, {owner.fullName}
        </h1>
        <p className="text-sm text-gray-500">{relayPoint.name}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Capacité utilisée</p>
          <p className="text-2xl font-bold">
            {relayPoint.currentLoad}/{relayPoint.capacity}
          </p>
          <CapacityBadge
            currentLoad={relayPoint.currentLoad}
            capacity={relayPoint.capacity}
          />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Colis en stock</p>
          <p className="text-2xl font-bold">{atHub.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Revenus estimés</p>
          <p className="text-lg font-bold text-orange-600">
            {formatFcfa(estimatedRevenue)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => openModal("deposit")}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          <ScanLine className="h-4 w-4" />
          Scanner dépôt
        </button>
        <button
          type="button"
          onClick={() => openModal("pickup")}
          disabled={atHub.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          <Package className="h-4 w-4" />
          Scanner retrait
        </button>
      </div>

      <section id="stock">
        <h2 className="mb-3 font-semibold">Inventaire colis</h2>
        <ParcelInventoryTable
          parcels={parcels}
          onDeposit={(p) => openModal("deposit", p)}
          onPickup={(p) => openModal("pickup", p)}
        />
      </section>

      <section id="history">
        <h2 className="mb-3 flex items-center gap-2 font-semibold">
          <Bell className="h-4 w-4" />
          Notifications
        </h2>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune notification.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border p-3 text-sm ${
                  n.read
                    ? "border-gray-100 bg-white text-gray-500"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                <p className="font-medium">{n.message}</p>
                <p className="text-xs text-gray-400">{n.trackingNumber}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {relayPointId && (
        <HandoverModal
          parcel={modalParcel}
          mode={modalMode}
          relayPointId={relayPointId}
          onClose={() => {
            setModalParcel(null);
            setModalMode(null);
          }}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
