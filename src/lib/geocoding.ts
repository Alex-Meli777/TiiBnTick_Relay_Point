export const DEFAULT_MAP_CENTER = {
  latitude: 3.8667,
  longitude: 11.5167,
};

export async function getDeviceLocation() {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation unavailable");
  }

  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      reject,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
