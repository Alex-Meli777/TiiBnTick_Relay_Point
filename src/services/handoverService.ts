import { apiFetch, unwrapData } from "@/services/packageService";
import type {
  ApiResponse,
  DepositRequest,
  PickupRequest,
  RelayParcelEntry,
  HandoverEvent,
  DeliveryTrackingSession,
  ProofOfDeliverySubmission,
} from "@/types/relayPoint";

export async function depositParcel(
  data: DepositRequest
): Promise<RelayParcelEntry> {
  const res = await apiFetch<ApiResponse<RelayParcelEntry>>(
    "/api/handovers/deposit",
    { method: "POST", body: JSON.stringify(data) }
  );
  return unwrapData(res);
}

export async function pickupParcel(
  data: PickupRequest
): Promise<RelayParcelEntry> {
  const res = await apiFetch<ApiResponse<RelayParcelEntry>>(
    "/api/handovers/pickup",
    { method: "POST", body: JSON.stringify(data) }
  );
  return unwrapData(res);
}

export async function getHandoverHistory(
  trackingNumber: string
): Promise<HandoverEvent[]> {
  const res = await apiFetch<ApiResponse<HandoverEvent[]>>(
    `/api/handovers/${encodeURIComponent(trackingNumber)}`
  );
  return unwrapData(res);
}

export async function activateDeliveryTracking(data: {
  trackingNumber: string;
  driverLatitude: number;
  driverLongitude: number;
}): Promise<DeliveryTrackingSession> {
  const res = await apiFetch<ApiResponse<DeliveryTrackingSession>>(
    "/api/tracking/activate",
    { method: "POST", body: JSON.stringify(data) }
  );
  return unwrapData(res);
}

export async function getTrackingByToken(
  shareToken: string
): Promise<DeliveryTrackingSession> {
  const res = await apiFetch<ApiResponse<DeliveryTrackingSession>>(
    `/api/tracking/${shareToken}`
  );
  return unwrapData(res);
}

export async function updateTrackingPosition(
  shareToken: string,
  latitude: number,
  longitude: number
): Promise<DeliveryTrackingSession> {
  const res = await apiFetch<ApiResponse<DeliveryTrackingSession>>(
    `/api/tracking/${shareToken}`,
    {
      method: "PATCH",
      body: JSON.stringify({ latitude, longitude }),
    }
  );
  return unwrapData(res);
}

export async function submitProofOfDelivery(
  data: ProofOfDeliverySubmission
): Promise<{ success: boolean }> {
  const res = await apiFetch<ApiResponse<{ success: boolean }>>(
    "/api/proof-of-delivery",
    { method: "POST", body: JSON.stringify(data) }
  );
  return unwrapData(res);
}

export async function relayOwnerLogin(phone: string, password: string) {
  const res = await apiFetch<
    ApiResponse<{ fullName: string; managedRelayPointIds: string[] }>
  >("/api/relay-auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
  return unwrapData(res);
}
