"use client";
import React from "react";
export const withAuth = (
  Component: React.ComponentType,
  allowedRoles?: string[],
) => {
  return function ProtectedRoute(props: any) {
    return <Component {...props} />;
  };
};
