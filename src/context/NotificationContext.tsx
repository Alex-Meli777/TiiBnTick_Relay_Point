"use client";
import React, { createContext, useContext, ReactNode } from "react";

type NotificationOptions = {
  title?: string;
  message?: string;
  type?: "info" | "success" | "error";
};
const NotificationContext = createContext<any>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const showNotification = (opts: NotificationOptions) =>
    console.log("Notif:", opts);
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    return {
      showNotification: (opts: NotificationOptions) => console.log(opts),
    };
  return ctx;
};
