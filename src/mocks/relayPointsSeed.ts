import type {
  RelayPoint,
  RelayPointManager,
  RelayParcelEntry,
  HandoverEvent,
  RelayNotification,
  DeliveryTrackingSession,
  StoredRelayPointApplication,
  RelayPointPricingPolicy, // NEW
} from "@/types/relayPoint";

// Fix: Import the enum as a value, and others as types
import { RelayPointStatusBackend } from "@/types/relayPoint"; 

import { generateId } from "@/lib/utils"; 


const defaultHours = (
  days: Array<{ day: RelayPoint["openingHours"][number]["day"]; open: string; close: string }>
) => days;

// --- 1. Define RelayPointManagers (who are also Freelancers) ---
export const relayManagers: RelayPointManager[] = [
  {
    id: "fl-dla-001", // Freelancer ID, maps to backend Freelancer.id
    firstName: "Mama",
    lastName: "Ngo",
    fullName: "Mama Ngo",
    phone: "+237699999999",
    email: "mama.ngo@relay.cm",
    password: "123456",
    nationalId: "123456789DLA", // Added: For backend Freelancer creation
    nui: "NINE123456789", // Added: For backend Freelancer creation
    managedRelayPointIds: ["rp-dla-001"],
  },
  {
    id: "fl-dla-002", // Freelancer ID
    firstName: "Dr.",
    lastName: "Essomba",
    fullName: "Dr. Essomba",
    phone: "+237677123456",
    email: "dr.essomba@pharmacy.cm",
    password: "123456",
    nationalId: "987654321DLA", // Added
    nui: "NINE987654321", // Added
    managedRelayPointIds: ["rp-dla-002"],
  },
  {
    id: "fl-dla-003", // Freelancer ID
    firstName: "Jean-Paul",
    lastName: "Mbarga",
    fullName: "Jean-Paul Mbarga",
    phone: "+237655887766",
    email: "jp.mbarga@kiosk.cm",
    password: "123456",
    nationalId: "456789012DLA", // Added
    nui: "NINE456789012", // Added
    managedRelayPointIds: ["rp-dla-003"],
  },
  {
    id: "fl-yde-001", // Freelancer ID (for TiiBnTick agency)
    firstName: "Service",
    lastName: "TiiBnTick",
    fullName: "Service TiiBnTick",
    phone: "+237222334455",
    email: "bastos@tiibntick.cm",
    password: "123456",
    nationalId: "321098765YDE", // Added
    nui: "NINE321098765", // Added
    managedRelayPointIds: ["rp-yde-001"],
  },
  {
    id: "fl-yde-002", // Freelancer ID
    firstName: "Tantine",
    lastName: "Aminata",
    fullName: "Tantine Aminata",
    phone: "+237698112233",
    email: "tantine.aminata@shop.cm",
    password: "123456",
    nationalId: "654321098YDE", // Added
    nui: "NINE654321098", // Added
    managedRelayPointIds: ["rp-yde-002"],
  },
  {
    id: "fl-dla-004-pending", // Freelancer ID for a pending RP application
    firstName: "Pending",
    lastName: "Manager",
    fullName: "Pending Manager",
    phone: "+237611223344",
    email: "pending@relay.cm",
    password: "123456",
    nationalId: "112233445DLA", // Added
    nui: "NINE112233445", // Added
    managedRelayPointIds: [], // No points yet, application is pending
  },
];

