'use client';

import { useState } from 'react';

import {
  isAdminNoAds,
  setAdminNoAds,
  verifyAdminPassword,
} from '@/lib/ads';

/**
 * 管理员免广告入口弹窗（设置页版本号连点 5 下打开）。
 * 输入正确口令后切换免广告状态（开/关），状态存本机 localStorage，App 更新后保留。
 * 口令只做本地比对，不发服务器、不记日志。
 */
export default function AdminNoAdsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [enabled, setEnabled] = useState(() => isAdminNoAds());

  const submit = () => {
    if (!verifyAdminPassword(password)) {
      setError('密码错误');
      setPassword('');
      return;
    }
    const next = !isAdminNoAds();
    setAdminNoAds(next);
    setEnabled(next);
    setError('');
    setPassword('');
    setNotice(next ? '免广告已开启' : '免广告已关闭');
  };

  return (
    <div className='fixed inset-0 z-[1002] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900'>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
          管理员免广告
        </h3>
        <p className='mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
          当前状态：{enabled ? '免广告已开启' : '免广告已关闭'}
        </p>
        {notice ? (
          <>
            <p className='mt-3 rounded-md bg-sky-50 p-3 text-sm text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'>
              {notice}
            </p>
            <button
              onClick={onClose}
              className='mt-5 w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-sky-700'
            >
              完成
            </button>
          </>
        ) : (
          <>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              placeholder='请输入管理员口令'
              autoFocus
              className='mt-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            />
            {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
            <button
              onClick={submit}
              disabled={!password}
              className='mt-5 w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              确认
            </button>
            <button
              onClick={onClose}
              className='mt-2 w-full rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
            >
              取消
            </button>
          </>
        )}
      </div>
    </div>
  );
}
