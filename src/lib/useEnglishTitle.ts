'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from '@/components/LanguageProvider';

/**
 * 英文模式下，把中文标题换成 TMDB 匹配到的英文名。
 * 客户端缓存：同一标题只请求一次；匹配不到/无 key/请求失败都回落中文原名。
 * 注意：只换显示文字，不动跳转、收藏、搜索用的中文原名。
 */

// 进程内缓存：key -> 英文名（null 表示已查过、匹配不到）
const resultCache = new Map<string, string | null>();
const pendingCache = new Map<string, Promise<string | null>>();

function cacheKey(
  title: string,
  year: string | undefined,
  type: string,
  imdb?: string
): string {
  return `${type}|${title}|${year || ''}|${imdb || ''}`;
}

async function fetchEnglishTitle(
  title: string,
  year: string | undefined,
  type: 'movie' | 'tv',
  imdb?: string
): Promise<string | null> {
  const key = cacheKey(title, year, type, imdb);
  if (resultCache.has(key)) return resultCache.get(key) ?? null;
  const pending = pendingCache.get(key);
  if (pending) return pending;
  const p = (async () => {
    try {
      const params = new URLSearchParams({ title, type });
      if (year) params.set('year', year);
      if (imdb) params.set('imdb', imdb);
      const res = await fetch(`/api/tmdb-title?${params.toString()}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data?.matched && data?.titleEn ? (data.titleEn as string) : null;
    } catch {
      return null;
    }
  })();
  pendingCache.set(key, p);
  const result = await p;
  pendingCache.delete(key);
  resultCache.set(key, result);
  return result;
}

/**
 * 返回当前语言下应显示的标题：英文模式且 TMDB 匹配到英文名时返回英文名，
 * 否则返回中文原名。
 */
export function useEnglishTitle(
  zhTitle: string,
  year?: string,
  type: 'movie' | 'tv' = 'movie',
  imdb?: string
): string {
  const { lang } = useLanguage();
  const [enTitle, setEnTitle] = useState<string | null>(null);

  useEffect(() => {
    if (lang !== 'en' || !zhTitle) {
      setEnTitle(null);
      return;
    }
    let cancelled = false;
    fetchEnglishTitle(zhTitle, year, type, imdb).then((result) => {
      if (!cancelled) setEnTitle(result);
    });
    return () => {
      cancelled = true;
    };
  }, [lang, zhTitle, year, type, imdb]);

  return lang === 'en' && enTitle ? enTitle : zhTitle;
}