// --- 2. Define RelayPoints (now linked to Freelancers and using new status enum) ---
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
    freelancerId: "fl-dla-001", // Linked to Mama Ngo's freelancer ID
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
    status: RelayPointStatusBackend.APPROVED, // Using backend enum
    photos: ["/relay/shop-1.jpg"],
    storageLength: 3, storageWidth: 2, storageHeight: 2.5, storageDimensionUnit: "m", // Added
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
    freelancerId: "fl-dla-002", // Linked to Dr. Essomba
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
    currentLoad: 30, // Fully loaded
    handlingFee: 750,
    status: RelayPointStatusBackend.APPROVED,
    storageLength: 2, storageWidth: 1.5, storageHeight: 2, storageDimensionUnit: "m", // Added
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
    freelancerId: "fl-dla-003", // Linked to Jean-Paul Mbarga
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
    status: RelayPointStatusBackend.APPROVED,
    storageLength: 1.5, storageWidth: 1.2, storageHeight: 1.8, storageDimensionUnit: "m", // Added
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
    freelancerId: "fl-yde-001", // Linked to TiiBnTick Service
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
    status: RelayPointStatusBackend.APPROVED,
    storageLength: 5, storageWidth: 4, storageHeight: 3, storageDimensionUnit: "m", // Added
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
    freelancerId: "fl-yde-002", // Linked to Tantine Aminata
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
    status: RelayPointStatusBackend.APPROVED,
    storageLength: 2.5, storageWidth: 1.8, storageHeight: 2.2, storageDimensionUnit: "m", // Added
  },
  {
    id: "rp-dla-004-pending", // This one is pending
    name: "Pharmacie Makepe",
    type: "pharmacy",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "Makepe Bel Air",
    lieuDit: "Carrefour lycée",
    latitude: 4.0891,
    longitude: 9.7402,
    freelancerId: "fl-dla-004-pending", // Linked to pending manager
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
    status: RelayPointStatusBackend.PENDING, // PENDING status for admin validation
    storageLength: 3, storageWidth: 2, storageHeight: 2, storageDimensionUnit: "m", // Added
  },
];
// --- 3. Define RelayPointPricingPolicies (NEW ARRAY) ---
export const initialRelayPointPricingPolicies: RelayPointPricingPolicy[] = [
  {
    id: generateId("pp"),
    relayPointId: "rp-dla-001",
    pricePerKg: 100,
    pricePerCbm: 5000,
    pricePerDay: 50,
    gracePeriodDays: 2,
    penaltyPerDay: 100,
    fragileSurcharge: 200,
    perishableSurcharge: 300,
    baseFee: 200,
    currency: "FCFA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pp"),
    relayPointId: "rp-dla-002",
    pricePerKg: 120,
    pricePerCbm: 6000,
    pricePerDay: 70,
    gracePeriodDays: 1,
    penaltyPerDay: 150,
    fragileSurcharge: 250,
    perishableSurcharge: 400,
    baseFee: 250,
    currency: "FCFA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add other pricing policies for other relay points
  {
    id: generateId("pp"),
    relayPointId: "rp-dla-003",
    pricePerKg: 90,
    pricePerCbm: 4000,
    pricePerDay: 40,
    gracePeriodDays: 3,
    penaltyPerDay: 80,
    fragileSurcharge: 150,
    perishableSurcharge: 250,
    baseFee: 150,
    currency: "FCFA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pp"),
    relayPointId: "rp-yde-001", // Official agency, often different pricing
    pricePerKg: 80,
    pricePerCbm: 3000,
    pricePerDay: 0, // No storage fee
    gracePeriodDays: 999, // Effectively unlimited grace period
    penaltyPerDay: 0,
    fragileSurcharge: 100,
    perishableSurcharge: 150,
    baseFee: 100,
    currency: "FCFA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pp"),
    relayPointId: "rp-yde-002",
    pricePerKg: 110,
    pricePerCbm: 5500,
    pricePerDay: 60,
    gracePeriodDays: 2,
    penaltyPerDay: 120,
    fragileSurcharge: 220,
    perishableSurcharge: 350,
    baseFee: 180,
    currency: "FCFA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pp"), // Pricing for pending RP
    relayPointId: "rp-dla-004-pending",
    pricePerKg: 100,
    pricePerCbm: 4500,
    pricePerDay: 55,
    gracePeriodDays: 2,
    penaltyPerDay: 110,
    fragileSurcharge: 210,
    perishableSurcharge: 310,
    baseFee: 190,
    currency: "FCFA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// --- 4. Define StoredRelayPointApplications (using new status enum) ---
