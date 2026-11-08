/* eslint-disable no-console */
'use client';

/**
 * 本地弹幕存储：按 source + id + 集数存 localStorage，不依赖任何服务端。
 *
 * 注意：公开弹幕源暂不接入——dandanplay API 在当前网络环境实测返回 403，
 * 无法验证可用性，不编造接口。后续如有可验证的免费弹幕源再接。
 */

export interface LocalDanmu {
  text: string;
  time?: number;
  color?: string;
  mode?: 0 | 1 | 2;
}

const DANMUKU_KEY_PREFIX = 'moontv_danmuku_';
const MAX_DANMUKU_PER_EPISODE = 200;

export function getDanmukuKey(
  source: string,
  id: string,
  episodeIndex: number
): string {
  return `${DANMUKU_KEY_PREFIX}${source}+${id}+${episodeIndex}`;
}

export function loadDanmuku(
  source: string,
  id: string,
  episodeIndex: number
): LocalDanmu[] {
  if (typeof window === 'undefined' || !source || !id) return [];
  try {
    const raw = localStorage.getItem(
      getDanmukuKey(source, id, episodeIndex)
    );
    if (!raw) return [];
    const list = JSON.parse(raw) as LocalDanmu[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveDanmuku(
  source: string,
  id: string,
  episodeIndex: number,
  danmu: LocalDanmu
): void {
  if (typeof window === 'undefined' || !source || !id) return;
  if (!danmu.text || !danmu.text.trim()) return;
  try {
    const list = loadDanmuku(source, id, episodeIndex);
    list.push({
      text: danmu.text.trim(),
      time: danmu.time ?? 0,
      color: danmu.color,
      mode: danmu.mode ?? 0,
    });
    const trimmed = list.slice(-MAX_DANMUKU_PER_EPISODE);
    localStorage.setItem(
      getDanmukuKey(source, id, episodeIndex),
      JSON.stringify(trimmed)
    );
  } catch {
    // 存储失败时静默忽略，不影响播放
  }
}
