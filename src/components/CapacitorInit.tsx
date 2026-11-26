'use client';

import { useEffect } from 'react';

import { showBanner } from '@/lib/ads';
import { checkAppUpdateOnLaunch } from '@/lib/appUpdater';

/**
 * Capacitor App 初始化：
 * - 禁止 WebView 延伸到状态栏下方（否则顶部会被通知栏盖住无法点击）
 * - 启动时自动检查一次 App 更新（有新版才弹提示，无更新/失败静默）
 * 只在 Capacitor 环境（App 内）执行，普通浏览器不受影响。
 */
export default function CapacitorInit() {
  useEffect(() => {
    const cap = (window as any).Capacitor;
    if (!cap) return;
    // 标记 App 环境，CSS 用 .capacitor-app 做安全区适配
    document.documentElement.classList.add('capacitor-app');
    // 底部 AdMob 横幅常驻：启动即展示，切页不隐藏（2026-11-26 用户要求一直都有）
    void showBanner();
    // 启动自动检查更新：等首页先出来再查，有新版才弹“发现新版本”提示
    const updateTimer = window.setTimeout(() => {
      void checkAppUpdateOnLaunch();
    }, 1500);
    const statusBar = cap?.Plugins?.StatusBar;
    if (!statusBar) return () => window.clearTimeout(updateTimer);
    try {
      statusBar.setOverlaysWebView({ overlay: false });
    } catch {
      /* 插件不可用时忽略 */
    }
    return () => window.clearTimeout(updateTimer);
  }, []);
  return null;
}
