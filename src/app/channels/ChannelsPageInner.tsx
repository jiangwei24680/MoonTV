'use client'
import { useEffect, useMemo, useState } from 'react'
import PageLayout from '@/components/PageLayout'
import ArtPlayer from '@/components/ArtPlayer'
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  COUNTRY_LS_KEY,
  FAST_GROUP,
  FMM_SOURCE,
  cacheKey,
  countryByCode,
  sortGroupNames,
} from '@/lib/live-sources'

interface Channel {
  name: string
  logo?: string
  url: string
  group?: string
}

/** m3u8 中转 Worker（moontvphp）：.php 这类浏览器直连会被 CORS 拦截的地址走它代理 */
const M3U8_PROXY = 'https://moontvphp.hookjune.workers.dev'

export default function ChannelsPageInner() {
  const [channelsByGroup, setChannelsByGroup] = useState<Record<string, Channel[]>>({})
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const [search, setSearch] = useState('')
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState(DEFAULT_COUNTRY)
  const [countryReady, setCountryReady] = useState(false)

  // 恢复上次选的国家（挂载时读一次，避免 SSR 水合不一致）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COUNTRY_LS_KEY)
      if (saved && COUNTRIES.some((c) => c.code === saved)) setCountry(saved)
    } catch {
      /* 忽略 */
    }
    setCountryReady(true)
  }, [])

  useEffect(() => {
    if (!countryReady) return
    let cancelled = false
    const cfg = countryByCode(country)
    const key = cacheKey(country)
    setLoading(true)

    // 先读本国缓存秒开，再后台刷新
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        setGrouped(JSON.parse(cached) as Channel[])
        setLoading(false)
      }
    } catch {
      /* 缓存损坏则重新拉取 */
    }

    // 各源各自独立请求，互不拖累；FAST 源先解析，去重时优先归入 FAST 专区
    const jobs: Promise<{ text: string; groupOverride?: string }>[] = []
    if (cfg.fast) {
      for (const f of cfg.fast) {
        jobs.push(
          fetch(f.url).then((r) => {
            if (!r.ok) throw new Error(`fast ${f.label} ${r.status}`)
            return r.text().then((text) => ({ text, groupOverride: FAST_GROUP }))
          }),
        )
      }
    }
    if (cfg.localPlaylist) {
      jobs.push(
        fetch('/channels/playlist.m3u').then((r) => {
          if (!r.ok) throw new Error(`local ${r.status}`)
          return r.text().then((text) => ({ text }))
        }),
      )
    }
    for (const url of cfg.sources) {
      jobs.push(
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(`remote ${r.status}`)
          return r.text().then((text) => ({ text }))
        }),
      )
    }
    if (cfg.fanmingming) {
      jobs.push(
        fetch(FMM_SOURCE).then((r) => {
          if (!r.ok) throw new Error(`fmm ${r.status}`)
          return r.text().then((text) => ({ text }))
        }),
      )
    }

    Promise.allSettled(jobs).then((results) => {
      if (cancelled) return
      const parsed: Channel[] = []
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          parsed.push(...parseM3u(res.value.text, res.value.groupOverride))
        } else {
          console.warn('频道源加载失败:', res.reason)
        }
      })

      if (parsed.length > 0) {
        // 按播放地址去重（各源常有重叠）
        const seen = new Set<string>()
        const deduped = parsed.filter((ch) => {
          if (seen.has(ch.url)) return false
          seen.add(ch.url)
          return true
        })
        setGrouped(deduped)
        try {
          localStorage.setItem(key, JSON.stringify(deduped))
        } catch {
          /* 配额满则跳过缓存 */
        }
        setErrorMessage(null)
      } else if (!localStorage.getItem(key)) {
        setErrorMessage('频道列表加载失败，请检查网络后重试')
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [country, countryReady])

  const setGrouped = (channels: Channel[]) => {
    const grouped: Record<string, Channel[]> = {}
    for (const ch of channels) {
      const group = ch.group || '未分类'
      if (!grouped[group]) grouped[group] = []
      grouped[group].push(ch)
    }
    // 分组按固定顺序排（News → Sports → … → General → FAST 专区 → 其他）
    const ordered: Record<string, Channel[]> = {}
    for (const g of sortGroupNames(Object.keys(grouped))) ordered[g] = grouped[g]
    setChannelsByGroup(ordered)
    setSelectedGroup((prev) => (prev && ordered[prev] ? prev : Object.keys(ordered)[0] || null))
  }

  const parseM3u = (text: string, groupOverride?: string): Channel[] => {
    const lines = text.trim().split(/\r?\n/)
    const result: Channel[] = []
    let current: Partial<Channel> = {}

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('#EXTINF:')) {
        const nameMatch = trimmed.match(/tvg-name="([^"]*)"/i)
        const logoMatch = trimmed.match(/tvg-logo="([^"]*)"/i)
        const groupMatch = trimmed.match(/group-title="([^"]*)"/i)
        const commaName = trimmed.split(',').pop()?.trim()

        current.name = nameMatch?.[1] || commaName || '自定义频道'
        current.logo = logoMatch?.[1]
        current.group = groupOverride || groupMatch?.[1]
      } else if (trimmed && !trimmed.startsWith('#')) {
        current.url = trimmed
        if (current.name && current.url) result.push(current as Channel)
        current = {}
      }
    }

    return result
  }

  // 有搜索词时跨全部分组搜索，否则只看当前分组
  const visibleChannels = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q) {
      return Object.values(channelsByGroup)
        .flat()
        .filter((ch) => ch.name.toLowerCase().includes(q))
    }
    return channelsByGroup[selectedGroup || ''] || []
  }, [search, channelsByGroup, selectedGroup])

  const totalChannels = useMemo(
    () => Object.values(channelsByGroup).reduce((n, list) => n + list.length, 0),
    [channelsByGroup],
  )

  const switchCountry = (code: string) => {
    if (code === country) return
    try {
      localStorage.setItem(COUNTRY_LS_KEY, code)
    } catch {
      /* 忽略 */
    }
    setCountry(code)
    setSearch('')
    setCurrentChannel(null)
    setSelectedGroup(null)
  }

  const play = (channel: Channel) => {
    setErrorMessage(null)
    let finalUrl = channel.url
    // .php 地址走 Worker 代理：浏览器直连会被 CORS 拦截
    if (/\.php(\?|#|$)/i.test(channel.url)) {
      finalUrl = `${M3U8_PROXY}/?url=${encodeURIComponent(channel.url)}`
    }
    setCurrentChannel({ ...channel, url: finalUrl })
  }

  const addChannel = () => {
    if (!inputUrl.trim()) return
    const newChannel: Channel = { name: '自定义频道', url: inputUrl.trim(), group: '未分类' }
    setGrouped([...Object.values(channelsByGroup).flat(), newChannel])
    setInputUrl('')
    play(newChannel)
  }

  const clearAll = () => {
    setChannelsByGroup({})
    setSelectedGroup(null)
    setCurrentChannel(null)
    localStorage.removeItem(cacheKey(country))
    setErrorMessage(null)
  }

  return (
    <PageLayout activePath="/channels">
      {/* 手机：头部48px + 底部导航56px；桌面：顶部64px */}
      <div className="px-4 sm:px-10 py-4 sm:py-6 flex flex-col h-[calc(100dvh-104px)] sm:h-[calc(100vh-64px)]">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
          kyrinMedia 直播
        </h1>
        {/* 国家选择器：国旗 + 国家名，横向滑动，默认中国，选择记在 localStorage */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-2 flex-none">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => switchCountry(c.code)}
              className={`flex-none px-3 py-1.5 text-sm rounded-full border ${
                country === c.code
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
              }`}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
        {totalChannels > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex-none">
            {countryByCode(country).name} · 共 {totalChannels} 个频道
            {country === 'us' ? ' · 美国 FAST 专区需海外网络' : ''}
          </p>
        )}
        <div className="flex-1 min-h-0 flex flex-col sm:flex-row gap-3 sm:gap-4 overflow-hidden">
          {/* 播放器：手机在上（固定16:9），桌面在右 */}
          <div className="order-1 sm:order-2 flex-none sm:flex-1 flex flex-col min-h-0 sm:h-full sm:overflow-hidden">
            <div className="w-full aspect-video sm:aspect-auto sm:flex-1 sm:min-h-[300px] border rounded-lg overflow-hidden bg-black">
              {currentChannel ? (
                <ArtPlayer url={currentChannel.url} isLive={true} type="m3u8" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">
                  请选择一个频道开始播放
                </div>
              )}
            </div>
            {currentChannel && (
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 px-1 truncate">
                正在播放：{currentChannel.name}
              </p>
            )}
            {errorMessage && (
              <p className="mt-1.5 text-sm text-red-500 px-1">{errorMessage}</p>
            )}
            <div className="flex gap-2 mt-2">
              <input
                type="url"
                placeholder="输入直播 .m3u8 或 .php 地址"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={addChannel}
                className="flex-none px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                添加
              </button>
            </div>
          </div>

          {/* 频道列表：手机在下（内部滚动），桌面在左 */}
          <div className="order-2 sm:order-1 w-full sm:w-[260px] sm:flex-none flex-1 min-h-0 flex flex-col border rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="px-2 py-2 border-b space-y-2">
              <input
                type="search"
                placeholder="搜索频道…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm px-2 py-1 rounded border dark:bg-gray-800 dark:text-white"
              />
              <div className="flex justify-between items-center">
                <select
                  value={selectedGroup || ''}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="text-sm px-2 py-1 rounded border max-w-[160px]"
                >
                  {Object.keys(channelsByGroup).map((group) => (
                    <option key={group} value={group}>
                      {group} ({channelsByGroup[group].length})
                    </option>
                  ))}
                </select>
                <button onClick={clearAll} className="text-xs text-red-500 hover:underline">
                  清空
                </button>
              </div>
            </div>
            <ul className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-2">
              {loading && visibleChannels.length === 0 && (
                <li className="text-sm text-gray-500 text-center py-8">频道加载中…</li>
              )}
              {visibleChannels.map((ch, idx) => (
                <li
                  key={`${ch.url}-${idx}`}
                  className={`cursor-pointer px-2 py-1 rounded flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    currentChannel?.url === ch.url ? 'bg-green-100 dark:bg-green-800' : ''
                  }`}
                  onClick={() => play(ch)}
                  title={search.trim() ? ch.group : undefined}
                >
                  {ch.logo && (
                    <img src={ch.logo} alt="logo" className="w-5 h-5 object-contain rounded" />
                  )}
                  <span className="text-sm truncate">{ch.name}</span>
                </li>
              ))}
              {!loading && visibleChannels.length === 0 && (
                <li className="text-sm text-gray-500 text-center py-8">
                  {search.trim() ? '没有找到匹配的频道' : '暂无频道'}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
