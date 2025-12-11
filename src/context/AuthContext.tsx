// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { ADMIN_CREDENTIALS } from "../config/admin";

type AuthContextValue = {
  isAdmin: boolean;
  login: (username: string, password: string, humanCheck: boolean) => Promise<boolean>;
  finalizeLogin: () => void; // <-- to call after fake loader
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("vm_is_admin") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("vm_is_admin", isAdmin ? "1" : "0");
    } catch {}
  }, [isAdmin]);

  // validate credentials (but DO NOT set isAdmin here)
  const login = async (username: string, password: string, humanCheck: boolean) => {
    if (!humanCheck) return false;

    const ok =
      username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() && password === ADMIN_CREDENTIALS.password;

    return ok;
  };

  // finalize after loader complete
  const finalizeLogin = () => {
    setIsAdmin(true);
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, finalizeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
