"use client";

interface OptionCardProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function OptionCard({ label, selected = false, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${selected ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"}`}
    >
      {label}
    </button>
  );
}
