"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id?: string;
  latitude?: number;
  longitude?: number;
  position?: [number, number]; // Support Master format
  label?: string;
  color?: string;
  popupContent?: React.ReactNode;
}

export interface MapLeafletProps {
  // Support both BRIS format and Master format
  center: { latitude: number; longitude: number } | [number, number];
  zoom?: number;
  markers?: MapMarker[];
  route?: any; // Support Master routing
  className?: string;
  onMarkerClick?: (markerId: string) => void;
}

export default function MapLeaflet({
  center,
  zoom = 13,
  markers = [],
  route = null,
  className = "h-80 w-full rounded-xl",
  onMarkerClick,
}: MapLeafletProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fix default icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  if (!isMounted)
    return <div className={className + " bg-gray-100 animate-pulse"} />;

  // Normalize center
  const mapCenter: [number, number] = Array.isArray(center)
    ? center
    : [center.latitude, center.longitude];

  // Safely extract route coordinates
  let routeCoords: [number, number][] = [];
  if (route && route.geometry && route.geometry.coordinates) {
    routeCoords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
  } else if (route && route.routes && route.routes[0]) {
    routeCoords = route.routes[0].geometry.coordinates.map((c: any) => [
      c[1],
      c[0],
    ]);
  }

  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((m, i) => {
          const pos: [number, number] = m.position || [
            m.latitude!,
            m.longitude!,
          ];
          if (!pos[0] || !pos[1]) return null;
          return (
            <Marker key={m.id || i} position={pos}>
              {(m.label || m.popupContent) && (
                <Popup>
                  {m.popupContent ?? (
                    <span className="font-medium">{m.label}</span>
                  )}
                </Popup>
              )}
            </Marker>
          );
        })}

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "#f97316", weight: 5 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
