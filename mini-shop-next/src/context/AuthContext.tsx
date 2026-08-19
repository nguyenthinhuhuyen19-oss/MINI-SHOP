"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, role?: "admin" | "customer") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "mini_shop_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) {
          setCurrentUser(parsed.user);
        }
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, []);

  const login = (email: string, role: "admin" | "customer" = "customer") => {
    const isTargetAdmin = email.toLowerCase().includes("admin") || role === "admin";
    const user: User = {
      email,
      name: isTargetAdmin ? "Quản Trị Viên" : "Khách Hàng Thân Thiết",
      role: isTargetAdmin ? "admin" : "customer",
    };
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token: "mock_token_" + Date.now() }));
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error("Failed to remove user from localStorage", e);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
