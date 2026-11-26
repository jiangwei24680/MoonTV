/**
 * TMDB 英文标题匹配（服务端用）。
 * 用途：英文模式下，豆瓣来源的影片/剧集没有英文名时，用 TMDB 查英文名。
 * 匹配策略（按优先级）：
 *  1. IMDb ID → /3/find/{imdb_id}?external_source=imdb_id（豆瓣数据目前没有 imdb 字段，
 *     此分支先实现，接口已留 imdb 参数；等数据源补了 imdb 字段即可走这条路）
 *  2. 标题 + 年份 → /3/search/movie 或 /3/search/tv（language=en-US）
 * 置信度门槛：结果的 original_title（中文原名）或英文标题，归一化后与查询标题相等，
 * 且年份一致（双方都有年份时）。不满足则回落中文原名，不硬翻、不编造。
 * 缓存：进程内 Map（命中 30 天、未命中 7 天）+ 有 UPSTASH 环境变量时再写一份 Upstash，
 * 避免重复请求、省额度。
 * 需要环境变量：TMDB_READ_TOKEN（v4 Bearer，优先）或 TMDB_API_KEY（v3 key），
 * 配到 Cloudflare Pages 环境变量里；没有 key 时返回 { matched: false, reason: 'no_key' }。
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';

export type TmdbMediaType = 'movie' | 'tv';

export interface TmdbTitleResult {
  matched: boolean;
  /** 英文标题（matched 为 true 时才有） */
  titleEn?: string;
  tmdbId?: number;
  /** 'imdb' | 'search' | 'cache' */
  source?: 'imdb' | 'search' | 'cache';
  reason?: 'no_key' | 'no_match' | 'no_title';
}

interface CacheEntry {
  titleEn: string | null;
  tmdbId?: number;
  expiresAt: number;
}

const POSITIVE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 命中缓存 30 天
const NEGATIVE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 未命中缓存 7 天
const memoryCache = new Map<string, CacheEntry>();

function cacheKey(params: {
  imdb?: string;
  title: string;
  year?: string;
  type: TmdbMediaType;
}): string {
  if (params.imdb) return `tmdb:imdb:${params.imdb}`;
  return `tmdb:title:${params.type}:${normalizeTitle(params.title)}:${params.year || ''}`;
}

function getMemoryCache(key: string): CacheEntry | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry;
}

function setMemoryCache(key: string, entry: CacheEntry): void {
  memoryCache.set(key, entry);
  // 防止无界增长
  if (memoryCache.size > 5000) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
}

// ---------- Upstash 缓存（可选；没配环境变量时自动跳过） ----------

