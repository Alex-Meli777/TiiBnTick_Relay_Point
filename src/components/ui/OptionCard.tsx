"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function OptionCard({
  label,
  description,
  selected,
  onClick,
  icon,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition",
        selected
          ? "border-orange-500 bg-orange-50"
          : "border-gray-200 bg-white hover:border-orange-200"
      )}
    >
      {icon && <div className="mt-0.5 text-orange-500">{icon}</div>}
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {selected && (
        <Check className="h-5 w-5 shrink-0 text-orange-500" aria-hidden />
      )}
    </button>
  );
}
