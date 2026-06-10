"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
  name: string | null;
  company_id: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  apiFetch: (path: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:8000`
    : "http://127.0.0.1:8000");

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const savedToken = localStorage.getItem("copilot_token");
    const savedUser = localStorage.getItem("copilot_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Authentication failed");
    }

    const data = await res.json();
    localStorage.setItem("copilot_token", data.access_token);
    localStorage.setItem("copilot_user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);

    if (data.user.role === "internal_evaluator") {
      router.push("/portal/evaluator");
    } else {
      router.push("/portal/dashboard");
    }
  };

  const register = async (regData: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Registration failed");
    }

    const data = await res.json();
    localStorage.setItem("copilot_token", data.access_token);
    localStorage.setItem("copilot_user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);

    if (data.user.role === "internal_evaluator") {
      router.push("/portal/evaluator");
    } else {
      router.push("/portal/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("copilot_token");
    localStorage.removeItem("copilot_user");
    setToken(null);
    setUser(null);
    router.push("/portal");
  };

  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    const activeToken = token || localStorage.getItem("copilot_token");
    
    if (activeToken) {
      headers.set("Authorization", `Bearer ${activeToken}`);
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "API Request failed");
    }

    return res.json();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
