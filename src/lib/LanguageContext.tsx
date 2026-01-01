"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/translations/en.json";
import sv from "@/translations/sv.json";

type Language = "en" | "sv";
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = { en, sv };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem("aioli-language") as Language;
    if (saved && (saved === "en" || saved === "sv")) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("aioli-language", lang);
  };

  // Prevent hydration mismatch by showing default language until mounted
  const t = translations[mounted ? language : "en"];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
