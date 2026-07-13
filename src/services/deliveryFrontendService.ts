// ----- ./src/services/deliveryFrontendService.ts -----
import { apiFetch, unwrapData } from "@/services/packageService";
import { Delivery } from "@/types/delivery";
import { DeliverRequest } from "@/types/deliverRequest";
import type { ApiResponse } from "@/types/relayPoint";

// UC4: Order a delivery
export async function orderDelivery(deliveryData: any): Promise<Delivery> {
  const res = await apiFetch<ApiResponse<Delivery>>("/api/deliveries", {
    method: "POST",
    body: JSON.stringify(deliveryData),
  });
  return unwrapData(res);
}

// UC5: Select a relay point
export async function assignRelayPoint(
  deliveryId: string,
  relayPointId: string,
  type: "pickup" | "dropoff",
): Promise<Delivery> {
  const res = await apiFetch<ApiResponse<Delivery>>(
    `/api/deliveries/${deliveryId}/relay-point`,
    {
      method: "PUT",
      body: JSON.stringify({ relayPointId, type }),
    },
  );
  return unwrapData(res);
}

// UC8: Request a delivery (Livreur)
export async function requestDelivery(
  deliveryId: string,
  deliverId: string,
): Promise<DeliverRequest> {
  const res = await apiFetch<ApiResponse<DeliverRequest>>(
    "/api/deliver-requests",
    {
      method: "POST",
      body: JSON.stringify({ deliveryId, deliverId }),
    },
  );
  return unwrapData(res);
}

// UC6: Choose a deliver (Client accepts)
export async function acceptDeliverRequest(
  requestId: string,
): Promise<DeliverRequest> {
  const res = await apiFetch<ApiResponse<DeliverRequest>>(
    `/api/deliver-requests/${requestId}/accept`,
    {
      method: "PUT",
    },
  );
  return unwrapData(res);
}
