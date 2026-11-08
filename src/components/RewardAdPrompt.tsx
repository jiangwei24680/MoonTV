'use client';

import { useEffect, useRef, useState } from 'react';

import { setRewardPromptHandler } from '@/lib/ads';

/**
 * 点播前贴片合规前置页（APK 用，全局挂载一次）。
 * 在广告弹出前说明“观看一段广告后开始播放本集”，并给明确的取消选项；
 * 用户点取消就不弹广告、不播放。网页端不会调起（ads 层在非原生环境直接放行）。
 */
export default function RewardAdPrompt() {
  const [visible, setVisible] = useState(false);
  const resolverRef = useRef<((accepted: boolean) => void) | null>(null);

  useEffect(() => {
    setRewardPromptHandler(
      () =>
        new Promise<boolean>((resolve) => {
          resolverRef.current = resolve;
          setVisible(true);
        }),
    );
    return () => {
      setRewardPromptHandler(null);
    };
  }, []);

  const choose = (accepted: boolean) => {
    setVisible(false);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.(accepted);
  };

  if (!visible) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900'>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
          观看广告后开始播放
        </h3>
        <p className='mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
          观看一段广告后开始播放本集。
        </p>
        <p className='mt-2 text-xs text-gray-400 dark:text-gray-500'>
          广告由 Google AdMob 提供，取消后不会播放。
        </p>
        <button
          onClick={() => choose(true)}
          className='mt-5 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-green-700'
        >
          观看广告
        </button>
        <button
          onClick={() => choose(false)}
          className='mt-2 w-full rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
        >
          取消
        </button>
      </div>
    </div>
  );
}
