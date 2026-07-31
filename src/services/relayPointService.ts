import { apiFetch, unwrapData } from "@/services/packageService";
import type {
  ApiResponse,
  RelayPoint,
  RelayPointManager,
  RelayPointSearchQuery,
  RelayPointSearchResult,
  RelayPointApplication,
} from "@/types/relayPoint";

export async function searchRelayPoints(
  query: RelayPointSearchQuery
): Promise<RelayPointSearchResult[]> {
  const params = new URLSearchParams({
    latitude: String(query.latitude),
    longitude: String(query.longitude),
    radiusKm: String(query.radiusKm ?? 5),
    onlyAvailable: String(query.onlyAvailable ?? false),
  });
  const res = await apiFetch<ApiResponse<RelayPointSearchResult[]>>(
    `/api/relay-points?${params}`
  );
  return unwrapData(res);
}

export async function getRelayPoint(id: string): Promise<RelayPoint> {
  const res = await apiFetch<ApiResponse<RelayPoint>>(
    `/api/relay-points/${id}`
  );
  return unwrapData(res);
}

export interface RelayPointDetail extends RelayPoint {
  manager?: Omit<RelayPointManager, "password" | "managedRelayPointIds">;
}

export async function getRelayPointDetail(id: string): Promise<RelayPointDetail> {
  const res = await apiFetch<ApiResponse<RelayPointDetail>>(
    `/api/relay-points/${id}?includeManager=true`
  );
  return unwrapData(res);
}

export async function createRelayPoint(
  data: Omit<RelayPoint, "id">
): Promise<RelayPoint> {
  const res = await apiFetch<ApiResponse<RelayPoint>>("/api/relay-points", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return unwrapData(res);
}

export async function applyForRelayPoint(
  data: RelayPointApplication
): Promise<{ id: string; submittedAt: string }> {
  const res = await apiFetch<
    ApiResponse<{ id: string; submittedAt: string }>
  >("/api/relay-points/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return unwrapData(res);
}
export async function validateRelayPointApplication(
  applicationId: string,
  approved: boolean,
  reason: string,
  overrides?: { capacity?: number; handlingFee?: number },
): Promise<ApiResponse<any>> {
  const res = await apiFetch<ApiResponse<any>>(
    `/api/relay-points/applications/${applicationId}/validate`,
    {
      method: "POST",
      body: JSON.stringify({ approved, reason, ...overrides }),
    },
  );
  return res;
}

export async function getRelayPointParcels(relayPointId: string) {
  const res = await apiFetch<ApiResponse<import("@/types/relayPoint").RelayParcelEntry[]>>(
    `/api/relay-points/${relayPointId}/parcels`
  );
  return unwrapData(res);
}

export async function getRelayNotifications(relayPointId: string) {
  const res = await apiFetch<ApiResponse<import("@/types/relayPoint").RelayNotification[]>>(
    `/api/relay-points/${relayPointId}/notifications`
  );
  return unwrapData(res);
}

export async function getRelayManagers() {
  const res = await apiFetch<ApiResponse<Array<Omit<import("@/types/relayPoint").RelayPointManager, "password">>>>(
    "/api/relay-managers"
  );
  return unwrapData(res);
}

export const relayPointService = {
  getAllRelayPoints: async (): Promise<RelayPoint[]> => {
    const res = await apiFetch<ApiResponse<RelayPoint[]>>(
      "/api/relay-points?latitude=3.8667&longitude=11.5167&radiusKm=9999"
    );
    return unwrapData(res);
  },
};

export default relayPointService;
