export enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface DeliverRequest {
  id: string;
  deliveryId: string; // The order being requested
  deliverId: string; // The deliver making the request
  status: RequestStatus;
  createdAt: string;
}
