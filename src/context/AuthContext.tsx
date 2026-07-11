"use client";
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
  const [loading, setLoading] = useState(false);

  const login = (userData: User) => setUser(userData);
  const logout = () => {setUser(null); window.location.href = "/";};
  const refreshUser = async () => {
    // If we have a user in state, just keep them to prevent infinite loading
    if (user) {
      setLoading(false);
    }
  };

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
