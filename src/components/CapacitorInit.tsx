'use client';

import { useEffect } from 'react';

/**
 * Capacitor App 初始化：
 * - 禁止 WebView 延伸到状态栏下方（否则顶部会被通知栏盖住无法点击）
 * 只在 Capacitor 环境（App 内）执行，普通浏览器不受影响。
 */
export default function CapacitorInit() {
  useEffect(() => {
    const cap = (window as any).Capacitor;
    const statusBar = cap?.Plugins?.StatusBar;
    if (!statusBar) return;
    try {
      statusBar.setOverlaysWebView({ overlay: false });
    } catch {
      /* 插件不可用时忽略 */
    }
  }, []);
  return null;
}
