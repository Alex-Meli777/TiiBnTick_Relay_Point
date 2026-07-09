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
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  openingHours: {
    day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
    open: string;
    close: string;
  }[];
  capacity: number;
  currentLoad: number;
  handlingFee: number;
  status: "active" | "suspended" | "pending_validation";
  photos?: string[];
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
  type:
    | "PARCEL_ARRIVED_AT_HUB"
    | "PARCEL_READY_FOR_PICKUP"
    | "PARCEL_OVERDUE";
  message: string;
  createdAt: string;
  read: boolean;
}

export interface RelayPointApplication {
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  businessName: string;
  type: RelayPoint["type"];
  country: string;
  region: string;
  city: string;
  address: string;
  lieuDit: string;
  description?: string;
}

export interface RelayPointApplication {
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  businessName: string;
  type: RelayPoint["type"];
  country: string;
  region: string;
  city: string;
  address: string;
  lieuDit: string;
  description?: string;
}

export interface StoredRelayPointApplication extends RelayPointApplication {
  id: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
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
