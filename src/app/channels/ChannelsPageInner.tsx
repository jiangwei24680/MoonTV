'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Artplayer from 'artplayer';

interface Channel {
  name: string;
  logo?: string;
  url: string;
}

const LS_KEY = 'live-channels';

export default function ChannelsPageInner() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  useEffect(() => {
    setLoading(true);
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      setChannels(JSON.parse(cached));
      setLoading(false);
      return;
    }
    fetch('/channels/playlist.m3u')
      .then((r) => r.text())
      .then((text) => {
        const parsed = parseM3u(text);
        setChannels(parsed);
        localStorage.setItem(LS_KEY, JSON.stringify(parsed));
      })
      .finally(() => setLoading(false));
  }, []);

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
    setCurrentChannel(newChannel);
  };

  const play = async (channel: Channel) => {
    let finalUrl = channel.url;

    // 自动解析真实 m3u8 地址
    if (channel.url.includes('.php') || channel.url.includes('.m3u8')) {
      try {
        const res = await fetch(channel.url);
        const text = await res.text();
        const match = text.match(/^(?!#).*\.m3u8.*$/m);
        if (match) {
          const baseUrl = new URL(channel.url);
          finalUrl = new URL(match[0], baseUrl).toString();
        }
      } catch (err) {
        console.error('解析 m3u8 失败:', err);
      }
    }

    setCurrentChannel({ ...channel, url: finalUrl });
  };

  useEffect(() => {
    if (!currentChannel) return;

    const art = new Artplayer({
      container: '#player',
      url: currentChannel.url,
      type: 'm3u8',
      isLive: true,
      autoplay: true,
      volume: 0.8,
      muted: false,
    });

    return () => {
      art.destroy();
    };
  }, [currentChannel]);

  return (
    <PageLayout activePath="/channels">
      <div className="px-4 sm:px-10 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">MoonTV 直播</h1>

        {/* 播放器区域 */}
        <div>
          <div id="player" className="w-full h-[400px] rounded-lg overflow-hidden border" />
          {currentChannel && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              正在播放：{currentChannel.name}
            </p>
          )}
        </div>

        {/* 频道选择下拉菜单 */}
        <div className="flex items-center gap-4">
          <label htmlFor="channelSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            选择频道：
          </label>
          <select
            id="channelSelect"
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              if (!isNaN(idx)) play(channels[idx]);
            }}
          >
            <option value="">请选择</option>
            {channels.map((ch, idx) => (
              <option key={idx} value={idx}>
                {ch.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setChannels([]);
              localStorage.removeItem(LS_KEY);
            }}
            className="text-sm text-red-500 hover:underline"
          >
            清空频道
          </button>
        </div>

        {/* 添加自定义频道 */}
        <div className="flex gap-2">
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
    </PageLayout>
  );
}
