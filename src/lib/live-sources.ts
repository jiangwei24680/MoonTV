/** 直播源配置：国家选择器 + 美国 FAST 专区（第一期全球化） */

export interface FastSource {
  /** 专区内显示来源，如 Pluto TV */
  label: string
  url: string
}

export interface CountryConfig {
  /** iptv-org 国家代码（英国是 uk，不是 gb） */
  code: string
  name: string
  flag: string
  /** 该国家的 iptv-org m3u 源 */
  sources: string[]
  /** 是否同时拉本地 /channels/playlist.m3u（仅中国） */
  localPlaylist?: boolean
  /** 是否同时拉 fanmingming itv.m3u（仅中国） */
  fanmingming?: boolean
  /** 美国 FAST 专区源（仅美国） */
  fast?: FastSource[]
}

const IPTV_ORG = 'https://iptv-org.github.io/iptv/countries'
const FAST_BASE =
  'https://raw.githubusercontent.com/BuddyChewChew/app-m3u-generator/main/playlists'

/** fanmingming 央视卫视源（华数/移动 OTT：47 央视 + 53 卫视，国内稳定） */
export const FMM_SOURCE =
  'https://raw.githubusercontent.com/fanmingming/live/main/tv/m3u/itv.m3u'

/** 美国 FAST 专区的分组名（解析 FAST 源时强制覆盖 group-title） */
export const FAST_GROUP = '美国 FAST 专区'

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'cn',
    name: '中国',
    flag: '🇨🇳',
    sources: [`${IPTV_ORG}/cn.m3u`],
    localPlaylist: true,
    fanmingming: true,
  },
  {
    code: 'us',
    name: '美国',
    flag: '🇺🇸',
    sources: [`${IPTV_ORG}/us.m3u`],
    fast: [
      { label: 'Pluto TV', url: `${FAST_BASE}/plutotv_us.m3u` },
      { label: 'Samsung TV Plus', url: `${FAST_BASE}/samsungtvplus_us.m3u` },
      { label: 'Plex TV', url: `${FAST_BASE}/plex_us.m3u` },
    ],
  },
  { code: 'uk', name: '英国', flag: '🇬🇧', sources: [`${IPTV_ORG}/uk.m3u`] },
  { code: 'de', name: '德国', flag: '🇩🇪', sources: [`${IPTV_ORG}/de.m3u`] },
  { code: 'fr', name: '法国', flag: '🇫🇷', sources: [`${IPTV_ORG}/fr.m3u`] },
  { code: 'es', name: '西班牙', flag: '🇪🇸', sources: [`${IPTV_ORG}/es.m3u`] },
  { code: 'it', name: '意大利', flag: '🇮🇹', sources: [`${IPTV_ORG}/it.m3u`] },
  { code: 'in', name: '印度', flag: '🇮🇳', sources: [`${IPTV_ORG}/in.m3u`] },
  { code: 'br', name: '巴西', flag: '🇧🇷', sources: [`${IPTV_ORG}/br.m3u`] },
  { code: 'ca', name: '加拿大', flag: '🇨🇦', sources: [`${IPTV_ORG}/ca.m3u`] },
  { code: 'au', name: '澳大利亚', flag: '🇦🇺', sources: [`${IPTV_ORG}/au.m3u`] },
]

export const DEFAULT_COUNTRY = 'cn'
export const COUNTRY_LS_KEY = 'live-country'

/** 频道缓存版本：v4 起按国家分 key */
export const CACHE_VERSION = 4
export function cacheKey(code: string): string {
  return `live-channels-v${CACHE_VERSION}-${code}`
}

/** 分组固定顺序；FAST 专区排在 General 之后、其他之前 */
export const GROUP_ORDER = [
  'News',
  'Sports',
  'Movies',
  'Entertainment',
  'Music',
  'Kids',
  'Documentary',
  'General',
]

export function sortGroupNames(names: string[]): string[] {
  const rank = (g: string): number => {
    if (g === FAST_GROUP) return GROUP_ORDER.length
    const i = GROUP_ORDER.indexOf(g)
    return i === -1 ? GROUP_ORDER.length + 1 : i
  }
  return [...names].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}

export function countryByCode(code: string): CountryConfig {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0]
}
