"use client";

import type { RelayPointSearchResult } from "@/types/relayPoint";
import RelayPointCard from "./RelayPointCard";

interface RelayPointListProps {
  points: RelayPointSearchResult[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function RelayPointList({
  points,
  selectedId,
  onSelect,
}: RelayPointListProps) {
  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
        Aucun point relais trouvé dans ce rayon.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {points.map((point) => (
        <RelayPointCard
          key={point.id}
          point={point}
          selected={selectedId === point.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
