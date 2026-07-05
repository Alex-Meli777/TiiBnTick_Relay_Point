import type {
  RelayPoint,
  RelayParcelEntry,
  HandoverEvent,
  RelayNotification,
  DeliveryTrackingSession,
  RelayPointApplication,
} from "@/types/relayPoint";

const defaultHours = (
  days: Array<{ day: RelayPoint["openingHours"][number]["day"]; open: string; close: string }>
) => days;

export const initialRelayPoints: RelayPoint[] = [
  {
    id: "rp-dla-001",
    name: "Boutique Mama Ngo",
    type: "shop",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "Rue Joss, Akwa",
    lieuDit: "Face station Total",
    latitude: 4.0511,
    longitude: 9.7085,
    ownerName: "Mama Ngo",
    ownerPhone: "+237699999999",
    ownerEmail: "mama.ngo@relay.cm",
    openingHours: defaultHours([
      { day: "mon", open: "07:30", close: "20:00" },
      { day: "tue", open: "07:30", close: "20:00" },
      { day: "wed", open: "07:30", close: "20:00" },
      { day: "thu", open: "07:30", close: "20:00" },
      { day: "fri", open: "07:30", close: "21:00" },
      { day: "sat", open: "08:00", close: "18:00" },
      { day: "sun", open: "09:00", close: "14:00" },
    ]),
    capacity: 40,
    currentLoad: 12,
    handlingFee: 500,
    status: "active",
    photos: ["/relay/shop-1.jpg"],
  },
  {
    id: "rp-dla-002",
    name: "Pharmacie du Bon Samaritain",
    type: "pharmacy",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "Boulevard de la Liberté, Bonanjo",
    lieuDit: "Près du consulat",
    latitude: 4.0469,
    longitude: 9.7044,
    ownerName: "Dr. Essomba",
    ownerPhone: "+237677123456",
    openingHours: defaultHours([
      { day: "mon", open: "08:00", close: "21:00" },
      { day: "tue", open: "08:00", close: "21:00" },
      { day: "wed", open: "08:00", close: "21:00" },
      { day: "thu", open: "08:00", close: "21:00" },
      { day: "fri", open: "08:00", close: "21:00" },
      { day: "sat", open: "08:00", close: "20:00" },
      { day: "sun", open: "10:00", close: "14:00" },
    ]),
    capacity: 30,
    currentLoad: 30,
    handlingFee: 750,
    status: "active",
  },
  {
    id: "rp-dla-003",
    name: "Kiosque Express Deido",
    type: "kiosk",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "Carrefour Deido",
    lieuDit: "Sous le pont",
    latitude: 4.0742,
    longitude: 9.7138,
    ownerName: "Jean-Paul Mbarga",
    ownerPhone: "+237655887766",
    openingHours: defaultHours([
      { day: "mon", open: "06:00", close: "22:00" },
      { day: "tue", open: "06:00", close: "22:00" },
      { day: "wed", open: "06:00", close: "22:00" },
      { day: "thu", open: "06:00", close: "22:00" },
      { day: "fri", open: "06:00", close: "22:00" },
      { day: "sat", open: "07:00", close: "21:00" },
      { day: "sun", open: "08:00", close: "20:00" },
    ]),
    capacity: 20,
    currentLoad: 5,
    handlingFee: 400,
    status: "active",
  },
  {
    id: "rp-yde-001",
    name: "Agence TiiBnTick Bastos",
    type: "official_agency",
    country: "Cameroun",
    region: "Centre",
    city: "Yaoundé",
    address: "Quartier Bastos",
    lieuDit: "Rue 1.750",
    latitude: 3.8667,
    longitude: 11.5167,
    ownerName: "Service TiiBnTick",
    ownerPhone: "+237222334455",
    ownerEmail: "bastos@tiibntick.cm",
    openingHours: defaultHours([
      { day: "mon", open: "08:00", close: "18:00" },
      { day: "tue", open: "08:00", close: "18:00" },
      { day: "wed", open: "08:00", close: "18:00" },
      { day: "thu", open: "08:00", close: "18:00" },
      { day: "fri", open: "08:00", close: "18:00" },
      { day: "sat", open: "09:00", close: "13:00" },
      { day: "sun", open: "00:00", close: "00:00" },
    ]),
    capacity: 100,
    currentLoad: 45,
    handlingFee: 0,
    status: "active",
  },
  {
    id: "rp-yde-002",
    name: "Boutique Chez Tantine",
    type: "shop",
    country: "Cameroun",
    region: "Centre",
    city: "Yaoundé",
    address: "Marché Mfoundi",
    lieuDit: "Allée B",
    latitude: 3.848,
    longitude: 11.5021,
    ownerName: "Tantine Aminata",
    ownerPhone: "+237698112233",
    openingHours: defaultHours([
      { day: "mon", open: "07:00", close: "19:00" },
      { day: "tue", open: "07:00", close: "19:00" },
      { day: "wed", open: "07:00", close: "19:00" },
      { day: "thu", open: "07:00", close: "19:00" },
      { day: "fri", open: "07:00", close: "19:00" },
      { day: "sat", open: "08:00", close: "17:00" },
      { day: "sun", open: "00:00", close: "00:00" },
    ]),
    capacity: 25,
    currentLoad: 8,
    handlingFee: 500,
    status: "active",
  },
  {
    id: "rp-dla-004",
    name: "Pharmacie Makepe",
    type: "pharmacy",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "Makepe Bel Air",
    lieuDit: "Carrefour lycée",
    latitude: 4.0891,
    longitude: 9.7402,
    ownerName: "Pharmacie Makepe SARL",
    ownerPhone: "+237670998877",
    openingHours: defaultHours([
      { day: "mon", open: "08:00", close: "20:00" },
      { day: "tue", open: "08:00", close: "20:00" },
      { day: "wed", open: "08:00", close: "20:00" },
      { day: "thu", open: "08:00", close: "20:00" },
      { day: "fri", open: "08:00", close: "20:00" },
      { day: "sat", open: "09:00", close: "18:00" },
      { day: "sun", open: "10:00", close: "13:00" },
    ]),
    capacity: 35,
    currentLoad: 0,
    handlingFee: 600,
    status: "pending_validation",
  },
];

