import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, type Language } from "@/lib/translations";

export type UserRole = "user" | "admin" | "department";
export type { Language } from "@/lib/translations";

interface User {
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (name: string, password: string) => { success: boolean; role: UserRole };
  signup: (name: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple in-memory user store (frontend only)
const userStore: { name: string; password: string; role: UserRole }[] = [
  { name: "admin", password: "admin123", role: "admin" },
  { name: "user", password: "user123", role: "user" },
  { name: "officer", password: "officer123", role: "department" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("en");

  const login = useCallback((name: string, password: string) => {
    const found = userStore.find(
      (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
    );
    if (found) {
      setUser({ name: found.name, role: found.role });
      return { success: true, role: found.role };
    }
    return { success: false, role: "user" as UserRole };
  }, []);

  const signup = useCallback((name: string, password: string, role: UserRole) => {
    const exists = userStore.find(
      (u) => u.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return false;
    userStore.push({ name, password, role });
    setUser({ name, role });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, language, setLanguage, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useTranslation() {
  const { language } = useAuth();
  return (key: string) => translations[language]?.[key] || translations.en[key] || key;
}
