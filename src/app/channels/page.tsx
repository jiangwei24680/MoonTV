/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, DragEvent, useCallback, useState } from 'react';

import PageLayout from '@/components/PageLayout';
import VideoCard from '@/components/VideoCard';

interface Channel {
  name: string;
  logo?: string;
  url: string;
}

export default function ChannelsPage() {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState('');

  /* ---------- 解析 m3u ---------- */
  const parseM3u = (text: string): Channel[] => {
    const lines = text.trim().split(/\r?\n/);
    const result: Channel[] = [];

    let current: Partial<Channel> = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#EXTINF:')) {
        // 解析 name 与 logo
        const nameMatch = trimmed.match(/tvg-name="([^"]*)"/i);
        const logoMatch = trimmed.match(/tvg-logo="([^"]*)"/i);
        const commaName = trimmed.split(',').pop()?.trim(); // fallback
        current.name = nameMatch?.[1] || commaName || '未知频道';
        current.logo = logoMatch?.[1];
      } else if (trimmed && !trimmed.startsWith('#')) {
        current.url = trimmed;
        if (current.name && current.url) {
          result.push(current as Channel);
        }
        current = {};
      }
    }
    return result;
  };

  /* ---------- 文件上传 ---------- */
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseM3u(reader.result as string);
        setChannels(parsed);
        setError('');
      } catch {
        setError('解析失败，请检查 m3u 格式');
      }
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onPaste = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      try {
        const parsed = parseM3u(text);
        setChannels(parsed);
        setError('');
      } catch {
        setError('剪贴板内容不是合法 m3u');
      }
    });
  }, []);

  /* ---------- 跳转播放 ---------- */
  const play = (channel: Channel) => {
    const params = new URLSearchParams({
      url: channel.url,
      title: channel.name,
      type: 'live', // 告诉播放器这是直播
    });
    router.push(`/play?${params.toString()}`);
  };

  return (
    <PageLayout activePath="/channels">
      <div className="px-4 sm:px-10 py-8 space-y-8">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            直播频道
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            上传或粘贴 .m3u 文件，即可浏览并播放直播源
          </p>
        </div>

        {/* 上传区域 */}
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center space-y-3 hover:border-green-500 transition-colors"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <label className="block">
            <input
              type="file"
              accept=".m3u,.m3u8"
              onChange={onFileChange}
              className="hidden"
            />
            <span className="text-green-600 font-medium cursor-pointer hover:underline">
              点击上传 .m3u
            </span>
          </label>
          <button
            onClick={onPaste}
            className="text-sm text-gray-500 dark:text-gray-400 underline"
          >
            或粘贴剪贴板内容
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* 频道网格 */}
        {channels.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              频道列表 ({channels.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {channels.map((ch) => (
                <div key={ch.url} onClick={() => play(ch)}>
                  <VideoCard
                    from="channels"
                    title={ch.name}
                    poster={
                      ch.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        ch.name
                      )}&size=200`
                    }
                    rate={0} // 直播无评分
                    year=""
                    type=""
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* 空状态 */}
        {!channels.length && (
          <div className="text-center text-gray-500 py-10">
            暂无频道，请上传或粘贴 m3u 文件
          </div>
        )}
      </div>
    </PageLayout>
  );
}
