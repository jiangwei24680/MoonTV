'use client';

import { useEffect, useRef, useState } from 'react';

import { ADMIN_NO_ADS_EVENT, isAdminNoAds } from '@/lib/ads';

/**
 * AdSense 展示广告位（网站用）
 * - 发布商 ID 和广告位 ID 从 window.RUNTIME_CONFIG 读（构建时由环境变量
 *   NEXT_PUBLIC_ADSENSE_CLIENT / NEXT_PUBLIC_ADSENSE_SLOT 注入，见 src/app/layout.tsx）
 * - 任意一个未配置时静默不渲染、不报错
 * - 管理员免广告标记（moontv_admin_no_ads）存在时不渲染广告位
 */

type AdsenseConfig = { client: string; slot: string };

function getAdsenseConfig(): AdsenseConfig | null {
  if (typeof window === 'undefined') return null;
  const cfg = (
    window as unknown as {
      RUNTIME_CONFIG?: { ADSENSE_CLIENT?: string; ADSENSE_SLOT?: string };
    }
  ).RUNTIME_CONFIG;
  const client = cfg?.ADSENSE_CLIENT?.trim() || '';
  const slot = cfg?.ADSENSE_SLOT?.trim() || '';
  if (!client || !slot) return null;
  return { client, slot };
}

export default function AdBanner() {
  const [config, setConfig] = useState<AdsenseConfig | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => {
      if (isAdminNoAds()) {
        setConfig(null);
        return;
      }
      setConfig(getAdsenseConfig());
    };
    sync();
    const onAdminChange = () => {
      pushed.current = false;
      sync();
    };
    window.addEventListener(ADMIN_NO_ADS_EVENT, onAdminChange);
    return () =>
      window.removeEventListener(ADMIN_NO_ADS_EVENT, onAdminChange);
  }, []);

  useEffect(() => {
    if (!config || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* AdSense 未加载或被拦截时忽略 */
    }
  }, [config]);

  if (!config) return null;

  return (
    <div className='my-4 flex justify-center'>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={config.client}
        data-ad-slot={config.slot}
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </div>
  );
}
