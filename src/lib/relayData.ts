import { getMutableStore } from "@/mocks/relayPointsSeed";
import { calculateDistanceKm, generateId } from "@/lib/utils";
import type {
  RelayPoint,
  RelayPointSearchQuery,
  RelayPointSearchResult,
  RelayPointApplication,
  StoredRelayPointApplication,
  RelayParcelEntry,
  HandoverEvent,
  RelayNotification,
  DepositRequest,
  PickupRequest,
  DeliveryTrackingSession,
  ProofOfDeliverySubmission,
} from "@/types/relayPoint";

const OTP_MAP: Record<string, string> = {
  "TBT-CM-2026-00001": "482910",
  "TBT-CM-2026-00002": "739201",
  "TBT-CM-2026-00005": "551234",
};

export function searchRelayPoints(
  query: RelayPointSearchQuery
): RelayPointSearchResult[] {
  const store = getMutableStore();
  const radius = query.radiusKm ?? 5;

  let results = store.relayPoints
    .filter((rp) => rp.status === "active")
    .map((rp) => ({
      ...rp,
      distanceKm: calculateDistanceKm(
        query.latitude,
        query.longitude,
        rp.latitude,
        rp.longitude
      ),
    }))
    .filter((rp) => rp.distanceKm <= radius);

  if (query.onlyAvailable) {
    results = results.filter((rp) => rp.currentLoad < rp.capacity);
  }

  return results.sort((a, b) => a.distanceKm - b.distanceKm);
}

export function getRelayPointById(id: string): RelayPoint | undefined {
  return getMutableStore().relayPoints.find((rp) => rp.id === id);
}

export function createRelayPoint(data: Omit<RelayPoint, "id">): RelayPoint {
  const store = getMutableStore();
  const point: RelayPoint = { ...data, id: generateId("rp") };
  store.relayPoints.push(point);
  return point;
}

