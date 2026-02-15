/**
 * Language Management Hook
 * Provides language switching and translation utilities
 */

import { useCallback, useEffect, useState } from 'react';

type SupportedLanguage = 'en' | 'zh-TW' | 'es';

const LANGUAGE_STORAGE_KEY = 'nexus-language';
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

interface UseLanguageReturn {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isLoading: boolean;
  supportedLanguages: Array<{ code: SupportedLanguage; name: string }>;
}

/**
 * Hook to manage language preferences
 * Persists language choice to localStorage
 */
export function useLanguage(): UseLanguageReturn {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    setIsLoading(false);
  }, []);

  // Handle language change
  const setLanguage = useCallback((lang: SupportedLanguage) => {
    if (isSupportedLanguage(lang)) {
      setLanguageState(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }, []);

  const supportedLanguages = [
    { code: 'en' as SupportedLanguage, name: 'English' },
    { code: 'zh-TW' as SupportedLanguage, name: '繁體中文' },
    { code: 'es' as SupportedLanguage, name: 'Español' },
  ];

  return {
    language,
    setLanguage,
    isLoading,
    supportedLanguages,
  };
}

/**
 * Check if language is supported
 */
function isSupportedLanguage(lang: unknown): lang is SupportedLanguage {
  return typeof lang === 'string' && ['en', 'zh-TW', 'es'].includes(lang);
}

/**
 * Get browser language preference
 */
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language.toLowerCase();

  // Map browser language to supported languages
  if (browserLang.startsWith('zh')) {
    return 'zh-TW';
  }
  if (browserLang.startsWith('es')) {
    return 'es';
  }

  return 'en';
}

/**
 * Get language display name
 */
export function getLanguageName(lang: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    en: 'English',
    'zh-TW': '繁體中文',
    es: 'Español',
  };
  return names[lang];
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(lang: SupportedLanguage): string {
  const flags: Record<SupportedLanguage, string> = {
    en: '🇺🇸',
    'zh-TW': '🇹🇼',
    es: '🇪🇸',
  };
  return flags[lang];
}
