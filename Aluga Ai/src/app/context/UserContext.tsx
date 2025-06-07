"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = new Date().getTime();
      if (now < parsed.expiry) {
        setUser(parsed.user);
      } else {
        logout(); // agora funciona corretamente
      }
    }
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
    }, 60000); // Verifica a cada 1 minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
