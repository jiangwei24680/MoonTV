import { NextRequest, NextResponse } from 'next/server';

import { getEnglishTitle } from '@/lib/tmdb';

export const runtime = 'edge';

/**
 * GET /api/tmdb-title?title=流浪地球&year=2019&type=movie[&imdb=tt7605074]
 * 英文模式下给豆瓣影片/剧集查英文名。匹配不到、无 key、TMDB 出错时
 * 一律返回 matched:false，调用方回落显示中文原名。
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || '';
  const year = searchParams.get('year') || undefined;
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const imdb = searchParams.get('imdb') || undefined;

  if (!title.trim()) {
    return NextResponse.json({ ok: false, matched: false, reason: 'no_title' });
  }

  const result = await getEnglishTitle({ title, year, type, imdb });
  return NextResponse.json({
    ok: true,
    matched: result.matched,
    titleEn: result.matched ? result.titleEn ?? null : null,
    tmdbId: result.tmdbId ?? null,
    source: result.source ?? null,
    reason: result.matched ? null : result.reason ?? null,
  });
}
