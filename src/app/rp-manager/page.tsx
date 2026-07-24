"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Package, ScanLine, Bell, MapPin } from "lucide-react";
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
  phone: string;
  managedRelayPointIds: string[];
  relayPoints: RelayPoint[];
}

export default function RelayDashboardPage() {
  const [owner, setOwner] = useState<OwnerMe | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [parcels, setParcels] = useState<RelayParcelEntry[]>([]);
  const [notifications, setNotifications] = useState<RelayNotification[]>([]);
  const [loadingOwner, setLoadingOwner] = useState(true);
  const [loadingPointData, setLoadingPointData] = useState(false);
  const [modalParcel, setModalParcel] = useState<RelayParcelEntry | null>(null);
  const [modalMode, setModalMode] = useState<HandoverMode | null>(null);

  const selectedPoint = owner?.relayPoints.find((rp) => rp.id === selectedPointId) ?? null;
  const relayPointId = selectedPoint?.id ?? null;

  const totalLoad = useMemo(
    () => owner?.relayPoints.reduce((sum, rp) => sum + rp.currentLoad, 0) ?? 0,
    [owner]
  );
  const totalCapacity = useMemo(
    () => owner?.relayPoints.reduce((sum, rp) => sum + rp.capacity, 0) ?? 0,
    [owner]
  );

  const loadOwner = useCallback(async () => {
    setLoadingOwner(true);
    try {
      const meRes = await fetch("/api/relay-auth/me");
      const meData = await meRes.json();
      if (!meData.success) return;

      setOwner(meData.data);
      setSelectedPointId(null);
    } finally {
      setLoadingOwner(false);
    }
  }, []);

  const loadPointData = useCallback(async () => {
    if (!selectedPoint?.id) {
      setParcels([]);
      setNotifications([]);
      return;
    }

    setLoadingPointData(true);
    try {
      const [parcelList, notifs] = await Promise.all([
        getRelayPointParcels(selectedPoint.id),
        getRelayNotifications(selectedPoint.id),
      ]);
      setParcels(parcelList);
      setNotifications(notifs);
    } finally {
      setLoadingPointData(false);
    }
  }, [selectedPoint]);

  useEffect(() => {
    loadOwner();
  }, [loadOwner]);

  useEffect(() => {
    loadPointData();
  }, [loadPointData]);

  const atHub = parcels.filter((p) => p.status === "AT_HUB");
  const estimatedRevenue = atHub.length * (selectedPoint?.handlingFee ?? 0);

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

  if (loadingOwner) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="p-6 text-center text-gray-500">
        Impossible de charger votre compte.
      </div>
    );
  }

  if (selectedPoint) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedPointId(null)}
            className="inline-flex items-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
          </button>
        </div>

        <div>
          <p className="text-sm text-gray-500">Point relais</p>
          <h1 className="text-3xl font-bold text-gray-900">{selectedPoint.name}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {selectedPoint.address}, {selectedPoint.city} — {selectedPoint.region}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">Capacité utilisée</p>
            <p className="text-2xl font-bold">
              {selectedPoint.currentLoad}/{selectedPoint.capacity}
            </p>
            <CapacityBadge
              currentLoad={selectedPoint.currentLoad}
              capacity={selectedPoint.capacity}
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
          {loadingPointData ? (
            <div className="space-y-3">
              <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          ) : (
            <ParcelInventoryTable
              parcels={parcels}
              onDeposit={(p) => openModal("deposit", p)}
              onPickup={(p) => openModal("pickup", p)}
            />
          )}
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
            onSuccess={loadPointData}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Espace propriétaire</p>
            <h1 className="text-3xl font-bold text-gray-900">{owner.fullName}</h1>
            <p className="mt-2 text-sm text-gray-600">Téléphone : {owner.phone}</p>
            <p className="mt-1 text-sm text-gray-500">{owner.relayPoints.length} point(s) relais associés</p>
          </div>
          <Link
            href="/relay-points/postuler?skipManager=1&returnTo=/rp-manager"
            className="inline-flex items-center gap-2 rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <MapPin className="h-4 w-4" />
            Demander un nouveau point relais
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Points relais</p>
          <p className="text-2xl font-bold">{owner.relayPoints.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Capacité totale</p>
          <p className="text-2xl font-bold">{totalLoad}/{totalCapacity}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Points relais actifs</p>
          <p className="text-2xl font-bold">{owner.relayPoints.filter((rp) => rp.status === "active").length}</p>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Vos points relais</h2>
            <p className="text-sm text-gray-500">Cliquez sur un point relais pour consulter son tableau de bord.</p>
          </div>
        </div>

        {owner.relayPoints.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-orange-50 p-6 text-sm text-gray-600">
            Aucun point relais n'est encore lié à ce compte.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {owner.relayPoints.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelectedPointId(point.id)}
                className="w-full text-left rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{point.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{point.address}, {point.city}</p>
                  </div>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{point.status === "active" ? "Actif" : point.status === "suspended" ? "Suspendu" : "En attente"}</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Capacité</span>
                    <span>{point.currentLoad}/{point.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais</span>
                    <span>{formatFcfa(point.handlingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span>{point.type}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
