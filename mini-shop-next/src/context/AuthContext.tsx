"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const formatUser = (supabaseUser: SupabaseUser): User => {
    const email = supabaseUser.email || "";
    const name =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      email.split("@")[0] ||
      "Khách Hàng";
    const role =
      supabaseUser.user_metadata?.role ||
      (email.toLowerCase().includes("admin") ? "admin" : "customer");

    return {
      id: supabaseUser.id,
      email,
      name,
      role,
    };
  };

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(formatUser(session.user));
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error getting Supabase session:", err);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(formatUser(session.user));
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setCurrentUser(formatUser(data.user));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Đã xảy ra lỗi khi đăng nhập" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: name.trim(),
            role: email.toLowerCase().includes("admin") ? "admin" : "customer",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setCurrentUser(formatUser(data.user));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Đã xảy ra lỗi khi đăng ký" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
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
