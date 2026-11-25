import Link from 'next/link';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

import PageLayout from '@/components/PageLayout';

/**
 * 站内内容页（关于 / 隐私 / 指南 / 影单）共用的版式：
 * 顶部导航 + 居中正文 + 底部内容页互链，方便读者与搜索引擎找到站内原创内容。
 */
export default function ContentPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className='px-4 sm:px-10 py-6 sm:py-10'>
          <div className='mx-auto max-w-3xl'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100'>
              {title}
            </h1>
          </div>
        </div>
      }
    >
      <PageLayout>
      <div className='px-4 sm:px-10 py-6 sm:py-10'>
        <article className='mx-auto max-w-3xl'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100'>
            {title}
          </h1>
          {description ? (
            <p className='mt-3 text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {description}
            </p>
          ) : null}
          <div className='mt-6 space-y-5 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300'>
            {children}
          </div>
          <footer className='mt-10 border-t border-gray-200 pt-6 text-sm dark:border-gray-800'>
            <p className='mb-3 font-semibold text-gray-800 dark:text-gray-200'>
              站内内容
            </p>
            <nav className='flex flex-wrap gap-x-5 gap-y-2 text-sky-600 dark:text-sky-400'>
              <Link href='/about'>关于 kyrinMedia</Link>
              <Link href='/guide'>使用指南</Link>
              <Link href='/articles'>影单推荐</Link>
              <Link href='/privacy'>隐私政策</Link>
              <Link href='/'>返回首页</Link>
            </nav>
          </footer>
        </article>
      </div>
      </PageLayout>
    </Suspense>
  );
}
