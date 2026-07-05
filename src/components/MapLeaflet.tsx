"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  color?: "green" | "red" | "orange" | "blue";
  popupContent?: React.ReactNode;
}

export interface MapLeafletProps {
  center: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  onMarkerClick?: (markerId: string) => void;
  flyToMarkerId?: string | null;
}

const markerColors: Record<NonNullable<MapMarker["color"]>, string> = {
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f97316",
  blue: "#3b82f6",
};

function createIcon(color: MapMarker["color"] = "orange") {
  const hex = markerColors[color];
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="background:${hex};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function FlyToMarker({
  markers,
  flyToMarkerId,
}: {
  markers: MapMarker[];
  flyToMarkerId?: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!flyToMarkerId) return;
    const m = markers.find((x) => x.id === flyToMarkerId);
    if (m) map.flyTo([m.latitude, m.longitude], 15, { duration: 0.8 });
  }, [flyToMarkerId, markers, map]);
  return null;
}

export default function MapLeaflet({
  center,
  zoom = 13,
  markers = [],
  className = "h-80 w-full rounded-xl",
  onMarkerClick,
  flyToMarkerId,
}: MapLeafletProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
      ._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className={className}>
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToMarker markers={markers} flyToMarkerId={flyToMarkerId} />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.latitude, m.longitude]}
            icon={createIcon(m.color)}
            eventHandlers={{
              click: () => onMarkerClick?.(m.id),
            }}
          >
            {(m.label || m.popupContent) && (
              <Popup>
                {m.popupContent ?? <span className="text-sm font-medium">{m.label}</span>}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
