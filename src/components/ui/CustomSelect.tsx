"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option { value: string; label: string; }
interface CustomSelectProps {
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: Option[];
  className?: string;
}

export function CustomSelect({ label, value, onChange, options = [], className }: CustomSelectProps) {
  const currentValue = value ?? options[0]?.value ?? "";

  return (
    <div className="space-y-1.5">
      {label ? <Label className="text-sm font-medium text-gray-700">{label}</Label> : null}
      <select
        value={currentValue}
        onChange={onChange}
        className={className ?? "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
