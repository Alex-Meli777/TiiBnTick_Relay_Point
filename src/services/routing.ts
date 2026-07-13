// ----- ./src/services/routing.ts -----
import { calculateDistanceKm } from "@/lib/utils";

export async function getRoute(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  profile: string = "driving",
) {
  const osrmProfile = profile === "bike" ? "cycling" : "driving";
  const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000), // Fast 6 second timeout
    });

    if (!res.ok) throw new Error("OSRM Routing error response");
    const data = await res.json();

    if (data && data.routes && data.routes.length > 0) {
      return data;
    }
    throw new Error("No routing matches");
  } catch (error) {
    console.warn(
      "Routing API failed or was blocked by CORS. Falling back to geometric calculations.",
      error,
    );

    // Dynamic straight-line fallback calculation
    const distance = calculateDistanceKm(lat1, lon1, lat2, lon2);
    const estimatedDuration = Math.round(distance * 1.5 + 5); // 1.5 mins per km + 5 mins buffer

    return {
      routes: [
        {
          distance: distance * 1000,
          duration: estimatedDuration * 60,
          geometry: {
            type: "LineString",
            coordinates: [
              [lon1, lat1],
              [lon2, lat2],
            ],
          },
        },
      ],
    };
  }
}