export function applyForRelayPoint(
  data: RelayPointApplication
): StoredRelayPointApplication {
  const store = getMutableStore();
  const application: StoredRelayPointApplication = {
    ...data,
    id: generateId("app"),
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  store.applications.push(application);
  return application;
}

const DEFAULT_OPENING_HOURS: RelayPoint["openingHours"] = [
  { day: "mon", open: "08:00", close: "18:00" },
  { day: "tue", open: "08:00", close: "18:00" },
  { day: "wed", open: "08:00", close: "18:00" },
  { day: "thu", open: "08:00", close: "18:00" },
  { day: "fri", open: "08:00", close: "18:00" },
  { day: "sat", open: "09:00", close: "13:00" },
  { day: "sun", open: "00:00", close: "00:00" },
];

export function updateRelayPoint(
  id: string,
  data: Partial<Omit<RelayPoint, "id">>
): RelayPoint | null {
  const store = getMutableStore();
  const point = store.relayPoints.find((rp) => rp.id === id);
  if (!point) return null;
  Object.assign(point, data);
  return point;
}

export function deleteRelayPoint(
  id: string
): { deleted: boolean; error?: string } {
  const store = getMutableStore();
  const index = store.relayPoints.findIndex((rp) => rp.id === id);
  if (index === -1) {
    return { deleted: false, error: "Point relais introuvable" };
  }

  const point = store.relayPoints[index];
  if (point.currentLoad > 0) {
    return {
      deleted: false,
      error:
        "Impossible de supprimer : des colis sont encore stockés dans ce point relais",
    };
  }

  store.relayPoints.splice(index, 1);
  return { deleted: true };
}

export function listApplications(
  status?: StoredRelayPointApplication["status"]
): StoredRelayPointApplication[] {
  const store = getMutableStore();
  return status
    ? store.applications.filter((a) => a.status === status)
    : store.applications;
}

export function approveApplication(
  id: string,
  overrides?: Partial<
    Pick<RelayPoint, "latitude" | "longitude" | "capacity" | "handlingFee" | "openingHours">
  >
): RelayPoint | null {
  const store = getMutableStore();
  const application = store.applications.find((a) => a.id === id);
  if (!application || application.status !== "pending") return null;

  const point: RelayPoint = {
    id: generateId("rp"),
    name: application.businessName,
    type: application.type,
    country: application.country,
    region: application.region,
    city: application.city,
    address: application.address,
    lieuDit: application.lieuDit,
    latitude: overrides?.latitude ?? 0,
    longitude: overrides?.longitude ?? 0,
    ownerName: application.applicantName,
    ownerPhone: application.applicantPhone,
    ownerEmail: application.applicantEmail,
    openingHours: overrides?.openingHours ?? DEFAULT_OPENING_HOURS,
    capacity: overrides?.capacity ?? 20,
    currentLoad: 0,
    handlingFee: overrides?.handlingFee ?? 500,
    status: "active",
  };

  store.relayPoints.push(point);
  application.status = "approved";
  return point;
}

export function rejectApplication(id: string): boolean {
  const store = getMutableStore();
  const application = store.applications.find((a) => a.id === id);
  if (!application || application.status !== "pending") return false;
  application.status = "rejected";
  return true;
}

export function getParcelsByRelayPoint(
  relayPointId: string
): RelayParcelEntry[] {
  return getMutableStore().parcels.filter(
    (p) => p.relayPointId === relayPointId
  );
}

export function getParcelByTracking(
  trackingNumber: string
): RelayParcelEntry | undefined {
  return getMutableStore().parcels.find(
    (p) => p.trackingNumber.toUpperCase() === trackingNumber.toUpperCase()
  );
}

export function getHandoverEvents(
  trackingNumber: string
): HandoverEvent[] {
  return getMutableStore()
    .handoverEvents.filter((e) => e.trackingNumber === trackingNumber)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
}

export function getNotificationsForRelay(
  relayPointId: string
): RelayNotification[] {
  const store = getMutableStore();
  const trackingNumbers = store.parcels
    .filter((p) => p.relayPointId === relayPointId)
    .map((p) => p.trackingNumber);
  return store.notifications
    .filter((n) => trackingNumbers.includes(n.trackingNumber))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function depositParcel(data: DepositRequest): RelayParcelEntry | null {
  const store = getMutableStore();
  const parcel = store.parcels.find(
    (p) => p.trackingNumber === data.trackingNumber
  );
  const relayPoint = store.relayPoints.find(
    (rp) => rp.id === data.relayPointId
  );

  if (!parcel || !relayPoint) return null;
  if (parcel.status !== "IN_TRANSIT") return null;
  if (relayPoint.currentLoad >= relayPoint.capacity) return null;

  parcel.status = "AT_HUB";
  parcel.depositedAt = new Date().toISOString();
  parcel.relayPointId = data.relayPointId;
  relayPoint.currentLoad += 1;

  const event: HandoverEvent = {
    id: generateId("hev"),
    trackingNumber: data.trackingNumber,
    relayPointId: data.relayPointId,
    eventType: "DEPOSIT",
    actorRole: "driver",
    actorId: data.driverId,
    timestamp: new Date().toISOString(),
    verificationMethod: data.verificationMethod,
    verificationReference: data.verificationReference,
    txHash: `0x${Math.random().toString(16).slice(2, 14)}`,
  };
  store.handoverEvents.push(event);

  store.notifications.push({
    id: generateId("notif"),
    trackingNumber: data.trackingNumber,
    type: "PARCEL_ARRIVED_AT_HUB",
    message: `Nouveau colis ${data.trackingNumber} déposé.`,
    createdAt: new Date().toISOString(),
    read: false,
  });

  return parcel;
}

export function pickupParcel(data: PickupRequest): RelayParcelEntry | null {
  const store = getMutableStore();
  const parcel = store.parcels.find(
    (p) => p.trackingNumber === data.trackingNumber
  );
  const relayPoint = store.relayPoints.find(
    (rp) => rp.id === data.relayPointId
  );

  if (!parcel || !relayPoint) return null;
  if (parcel.status !== "AT_HUB") return null;

  const expectedOtp = OTP_MAP[data.trackingNumber];
  if (!expectedOtp || expectedOtp !== data.recipientOtp) return null;

  parcel.status = "PICKED_UP_FROM_HUB";
  parcel.pickedUpAt = new Date().toISOString();
  relayPoint.currentLoad = Math.max(0, relayPoint.currentLoad - 1);

  const event: HandoverEvent = {
    id: generateId("hev"),
    trackingNumber: data.trackingNumber,
    relayPointId: data.relayPointId,
    eventType: "PICKUP",
    actorRole: "recipient",
    actorId: "recipient",
    timestamp: new Date().toISOString(),
    verificationMethod: "otp_code",
    verificationReference: data.recipientOtp,
    txHash: `0x${Math.random().toString(16).slice(2, 14)}`,
  };
  store.handoverEvents.push(event);

  return parcel;
}

export function activateTracking(
  trackingNumber: string,
  driverLatitude: number,
  driverLongitude: number
): DeliveryTrackingSession | null {
  const store = getMutableStore();
  const parcel = store.parcels.find(
    (p) => p.trackingNumber === trackingNumber
  );
  if (!parcel) return null;

  const existing = store.trackingSessions.find(
    (s) => s.trackingNumber === trackingNumber && s.active
  );
  if (existing) {
    existing.driverLatitude = driverLatitude;
    existing.driverLongitude = driverLongitude;
    return existing;
  }

  const session: DeliveryTrackingSession = {
    id: generateId("trk"),
    trackingNumber,
    shareToken: generateId("share"),
    driverLatitude,
    driverLongitude,
    active: true,
    createdAt: new Date().toISOString(),
  };
  store.trackingSessions.push(session);
  return session;
}

export function getTrackingByToken(
  shareToken: string
): DeliveryTrackingSession | undefined {
  return getMutableStore().trackingSessions.find(
    (s) => s.shareToken === shareToken && s.active
  );
}

export function updateTrackingPosition(
  shareToken: string,
  latitude: number,
  longitude: number
): DeliveryTrackingSession | null {
  const session = getTrackingByToken(shareToken);
  if (!session) return null;
  session.driverLatitude = latitude;
  session.driverLongitude = longitude;
  return session;
}

export function submitProofOfDelivery(
  data: ProofOfDeliverySubmission
): boolean {
  const store = getMutableStore();
  const parcel = store.parcels.find(
    (p) => p.trackingNumber === data.trackingNumber
  );
  if (!parcel) return false;

  store.trackingSessions
    .filter((s) => s.trackingNumber === data.trackingNumber)
    .forEach((s) => {
      s.active = false;
      s.expiresAt = new Date().toISOString();
    });

  if (parcel.status === "IN_TRANSIT") {
    parcel.status = "AT_HUB";
    parcel.depositedAt = new Date().toISOString();
  }

  const event: HandoverEvent = {
    id: generateId("hev"),
    trackingNumber: data.trackingNumber,
    relayPointId: parcel.relayPointId,
    eventType: "DEPOSIT",
    actorRole: "driver",
    actorId: data.submittedBy,
    timestamp: new Date().toISOString(),
    verificationMethod: data.otpCode
      ? "otp_code"
      : data.signature
        ? "manual_id_check"
        : "qr_scan",
    verificationReference:
      data.otpCode ?? data.signature ?? "photo_proof",
    txHash: `0x${Math.random().toString(16).slice(2, 14)}`,
  };
  store.handoverEvents.push(event);

  return true;
}