export const initialApplications: StoredRelayPointApplication[] = [
  {
    id: generateId("app"),
    manager: {
      firstName: "Test",
      lastName: "Applicant",
      phone: "+237699001122",
      email: "test.applicant@example.com",
      password: "password123",
      nationalId: "APPL00000001", // Added for manager
      nui: "NINEAPPL00001", // Added for manager
    },
    businessName: "Boutique du Coin",
    type: "shop",
    country: "Cameroun",
    region: "Centre",
    city: "Yaoundé",
    address: "Rue Principale, Odza",
    lieuDit: "À côté du marché",
    latitude: 3.831,
    longitude: 11.53,
    openingHours: defaultHours([
      { day: "mon", open: "08:00", close: "19:00" },
      { day: "tue", open: "08:00", close: "19:00" },
      { day: "wed", open: "08:00", close: "19:00" },
      { day: "thu", open: "08:00", close: "19:00" },
      { day: "fri", open: "08:00", close: "20:00" },
      { day: "sat", open: "09:00", close: "14:00" },
      { day: "sun", open: "00:00", close: "00:00" },
    ]),
    capacity: 25,
    handlingFee: 500,
    description: "Petite boutique bien située pour accueillir des colis.",
    photos: ["/mock/boutique-coin-front.jpg", "/mock/boutique-coin-inside.jpg"],
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: RelayPointStatusBackend.PENDING, // PENDING status
    storageLength: 2, storageWidth: 1.5, storageHeight: 2, storageDimensionUnit: "m", // Added
  },
  {
    id: generateId("app"),
    manager: {
      firstName: "Approved",
      lastName: "Applicant",
      phone: "+237699001133",
      email: "approved.applicant@example.com",
      password: "password123",
      nationalId: "APPL00000002",
      nui: "NINEAPPL00002",
    },
    businessName: "Service Rapide Etoudi",
    type: "kiosk",
    country: "Cameroun",
    region: "Centre",
    city: "Yaoundé",
    address: "Carrefour Etoudi",
    lieuDit: "À côté du commissariat",
    latitude: 3.89,
    longitude: 11.51,
    capacity: 15,
    handlingFee: 450,
    description: "Kiosque très fréquenté, idéal pour les livraisons rapides.",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: RelayPointStatusBackend.APPROVED, // APPROVED status
    storageLength: 1.2, storageWidth: 1, storageHeight: 1.5, storageDimensionUnit: "m", // Added
  },
  {
    id: generateId("app"),
    manager: {
      firstName: "Rejected",
      lastName: "Applicant",
      phone: "+237699001144",
      email: "rejected.applicant@example.com",
      password: "password123",
      nationalId: "APPL00000003",
      nui: "NINEAPPL00003",
    },
    businessName: "Magasin Vide",
    type: "shop",
    country: "Cameroun",
    region: "Littoral",
    city: "Douala",
    address: "Zone Industrielle",
    lieuDit: "Près de l'ancienne usine",
    latitude: 4.04,
    longitude: 9.75,
    capacity: 5,
    handlingFee: 300,
    description: "Espace limité et peu accessible.",
    submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    status: RelayPointStatusBackend.REJECTED, // REJECTED status
    storageLength: 1, storageWidth: 0.8, storageHeight: 1.2, storageDimensionUnit: "m", // Added
  },
];


export const initialParcels: RelayParcelEntry[] = [
  {
    trackingNumber: "TBT-CM-2026-00001",
    relayPointId: "fd-dla-001",
    status: "AT_HUB",
    depositedAt: "2026-07-04T10:30:00Z",
    maskedRecipientName: "J*** D***",
    maskedRecipientPhone: "6*****789",
  },
  {
    trackingNumber: "TBT-CM-2026-00002",
    relayPointId: "fd-dla-001",
    status: "AT_HUB",
    depositedAt: "2026-07-05T08:15:00Z",
    maskedRecipientName: "M*** K***",
    maskedRecipientPhone: "6*****456",
  },
  {
    trackingNumber: "TBT-CM-2026-00003",
    relayPointId: "fd-dla-003",
    status: "IN_TRANSIT",
    maskedRecipientName: "A*** N***",
    maskedRecipientPhone: "6*****321",
  },
  {
    trackingNumber: "TBT-CM-2026-00004",
    relayPointId: "fd-yde-002",
    status: "PICKED_UP_FROM_HUB",
    depositedAt: "2026-07-01T14:00:00Z",
    pickedUpAt: "2026-07-03T11:20:00Z",
    maskedRecipientName: "P*** E***",
    maskedRecipientPhone: "6*****654",
  },
  {
    trackingNumber: "TBT-CM-2026-00005",
    relayPointId: "fd-yde-001",
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
    relayPointId: "fd-dla-001",
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
    relayPointId: "fd-yde-002",
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

export interface RelayOwnerCredential extends RelayPointManager {}

// --- Final Relay Store Definition ---
export const relayStore = {
  relayPoints: [...initialRelayPoints] as RelayPoint[],
  parcels: [...initialParcels] as RelayParcelEntry[],
  handoverEvents: [...initialHandoverEvents] as HandoverEvent[],
  notifications: [...initialNotifications] as RelayNotification[],
  trackingSessions: [...initialTrackingSessions] as DeliveryTrackingSession[],
  applications: [...initialApplications] as StoredRelayPointApplication[],
  relayManagers: [...relayManagers] as RelayPointManager[],
  relayPointPricingPolicies: [...initialRelayPointPricingPolicies], // NEW: Add pricing policies to the store
};

export const relayOwnerCredentials = relayManagers;


// Global store initialization logic (remains unchanged)
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