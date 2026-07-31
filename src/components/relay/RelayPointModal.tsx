"use client";
import React, { useState, useEffect } from "react";
import { X, Map as MapIcon, List, Building } from "lucide-react";
import { RelayPoint } from "@/types/relayPoint";
import { relayPointService } from "@/services/relayPointService";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
});

interface RelayPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (rp: RelayPoint) => void;
  excludeRpName?: string;
  parcelWeight?: number; // Used to filter RPs
}

export default function RelayPointModal({
  isOpen,
  onClose,
  onSelect,
  excludeRpName,
  parcelWeight = 0,
}: RelayPointModalProps) {
  const [view, setView] = useState<"list" | "map">("list");
  const [points, setPoints] = useState<RelayPoint[]>([]);

  useEffect(() => {
    if (isOpen) {
      relayPointService.getAllRelayPoints().then((data) => {
        // Filter out the excluded RP and ensure capacity > currentLoad
        const available = data.filter(
          (p) => p.name !== excludeRpName && p.currentLoad < p.capacity,
        );
        setPoints(available);
      });
    }
  }, [isOpen, excludeRpName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Sélectionner un Point Relais
            </h2>
            <p className="text-xs text-gray-500">
              Filtré pour un colis de {parcelWeight} kg
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1 text-sm rounded-md ${view === "list" ? "bg-orange-100 text-orange-700" : "text-gray-500"}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setView("map")}
                className={`px-3 py-1 text-sm rounded-md ${view === "map" ? "bg-orange-100 text-orange-700" : "text-gray-500"}`}
              >
                <MapIcon size={16} />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto bg-gray-50/50">
          {view === "list" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {points.map((rp) => (
                <div
                  key={rp.id}
                  className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 transition shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Building className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{rp.name}</h4>
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {rp.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                      Dispo
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    📍 {rp.address}, {rp.lieuDit}
                  </p>
                  <p className="text-sm text-gray-600">
                    🌍 {rp.city}, {rp.country}
                  </p>
                  <button
                    onClick={() => onSelect(rp)}
                    className="mt-4 w-full py-2 bg-orange-100 text-orange-700 font-bold rounded-lg hover:bg-orange-200"
                  >
                    Choisir ce relais
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[500px]">
              <MapLeaflet
                center={[3.848, 11.502]}
                zoom={13}
                markers={points.map((p) => ({
                  id: p.id,
                  latitude: p.latitude,
                  longitude: p.longitude,
                  color: "orange",
                  label: p.name,
                  popupContent: (
                    <div className="text-center p-1">
                      <p className="font-bold mb-1">{p.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{p.address}</p>
                      <button
                        onClick={() => onSelect(p)}
                        className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold w-full hover:bg-orange-600"
                      >
                        Choisir
                      </button>
                    </div>
                  ),
                }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
