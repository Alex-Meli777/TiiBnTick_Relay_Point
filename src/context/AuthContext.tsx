"use client";
import { routeModule } from "next/dist/build/templates/app-page";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

export interface User {
  token: string;
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  userType: "ADMIN" | "CLIENT" | "LIVREUR";
  isActive: boolean;
  clientId?: string;
  deliveryPersonId?: string;
  rating?: number;
  totalDeliveries?: number;
  nationalId?: string;
  password?: string;
  memberSince?: string;
  street?: string;
  city?: string;
  commercialName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: User) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tiibntick_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("tiibntick_user");
    }
    window.location.href = "/";
  };

  const refreshUser = async () => {
    if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem("tiibntick_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
          window.localStorage.removeItem("tiibntick_user");
        }
      }
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      login: () => {},
      logout: () => {},
      refreshUser: async () => {},
    } as AuthContextType;
  }
  return context;
};
