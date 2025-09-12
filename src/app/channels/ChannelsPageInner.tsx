'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import VideoCard from '@/components/VideoCard';
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

    // 自动解析真实 m3u8 地址
    if (channel.url.includes('.php') || channel.url.includes('.m3u8')) {
      try {
        const res = await fetch(channel.url);
        const text = await res.text();
        const match = text.match(/^(?!#).*\.m3u8.*$/m);
        if (match) {
          const baseUrl = new URL(channel.url);
          finalUrl = new URL(match[0], baseUrl).toString();
          console.log('解析后的真实地址:', finalUrl);
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
      <div className="px-4 sm:px-10 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">直播频道</h1>

        {/* 播放器区域 */}
        {currentChannel && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              正在播放：{currentChannel.name}
            </h3>
            <div id="player" className="w-full h-[500px] rounded-lg overflow-hidden border" />
          </div>
        )}

        {/* 主体布局：频道列表 + 添加频道 */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* 播放列表 */}
          <div className="w-full lg:w-[300px] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">频道列表 ({channels.length})</h2>
              <button onClick={clearAll} className="text-sm text-red-500 hover:underline">
                清空全部
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {channels.map((ch, idx) => (
                <div key={idx} className="relative cursor-pointer group" onClick={() => play(ch)}>
                  <VideoCard
                    from="search"
                    title={ch.name}
                    poster={
                      ch.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(ch.name)}&size=200`
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
          </div>

          {/* 添加频道 */}
          <div className="w-full lg:flex-1 mt-6 lg:mt-0">
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
                添加
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
