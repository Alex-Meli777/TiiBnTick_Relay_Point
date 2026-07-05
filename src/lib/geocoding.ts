export interface GeocodeResult {
  country: string;
  region: string;
  city: string;
  address: string;
  lieuDit?: string;
  latitude: number;
  longitude: number;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export async function reverseGeocodeRaw(
  latitude: number,
  longitude: number
): Promise<GeocodeResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`,
      { headers: { "User-Agent": "TiiBnTick-RelayPoint/1.0" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address ?? {};
    return {
      country: addr.country ?? "Cameroun",
      region: addr.state ?? addr.region ?? "",
      city: addr.city ?? addr.town ?? addr.village ?? "",
      address:
        [addr.road, addr.house_number].filter(Boolean).join(" ") ||
        (data.display_name?.split(",")[0] ?? ""),
      lieuDit: addr.neighbourhood ?? addr.suburb ?? "",
      latitude,
      longitude,
    };
  } catch {
    return null;
  }
}

export function getDeviceLocation(): Promise<DeviceLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  });
}

/** Position par défaut : centre Douala */
export const DEFAULT_MAP_CENTER = { latitude: 4.0511, longitude: 9.7085 };
