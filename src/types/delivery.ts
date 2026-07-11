export enum DeliveryStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  locatedAt: Address;
}

export interface Parcel {
  weight: number;
  dimensions: string;
  description: string;
}

export interface Delivery {
  id: string;
  status: DeliveryStatus;
  trackingCode: string;
  createdAt: string;
  contains: Parcel;
  sender: ContactInfo;
  recipient: ContactInfo;
  assignedTo?: string; // ID of the Deliver (Livreur)
  pickupFrom?: string; // ID of the RelayPoint (Optional)
  dropOffAt?: string; // ID of the RelayPoint (Optional)
}
