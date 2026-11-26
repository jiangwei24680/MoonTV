'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getLanguage,
  setStoredLanguage,
  translateText,
  type Language,
} from '@/lib/i18n';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  /** 翻译界面文案：中文原文作 key，英文模式查字典，查不到回落中文。 */
  t: (zh: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'zh',
  // 默认上下文（Provider 外使用时）：不做任何事
  setLang: () => undefined,
  t: (zh) => zh,
});

/**
 * 语言 Provider：默认中文，选择存 localStorage。
 * 初始渲染固定中文（与服务端一致，避免水合 mismatch），挂载后再读本地选择。
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('zh');

  useEffect(() => {
    setLangState(getLanguage());
  }, []);

  const setLang = useCallback((next: Language) => {
    setStoredLanguage(next);
    setLangState(next);
  }, []);

  const t = useCallback(
    (zh: string, params?: Record<string, string | number>) =>
      translateText(zh, lang, params),
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
