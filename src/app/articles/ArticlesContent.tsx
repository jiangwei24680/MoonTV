'use client';

import Link from 'next/link';

import ContentPage from '@/components/ContentPage';
import { useLanguage } from '@/components/LanguageProvider';

const LISTS = [
  {
    href: '/articles/movies-nov-2026',
    title: '2026 年 11 月热门电影推荐',
    desc: '本周站内热度靠前的电影，豆瓣评分 8 分以上的有 4 部，最高 8.6 分。',
  },
  {
    href: '/articles/tv-nov-2026',
    title: '2026 年 11 月热门剧集推荐',
    desc: '在播与完结的热门剧集，最高 8.9 分，悬疑、历史、都市题材都有。',
  },
  {
    href: '/articles/variety-nov-2026',
    title: '2026 年 11 月热门综艺推荐',
    desc: '真人秀、脱口秀、纪录片与农场题材，最高 9.6 分，口碑综艺扎堆。',
  },
];

export default function ArticlesContent() {
  const { t } = useLanguage();
  return (
    <ContentPage
      title={t('影单推荐')}
      description={t(
        '不知道看什么的时候，就照着这份单子挑：每月按站内热度与豆瓣评分整理一次，只列当前能在站内找到的热门作品。'
      )}
    >
      <section>
        <p>
          {t(
            '榜单的评分是豆瓣评分，取自本站首页展示的数据；片单按热度排，评分会随时间变化，页面上标注的分数以整理当月为准，最新分数以影片详情页为准。点片名可以在站内直接搜索播放源。'
          )}
        </p>
      </section>
      <section className='space-y-4'>
        {LISTS.map((item) => (
          <div
            key={item.href}
            className='rounded-xl border border-gray-200 p-4 dark:border-gray-800'
          >
            <Link
              href={item.href}
              className='text-base font-semibold text-sky-600 dark:text-sky-400'
            >
              {t(item.title)}
            </Link>
            <p className='mt-1'>{t(item.desc)}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('怎么用这份单子')}
        </h2>
        <p>
          {t(
            '先看评分：8 分以上基本可以闭眼入，7 分以上值得一试，6 分以下建议先看简介再决定。想直接开看的，点进文章里的片名链接去站内搜索；想慢慢挑的，也可以去首页热门栏目里左右滑动，按自己的口味选。'
          )}
        </p>
      </section>
    </ContentPage>
  );
}
