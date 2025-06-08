// src/app/context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
};

type Store = {
  id: number;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  store: Store | null;
  setUser: (user: User | null) => void;
  setStore: (store: Store | null) => void;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    setStore(null);
    router.push("/login");
  };

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = new Date().getTime();
      if (now < parsed.expiry) {
        if (parsed.user) setUser(parsed.user);
        if (parsed.store) setStore(parsed.store);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const { expiry } = JSON.parse(stored);
        if (new Date().getTime() > expiry) {
          logout();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ user, store, setUser, setStore, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
