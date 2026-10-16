'use client'
import { useEffect, useMemo, useState } from 'react'
import PageLayout from '@/components/PageLayout'
import ArtPlayer from '@/components/ArtPlayer'

interface Channel {
  name: string
  logo?: string
  url: string
  group?: string
}

/** m3u8 中转 Worker（moontvphp）：.php 这类浏览器直连会被 CORS 拦截的地址走它代理 */
const M3U8_PROXY = 'https://moontvphp.hookjune.workers.dev'
/** 频道缓存版本：playlist.m3u 有大改时把数字 +1，用户下次打开即刷新 */
const CACHE_VERSION = 2
const LS_KEY = `live-channels-v${CACHE_VERSION}`
/** 中国频道源（iptv-org 按国家分类，远小于全库） */
const CN_SOURCE = 'https://iptv-org.github.io/iptv/countries/cn.m3u'

export default function ChannelsPageInner() {
  const [channelsByGroup, setChannelsByGroup] = useState<Record<string, Channel[]>>({})
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const [search, setSearch] = useState('')
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // 先读缓存秒开，再后台刷新
    try {
      const cached = localStorage.getItem(LS_KEY)
      if (cached) {
        setGrouped(JSON.parse(cached) as Channel[])
        setLoading(false)
      }
    } catch {
      /* 缓存损坏则重新拉取 */
    }

    // 本地与远程各自独立请求，互不拖累
    Promise.allSettled([
      fetch('/channels/playlist.m3u').then((r) => {
        if (!r.ok) throw new Error(`local ${r.status}`)
        return r.text()
      }),
      fetch(CN_SOURCE).then((r) => {
        if (!r.ok) throw new Error(`remote ${r.status}`)
        return r.text()
      }),
    ]).then(([localRes, remoteRes]) => {
      if (cancelled) return
      const texts: string[] = []
      if (localRes.status === 'fulfilled') {
        texts.push(localRes.value)
      } else {
        console.warn('本地 playlist 加载失败:', localRes.reason)
      }
      if (remoteRes.status === 'fulfilled') {
        texts.push(remoteRes.value)
      } else {
        console.warn('远程频道源加载失败:', remoteRes.reason)
      }

      if (texts.length > 0) {
        const parsed = parseM3u(texts.join('\n'))
        // 按播放地址去重（本地与远程常有重叠）
        const seen = new Set<string>()
        const deduped = parsed.filter((ch) => {
          if (seen.has(ch.url)) return false
          seen.add(ch.url)
          return true
        })
        setGrouped(deduped)
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(deduped))
        } catch {
          /* 配额满则跳过缓存 */
        }
        setErrorMessage(null)
      } else if (!localStorage.getItem(LS_KEY)) {
        setErrorMessage('频道列表加载失败，请检查网络后重试')
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const setGrouped = (channels: Channel[]) => {
    const grouped: Record<string, Channel[]> = {}
    for (const ch of channels) {
      const group = ch.group || '未分类'
      if (!grouped[group]) grouped[group] = []
      grouped[group].push(ch)
    }
    setChannelsByGroup(grouped)
    setSelectedGroup((prev) => (prev && grouped[prev] ? prev : Object.keys(grouped)[0] || null))
  }

  const parseM3u = (text: string): Channel[] => {
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
        current.group = groupMatch?.[1]
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
    localStorage.removeItem(LS_KEY)
    setErrorMessage(null)
  }

  return (
    <PageLayout activePath="/channels">
      <div className="px-4 sm:px-10 py-6 h-[calc(100vh-64px)] flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">MoonTV 直播</h1>
        <div className="flex-1 flex flex-col sm:flex-row gap-4 overflow-hidden">
          {/* 左侧频道列表 */}
          <div className="w-full sm:w-[260px] flex flex-col border rounded-lg bg-gray-50 dark:bg-gray-900">
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
            <ul className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
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

          {/* 播放器 + 添加频道 */}
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden h-full">
            <div className="flex-1 border rounded-lg overflow-hidden h-full min-h-[300px]">
              {currentChannel ? (
                <ArtPlayer
                  url={currentChannel.url}
                  title={currentChannel.name}
                  isLive={true}
                  type="m3u8"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-white text-sm">
                  请选择一个频道开始播放
                </div>
              )}
              {currentChannel && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 px-2">
                  正在播放：{currentChannel.name}
                </p>
              )}
              {errorMessage && <p className="mt-2 text-sm text-red-500 px-2">{errorMessage}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="输入直播 .m3u8 或 .php 地址"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={addChannel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                添加频道
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
