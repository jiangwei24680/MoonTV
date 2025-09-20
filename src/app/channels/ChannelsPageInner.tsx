'use client';
import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import ArtPlayer from '@/components/ArtPlayer';

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
    const newChannel: Channel = { name: '自定义频道', url: inputUrl.trim() };
    const updated = [...channels, newChannel];
    setChannels(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setInputUrl('');
    setCurrentChannel(newChannel);
  };

  const clearAll = () => {
    setChannels([]);
    localStorage.removeItem(LS_KEY);
  };

  const play = async (channel: Channel) => {
    let finalUrl = channel.url;

    if (channel.url.includes('.php')) {
      try {
        const res = await fetch(channel.url);
        const text = await res.text();
        const match = text.match(/^(?!#).*\.m3u8.*$/m);
        if (match) {
          const baseUrl = new URL(channel.url);
          finalUrl = new URL(match[0], baseUrl).toString();
        }
      } catch (err) {
        console.error('解析 .php 失败:', err);
      }
    }

    setCurrentChannel({ ...channel, url: finalUrl });
  };

  return (
    <PageLayout activePath="/channels">
      <div className="px-4 sm:px-10 py-6 h-[calc(100vh-64px)] flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">MoonTV 直播</h1>
        <div className="flex-1 flex flex-col sm:flex-row gap-4 overflow-hidden">
          {/* 左侧频道列表 */}
          <div className="w-full sm:w-[220px] flex flex-col border rounded-lg bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center px-2 py-2 border-b">
              <h2 className="text-sm font-semibold">频道列表</h2>
              <button onClick={clearAll} className="text-xs text-red-500 hover:underline">清空</button>
            </div>
            <ul className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
              {channels.map((ch, idx) => (
                <li
                  key={idx}
                  className={`cursor-pointer px-2 py-1 rounded flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    currentChannel?.url === ch.url ? 'bg-green-100 dark:bg-green-800' : ''
                  }`}
                  onClick={() => play(ch)}
                >
                  {ch.logo && (
                    <img src={ch.logo} alt="logo" className="w-5 h-5 object-contain rounded" />
                  )}
                  <span className="text-sm">{ch.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 播放器 + 添加频道 */}
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 border rounded-lg overflow-hidden h-full min-h-[300px]">
              {currentChannel ? (
                <ArtPlayer
                  url={currentChannel.url}
                  title={currentChannel.name}
                  isLive={true}
                  blockAd={true}
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
  );
}
