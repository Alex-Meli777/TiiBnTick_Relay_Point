"use client";
import React from "react";
export const AddressAutocomplete = ({
  onSelect,
  defaultValue,
  city,
  placeholder,
}: any) => {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={(e) =>
        onSelect({
          street: e.target.value,
          city: city || "Douala",
          country: "Cameroun",
          latitude: 4,
          longitude: 9,
        })
      }
      className="w-full px-4 py-2 border-2 rounded-lg"
    />
  );
};
