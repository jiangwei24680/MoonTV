'use client';

import { useEffect, useRef, useState } from 'react';

import { isAdminNoAds, isTV } from '@/lib/ads';
import { playImaPreroll } from '@/lib/ima-preroll.client';

/**
 * 开屏广告：打开站（或 App 冷启动）时先播一段全屏视频广告，再进主页。
 * - 与点播前贴片共用同一套 IMA 机制与 tag（未配真实 tag 时用 Google 官方测试 tag）
 * - 打开时没有用户手势，浏览器只允许静音自动播放，所以开屏广告静音播出
 * - 每会话只播一次（sessionStorage 标记）；失败/超时直接放行，不堵主页
 * - 管理员免广告、电视端直接跳过
 */

const SHOWN_KEY = 'kyrinmedia_appopen_shown';
const SKIP_AFTER_MS = 5000;
const TIMEOUT_MS = 30000;

export default function AppOpenAd() {
  const [visible, setVisible] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [countdown, setCountdown] = useState(SKIP_AFTER_MS / 1000);
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const closeAd = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      window.sessionStorage.setItem(SHOWN_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isAdminNoAds() || isTV()) return;
    try {
      if (window.sessionStorage.getItem(SHOWN_KEY)) return;
    } catch {
      /* sessionStorage 不可用时按每次打开播 */
    }
    setVisible(true);
    const countdownTimer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownTimer);
          setCanSkip(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    const timer = setTimeout(closeAd, TIMEOUT_MS);
    // 等容器渲染出来后再请求广告
    const raf = requestAnimationFrame(() => {
      playImaPreroll(containerRef.current, { mutedAutoplay: true }).then(
        () => closeAd(),
      );
    });
    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div className='fixed inset-0 z-[9999] flex flex-col bg-black'>
      <div className='flex items-center justify-between px-4 py-3 text-xs text-white/70'>
        <span>广告</span>
        <button
          type='button'
          disabled={!canSkip}
          onClick={closeAd}
          className='rounded-full bg-white/20 px-3 py-1 text-white disabled:opacity-50'
        >
          {canSkip ? '跳过广告' : `${countdown}s 后可跳过`}
        </button>
      </div>
      <div ref={containerRef} className='relative min-h-0 flex-1' />
    </div>
  );
}
