"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function CustomInput({ label, hint, id, className, ...props }: CustomInputProps) {
  const inputId = id ?? React.useId();

  return (
    <div className="space-y-1.5">
      {label ? (
        <Label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      ) : null}
      <Input id={inputId} className={className} {...props} />
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}
