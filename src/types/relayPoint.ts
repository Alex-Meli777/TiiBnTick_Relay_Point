// ./types/relayPoint.ts
// ----------------------------------------------------------------------------------------------------

export enum RelayPointStatusBackend {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
  REVOKED = "REVOKED",
}

export interface RelayPointManager {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  nationalId: string; // Added: For backend Freelancer creation
  nui: string; // Added: For backend Freelancer creation
  managedRelayPointIds: string[];
}

export type RelayOwnerCredential = RelayPointManager;

export interface RelayPoint {
  id: string;
  name: string;
  type: "shop" | "pharmacy" | "kiosk" | "official_agency";
  country: string;
  region: string;
  city: string;
  address: string;
  lieuDit: string;
  latitude: number;
  longitude: number;

  // Renamed from managerId to freelancerId for backend alignment
  freelancerId: string;

  openingHours: {
    day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
    open: string;
    close: string;
  }[];
  capacity: number;
  currentLoad: number;
  handlingFee: number;

  // Uses the new backend-aligned status enum
  status: RelayPointStatusBackend;
  photos?: string[];

  // Added storage dimensions for consistency with UI form and backend logistics table
  storageLength?: number;
  storageWidth?: number;
  storageHeight?: number;
  storageDimensionUnit?: "cm" | "m";
}

// NEW: Interface for Relay Point Pricing Policy (maps to backend RelayPointPricingPolicy.java)
export interface RelayPointPricingPolicy {
  id?: string; // Optional for creation, assigned by backend
  relayPointId: string;
  pricePerKg: number;
  pricePerCbm: number;
  pricePerDay: number; // Daily storage fee
  gracePeriodDays: number; // Number of free storage days
  penaltyPerDay: number; // Penalty fee per day after grace period
  fragileSurcharge: number;
  perishableSurcharge: number;
  baseFee: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RelayPointSearchQuery {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  onlyAvailable?: boolean;
}

export interface RelayPointSearchResult extends RelayPoint {
  distanceKm: number;
}

export type ParcelHubStatus =
  | "IN_TRANSIT"
  | "AT_HUB"
  | "PICKED_UP_FROM_HUB"
  | "RETURNED_TO_SENDER";

export interface RelayParcelEntry {
  trackingNumber: string;
  relayPointId: string;
  status: ParcelHubStatus;
  depositedAt?: string;
  pickedUpAt?: string;
  maskedRecipientName: string;
  maskedRecipientPhone: string;
}

export interface HandoverEvent {
  id: string;
  trackingNumber: string;
  relayPointId: string;
  eventType: "DEPOSIT" | "PICKUP";
  actorRole: "driver" | "relay_owner" | "recipient";
  actorId: string;
  timestamp: string;
  verificationMethod: "qr_scan" | "otp_code" | "manual_id_check";
  verificationReference?: string;
  txHash?: string;
}

export interface DepositRequest {
  trackingNumber: string;
  relayPointId: string;
  driverId: string;
  verificationMethod: HandoverEvent["verificationMethod"];
  verificationReference?: string;
}

export interface PickupRequest {
  trackingNumber: string;
  relayPointId: string;
  recipientOtp: string;
}

export interface RelayOwnerSession {
  id: string;
  fullName: string;
  phone: string;
  managedRelayPointIds: string[];
  token: string;
}

export interface RelayNotification {
  id: string;
  trackingNumber: string;
  type: "PARCEL_ARRIVED_AT_HUB" | "PARCEL_READY_FOR_PICKUP" | "PARCEL_OVERDUE";
  message: string;
  createdAt: string;
  read: boolean;
}

// Updated RelayPointApplication to include nationalId/nui for manager and storage dimensions
export interface RelayPointApplication {
  manager: {
    // This manager object will implicitly create a Freelancer in the backend
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    nationalId?: string; // Added for freelancer creation alignment
    nui?: string; // Added for freelancer creation alignment
  };
  businessName: string; // maps to RelayPoint.name
  type: RelayPoint["type"];
  country: string;
  region: string;
  city: string;
  address: string;
  lieuDit: string;
  latitude: number;
  longitude: number;
  openingHours?: RelayPoint["openingHours"];
  capacity: number;
  handlingFee: number;
  description?: string;
  photos?: string[]; // Base64 strings for application submission. Maps to storefrontPhoto/shopPhoto in backend.

  // Added storage dimensions for consistency with UI form.
  storageLength?: number;
  storageWidth?: number;
  storageHeight?: number;
  storageDimensionUnit?: "cm" | "m";
}

export interface StoredRelayPointApplication extends RelayPointApplication {
  id: string;
  submittedAt: string;
  status: RelayPointStatusBackend; // Use backend-aligned enum
}

export interface DeliveryTrackingSession {
  id: string;
  trackingNumber: string;
  shareToken: string;
  driverLatitude: number;
  driverLongitude: number;
  active: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface ProofOfDeliverySubmission {
  trackingNumber: string;
  photoBase64?: string;
  otpCode?: string;
  signature?: string;
  submittedBy: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const RELAY_POINT_TYPE_LABELS: Record<RelayPoint["type"], string> = {
  shop: "Boutique",
  pharmacy: "Pharmacie",
  kiosk: "Kiosque",
  official_agency: "Agence officielle",
};

export const DAY_LABELS: Record<
  RelayPoint["openingHours"][number]["day"],
  string
> = {
  mon: "Lundi",
  tue: "Mardi",
  wed: "Mercredi",
  thu: "Jeudi",
  fri: "Vendredi",
  sat: "Samedi",
  sun: "Dimanche",
};