async function getUpstashClient() {
  const url = process.env.UPSTASH_URL;
  const token = process.env.UPSTASH_TOKEN;
  if (!url || !token) return null;
  try {
    const { Redis } = await import('@upstash/redis');
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

async function getUpstashCache(key: string): Promise<CacheEntry | null> {
  const client = await getUpstashClient();
  if (!client) return null;
  try {
    const raw = await client.get<string>(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() > entry.expiresAt) return null;
    return entry;
  } catch {
    return null;
  }
}

async function setUpstashCache(key: string, entry: CacheEntry): Promise<void> {
  const client = await getUpstashClient();
  if (!client) return;
  try {
    const ttlSeconds = Math.max(
      60,
      Math.floor((entry.expiresAt - Date.now()) / 1000)
    );
    await client.set(key, JSON.stringify(entry), { ex: ttlSeconds });
  } catch {
    // 缓存写失败不影响主流程
  }
}

// ---------- TMDB 调用 ----------

function getTmdbAuth(): { header?: string; apiKey?: string } | null {
  const token = process.env.TMDB_READ_TOKEN;
  if (token) return { header: `Bearer ${token}` };
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey) return { apiKey };
  return null;
}

async function tmdbFetch(
  path: string,
  params: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const auth = getTmdbAuth();
  if (!auth) throw new Error('no_key');
  const url = new URL(`${TMDB_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  if (auth.apiKey) url.searchParams.set('api_key', auth.apiKey);
  const res = await fetch(url.toString(), {
    headers: auth.header
      ? { Authorization: auth.header, accept: 'application/json' }
      : { accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`tmdb_${res.status}`);
  return res.json();
}

/** 归一化标题：去大小写、标点、空白，便于跨语言比对。 */
export function normalizeTitle(title: string): string {
  return title
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
}

function yearOf(dateStr?: string): string {
  return dateStr ? dateStr.slice(0, 4) : '';
}

interface SearchCandidate {
  titleEn: string;
  originalTitle: string;
  year: string;
  tmdbId: number;
}

/** 候选结果是否可信：原名或英文名归一化后与查询标题相等，且年份一致（双方都有年份时）。 */
function isConfidentMatch(
  candidate: SearchCandidate,
  queryTitle: string,
  queryYear?: string
): boolean {
  const q = normalizeTitle(queryTitle);
  if (!q) return false;
  const titleMatch =
    normalizeTitle(candidate.originalTitle) === q ||
    normalizeTitle(candidate.titleEn) === q;
  if (!titleMatch) return false;
  if (queryYear && candidate.year && queryYear !== candidate.year) return false;
  return true;
}

async function findByImdb(imdbId: string): Promise<TmdbTitleResult> {
  const data = await tmdbFetch(`/find/${encodeURIComponent(imdbId)}`, {
    external_source: 'imdb_id',
    language: 'en-US',
  });
  const movie = data?.movie_results?.[0];
  if (movie?.title) {
    return { matched: true, titleEn: movie.title, tmdbId: movie.id, source: 'imdb' };
  }
  const tv = data?.tv_results?.[0];
  if (tv?.name) {
    return { matched: true, titleEn: tv.name, tmdbId: tv.id, source: 'imdb' };
  }
  return { matched: false, reason: 'no_match' };
}

async function searchByTitle(
  title: string,
  year: string | undefined,
  type: TmdbMediaType
): Promise<TmdbTitleResult> {
  const isTv = type === 'tv';
  const params: Record<string, string> = {
    query: title,
    language: 'en-US',
    include_adult: 'false',
  };
  if (year) {
    if (isTv) params.first_air_date_year = year;
    else params.year = year;
  }
  const data = await tmdbFetch(isTv ? '/search/tv' : '/search/movie', params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = (data?.results ?? []) as any[];
  for (const r of results.slice(0, 5)) {
    const candidate: SearchCandidate = {
      titleEn: isTv ? r.name ?? '' : r.title ?? '',
      originalTitle: isTv ? r.original_name ?? '' : r.original_title ?? '',
      year: yearOf(isTv ? r.first_air_date : r.release_date),
      tmdbId: r.id,
    };
    if (!candidate.titleEn) continue;
    if (isConfidentMatch(candidate, title, year)) {
      return {
        matched: true,
        titleEn: candidate.titleEn,
        tmdbId: candidate.tmdbId,
        source: 'search',
      };
    }
  }
  return { matched: false, reason: 'no_match' };
}

/**
 * 查一部影片/剧集的英文标题。
 * 无 key 时返回 { matched: false, reason: 'no_key' }，调用方回落显示中文原名。
 */
export async function getEnglishTitle(params: {
  title: string;
  year?: string;
  type?: TmdbMediaType;
  imdb?: string;
}): Promise<TmdbTitleResult> {
  const { title, year } = params;
  const type: TmdbMediaType = params.type === 'tv' ? 'tv' : 'movie';
  if (!title?.trim()) return { matched: false, reason: 'no_title' };
  if (!getTmdbAuth()) return { matched: false, reason: 'no_key' };

  const key = cacheKey({ imdb: params.imdb, title, year, type });
  const mem = getMemoryCache(key);
  if (mem) {
    return mem.titleEn
      ? { matched: true, titleEn: mem.titleEn, tmdbId: mem.tmdbId, source: 'cache' }
      : { matched: false, reason: 'no_match' };
  }
  const remote = await getUpstashCache(key);
  if (remote) {
    setMemoryCache(key, remote);
    return remote.titleEn
      ? { matched: true, titleEn: remote.titleEn, tmdbId: remote.tmdbId, source: 'cache' }
      : { matched: false, reason: 'no_match' };
  }

  let result: TmdbTitleResult;
  try {
    result = params.imdb
      ? await findByImdb(params.imdb)
      : await searchByTitle(title, year, type);
  } catch {
    // TMDB 请求失败（网络/限流/ key 无效）：不缓存，直接回落中文原名
    return { matched: false, reason: 'no_match' };
  }

  const entry: CacheEntry = {
    titleEn: result.matched ? result.titleEn ?? null : null,
    tmdbId: result.tmdbId,
    expiresAt: Date.now() + (result.matched ? POSITIVE_TTL_MS : NEGATIVE_TTL_MS),
  };
  setMemoryCache(key, entry);
  await setUpstashCache(key, entry);
  return result;
}