export const initialParcels: RelayParcelEntry[] = [
  {
    trackingNumber: "TBT-CM-2026-00001",
    relayPointId: "rp-dla-001",
    status: "AT_HUB",
    depositedAt: "2026-07-04T10:30:00Z",
    maskedRecipientName: "J*** D***",
    maskedRecipientPhone: "6*****789",
  },
  {
    trackingNumber: "TBT-CM-2026-00002",
    relayPointId: "rp-dla-001",
    status: "AT_HUB",
    depositedAt: "2026-07-05T08:15:00Z",
    maskedRecipientName: "M*** K***",
    maskedRecipientPhone: "6*****456",
  },
  {
    trackingNumber: "TBT-CM-2026-00003",
    relayPointId: "rp-dla-003",
    status: "IN_TRANSIT",
    maskedRecipientName: "A*** N***",
    maskedRecipientPhone: "6*****321",
  },
  {
    trackingNumber: "TBT-CM-2026-00004",
    relayPointId: "rp-yde-002",
    status: "PICKED_UP_FROM_HUB",
    depositedAt: "2026-07-01T14:00:00Z",
    pickedUpAt: "2026-07-03T11:20:00Z",
    maskedRecipientName: "P*** E***",
    maskedRecipientPhone: "6*****654",
  },
  {
    trackingNumber: "TBT-CM-2026-00005",
    relayPointId: "rp-yde-001",
    status: "AT_HUB",
    depositedAt: "2026-07-05T06:45:00Z",
    maskedRecipientName: "S*** B***",
    maskedRecipientPhone: "6*****987",
  },
];

export const initialHandoverEvents: HandoverEvent[] = [
  {
    id: "hev-001",
    trackingNumber: "TBT-CM-2026-00001",
    relayPointId: "rp-dla-001",
    eventType: "DEPOSIT",
    actorRole: "driver",
    actorId: "drv-001",
    timestamp: "2026-07-04T10:30:00Z",
    verificationMethod: "qr_scan",
    verificationReference: "QR-TBT-CM-2026-00001",
    txHash: "0xabc123def456",
  },
  {
    id: "hev-002",
    trackingNumber: "TBT-CM-2026-00004",
    relayPointId: "rp-yde-002",
    eventType: "PICKUP",
    actorRole: "recipient",
    actorId: "recipient",
    timestamp: "2026-07-03T11:20:00Z",
    verificationMethod: "otp_code",
    verificationReference: "482910",
    txHash: "0xdef789ghi012",
  },
];

export const initialNotifications: RelayNotification[] = [
  {
    id: "notif-001",
    trackingNumber: "TBT-CM-2026-00001",
    type: "PARCEL_ARRIVED_AT_HUB",
    message: "Nouveau colis TBT-CM-2026-00001 déposé à votre point relais.",
    createdAt: "2026-07-04T10:31:00Z",
    read: false,
  },
  {
    id: "notif-002",
    trackingNumber: "TBT-CM-2026-00002",
    type: "PARCEL_READY_FOR_PICKUP",
    message: "Colis TBT-CM-2026-00002 prêt pour retrait.",
    createdAt: "2026-07-05T08:16:00Z",
    read: false,
  },
];

export const initialTrackingSessions: DeliveryTrackingSession[] = [];

export interface RelayOwnerCredential {
  id: string;
  fullName: string;
  phone: string;
  password: string;
  managedRelayPointIds: string[];
}

export const relayOwnerCredentials: RelayOwnerCredential[] = [
  {
    id: "owner-001",
    fullName: "Mama Ngo",
    phone: "+237699999999",
    password: "123456",
    managedRelayPointIds: ["rp-dla-001"],
  },
  {
    id: "owner-002",
    fullName: "Jean-Paul Mbarga",
    phone: "+237655887766",
    password: "123456",
    managedRelayPointIds: ["rp-dla-003"],
  },
];

/** Store en mémoire — lu/écrit par les route handlers */
export const relayStore = {
  relayPoints: [...initialRelayPoints] as RelayPoint[],
  parcels: [...initialParcels] as RelayParcelEntry[],
  handoverEvents: [...initialHandoverEvents] as HandoverEvent[],
  notifications: [...initialNotifications] as RelayNotification[],
  trackingSessions: [...initialTrackingSessions] as DeliveryTrackingSession[],
  applications: [] as Array<RelayPointApplication & { id: string; submittedAt: string }>,
};

const globalStore = globalThis as unknown as { __relaySeedStore?: typeof relayStore };

if (process.env.NODE_ENV !== "production") {
  if (!globalStore.__relaySeedStore) {
    globalStore.__relaySeedStore = relayStore;
  }
}

export function getMutableStore(): typeof relayStore {
  if (process.env.NODE_ENV !== "production" && globalStore.__relaySeedStore) {
    return globalStore.__relaySeedStore;
  }
  return relayStore;
}
