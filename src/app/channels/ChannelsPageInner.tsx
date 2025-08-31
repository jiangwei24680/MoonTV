/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import PageLayout from '@/components/PageLayout';
import VideoCard from '@/components/VideoCard';

interface Channel {
  name: string;
  logo?: string;
  url: string;
}

// 本地缓存 key
const LS_KEY = 'live-channels';

export default function ChannelsPageInner() {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);

  /* ---------- 读取初始列表 ---------- */
  useEffect(() => {
    setLoading(true);
    // 1. 读本地缓存
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      setChannels(JSON.parse(cached));
      setLoading(false);
      return;
    }
    // 2. 读静态 playlist.m3u
    fetch('/channels/playlist.m3u')
      .then((r) => r.text())
      .then((text) => {
        const parsed = parseM3u(text);
        setChannels(parsed);
        localStorage.setItem(LS_KEY, JSON.stringify(parsed));
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- 解析 m3u ---------- */
  const parseM3u = (text: string): Channel[] => {
    const lines = text.trim().split(/\r?\n/);
    const result: Channel[] = [];
    let current: Partial<Channel> = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#EXTINF:')) {
        const nameMatch = trimmed.match(/tvg-name="([^"]*)"/i);
        const logoMatch = trimmed.match(/tvg-logo="([^"]*)"/i);
        const commaName = trimmed.split(',').pop()?.trim();
        current.name = nameMatch?.[1] || commaName || '自定义频道';
        current.logo = logoMatch?.[1];
      } else if (trimmed && !trimmed.startsWith('#')) {
        current.url = trimmed;
        if (current.name && current.url) result.push(current as Channel);
        current = {};
      }
    }
    return result;
  };

  /* ---------- 手动追加 ---------- */
  const addChannel = () => {
    if (!inputUrl.trim()) return;
    const newChannel: Channel = {
      name: '自定义频道',
      url: inputUrl.trim(),
    };
    const updated = [...channels, newChannel];
    setChannels(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setInputUrl('');
  };

  /* ---------- 删除 ---------- */
  const removeChannel = (idx: number) => {
    const updated = channels.filter((_, i) => i !== idx);
    setChannels(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setChannels([]);
    localStorage.removeItem(LS_KEY);
  };

  /* ---------- 前端播放逻辑 ---------- */
  const play = (channel: Channel) => {
    router.push(
      `/play?url=${encodeURIComponent(
        channel.url
      )}&title=${channel.name}&type=live`
    );
  };

  return (
    <PageLayout activePath="/channels">
      <div className="px-4 sm:px-10 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
          直播频道
        </h1>

        {/* 追加 URL */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="输入直播 .m3u8 地址"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={addChannel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            添加
          </button>
        </div>

        {/* 列表 */}
        {loading ? (
          <p className="text-center text-gray-500">加载中…</p>
        ) : channels.length ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                频道列表 ({channels.length})
              </h2>
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:underline"
              >
                清空全部
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {channels.map((ch, idx) => (
                <div
                  key={idx}
                  className="relative cursor-pointer group"
                  onClick={() => play(ch)}
                >
                  <VideoCard
                    from="search"
                    title={ch.name}
                    poster={
                      ch.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        ch.name
                      )}&size=200`
                    }
                    rate="0"
                    year=""
                    type=""
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChannel(idx);
                    }}
                    className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            暂无频道，请在下方输入直播地址
          </p>
        )}
      </div>
    </PageLayout>
  );
}
