"use client";

import { createContext, useState, ReactNode } from 'react';

type LanguageContextType = {
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
};

export const availableLanguages = ["English", "Spanish", "French", "German", "Hindi", "Japanese", "Chinese"];

export const LanguageContext = createContext<LanguageContextType>({
  targetLanguage: 'English',
  setTargetLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [targetLanguage, setTargetLanguage] = useState('English');

  return (
    <LanguageContext.Provider value={{ targetLanguage, setTargetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
