'use client';

import { useEffect, useRef, useState } from 'react';

import { getVersionBadgeState } from '@/lib/appUpdater';
import { CURRENT_VERSION } from '@/lib/version';

import AdminNoAdsModal from '@/components/AdminNoAds';

/**
 * 管理员免广告隐藏入口：版本号连点 5 下（2 秒内）弹出密码框。
 * 行为与登录页 VersionDisplay、下拉菜单、设置页底部版本号完全一致。
 * className 由调用处传入，只控制展示样式。
 */
export default function AdminVersionTap({
  className = '',
}: {
  className?: string;
}) {
  const [isAdminNoAdsOpen, setIsAdminNoAdsOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const adminTapCountRef = useRef(0);
  const adminTapLastRef = useRef(0);

  // 显示自己的版本号（app-version.json 的 versionName，如 1.0.18），
  // 不再显示构建时间戳；失败时回落到 CURRENT_VERSION。
  useEffect(() => {
    let cancelled = false;
    getVersionBadgeState()
      .then((badge) => {
        if (!cancelled && badge.versionName) setVersionName(badge.versionName);
      })
      .catch(() => {
        /* 忽略，回落显示 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVersionTap = () => {
    const now = Date.now();
    if (now - adminTapLastRef.current > 2000) {
      adminTapCountRef.current = 0;
    }
    adminTapLastRef.current = now;
    adminTapCountRef.current += 1;
    if (adminTapCountRef.current >= 5) {
      adminTapCountRef.current = 0;
      setIsAdminNoAdsOpen(true);
    }
  };

  return (
    <>
      <button onClick={handleVersionTap} className={className}>
        kyrinMedia v{versionName || CURRENT_VERSION}
      </button>
      {isAdminNoAdsOpen && (
        <AdminNoAdsModal onClose={() => setIsAdminNoAdsOpen(false)} />
      )}
    </>
  );
}
