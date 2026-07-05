import type { ApiResponse } from "@/types/relayPoint";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Wrapper fetch partagé — même pattern que le module expédition TiiBnTick.
 * Utilisé par relayPointService et handoverService côté client.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = (await res.json().catch(() => ({}))) as ApiResponse<T> & T;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (body as ApiResponse<T>).error ?? res.statusText
    );
  }

  return body;
}

export function unwrapData<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === undefined) {
    throw new ApiError(500, response.error ?? "Réponse invalide");
  }
  return response.data;
}
