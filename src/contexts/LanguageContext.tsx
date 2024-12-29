'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/translations';

type Language = 'en' | 'fr';
type TranslationType = typeof translations.en;

interface LanguageContextType {
  language: Language;
  t: TranslationType;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [t, setT] = useState<TranslationType>(translations.en);

  useEffect(() => {
    // Always use English
    setLanguage('en');
    setT(translations.en);
    localStorage.setItem('language', 'en');
  }, []);

  const handleSetLanguage = (lang: Language) => {
    // Only allow English
    if (lang === 'en') {
      setLanguage('en');
      setT(translations.en);
      localStorage.setItem('language', 'en');
    }
  };

  const toggleLanguage = () => {
    // Disabled language toggle
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage: handleSetLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
