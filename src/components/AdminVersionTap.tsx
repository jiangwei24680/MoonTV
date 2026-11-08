'use client';

import { useRef, useState } from 'react';

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
  const adminTapCountRef = useRef(0);
  const adminTapLastRef = useRef(0);

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
        kyrinMedia v{CURRENT_VERSION}
      </button>
      {isAdminNoAdsOpen && (
        <AdminNoAdsModal onClose={() => setIsAdminNoAdsOpen(false)} />
      )}
    </>
  );
}
