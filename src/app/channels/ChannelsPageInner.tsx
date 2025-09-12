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
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      setChannels(JSON.parse(cached));
      return;
    }
    fetch('/channels/playlist.m3u')
      .then((r) => r.text())
      .then((text) => {
        const parsed = parseM3u(text);
        setChannels(parsed);
        localStorage.setItem(LS_KEY, JSON.stringify(parsed));
      });
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

  const removeChannel = (idx: number) => {
    const updated = channels.filter((_, i) => i !== idx);
    setChannels(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setChannels([]);
    localStorage.removeItem(LS_KEY);
  };

  const play = async (channel: Channel) => {
    let finalUrl = channel.url;

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
      <div className="px-4 sm:px-10 py-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">MoonTV 直播</h1>

        <div className="flex gap-4">
          {/* 左侧频道列表 */}
          <div className="w-[220px] h-[400px] overflow-y-auto border rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold">频道列表</h2>
              <button onClick={clearAll} className="text-xs text-red-500 hover:underline">清空</button>
            </div>
            <ul className="space-y-2">
              {channels.map((ch, idx) => (
                <li
                  key={idx}
                  className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    currentChannel?.url === ch.url ? 'bg-green-100 dark:bg-green-800' : ''
                  }`}
                  onClick={() => play(ch)}
                >
                  {ch.name}
                </li>
              ))}
            </ul>
          </div>

          {/* 播放器 + 添加频道 */}
          <div className="flex-1 space-y-4">
            <div>
              <div id="player" className="w-full h-[400px] rounded-lg overflow-hidden border" />
              {currentChannel && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  正在播放：{currentChannel.name}
                </p>
              )}
            </div>

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
        </div>
      </div>
    </PageLayout>
  );
}
