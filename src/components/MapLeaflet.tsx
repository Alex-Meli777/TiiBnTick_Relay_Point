"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMapEvents,
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
  radiusKm?: number;
  className?: string;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (latitude: number, longitude: number) => void;
}

export default function MapLeaflet({
  center,
  zoom = 13,
  markers = [],
  route = null,
  radiusKm,
  className = "h-80 w-full rounded-xl",
  onMarkerClick,
  onMapClick,
}: MapLeafletProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

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

  function createMarkerIcon(color: string, isSelected?: boolean) {
    const size = isSelected ? 32 : 28;
    return L.divIcon({
      className: "custom-map-marker",
      html: `
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.08);"></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2 - 5],
    });
  }

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

  function ClickHandler({ onMapClick }: { onMapClick?: (latitude: number, longitude: number) => void }) {
    useMapEvents({
      click(event) {
        onMapClick?.(event.latlng.lat, event.latlng.lng);
      },
    });
    return null;
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
        <ClickHandler onMapClick={onMapClick} />

        {markers.map((m, i) => {
          const pos: [number, number] = m.position || [
            m.latitude!,
            m.longitude!,
          ];
          if (!pos[0] || !pos[1]) return null;
          const isSelected = m.id === "selected";
          const icon = isSelected
            ? createMarkerIcon(m.color ?? "#2563eb", true)
            : m.color
            ? createMarkerIcon(m.color, false)
            : undefined;
          return (
            <Marker
              key={m.id || i}
              position={pos}
              draggable={isSelected}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick?.(m.id ?? String(i)),
                dragend: (evt: any) => {
                  try {
                    const latlng = evt.target.getLatLng();
                    onMapClick?.(latlng.lat, latlng.lng);
                  } catch (e) {
                    // ignore
                  }
                },
              }}
            >
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
        {typeof radiusKm === "number" && (
          <Circle
            center={mapCenter}
            radius={radiusKm * 1000}
            pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 2 }}
          />
        )}
      </MapContainer>
      {/** flyTo support removed to satisfy react-leaflet typing; map interactions remain functional */}
    </div>
  );
}
