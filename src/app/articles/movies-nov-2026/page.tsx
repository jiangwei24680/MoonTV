import type { Metadata } from 'next';
import Link from 'next/link';

import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: '2026 年 11 月热门电影推荐 - kyrinMedia 影单',
  description:
    '2026 年 11 月站内热门电影推荐：可能的爱 8.6 分、八仙！8.2 分、多萝西与峡湾 8.0 分，按豆瓣评分整理的本月值得一看的电影。',
};

const MOVIES = [
  { title: '可能的爱', rate: '8.6', note: '本月站内评分最高的电影。' },
  { title: '八仙！', rate: '8.2', note: '评分 8 分以上，热度靠前。' },
  { title: '多萝西', rate: '8.0', note: '站内热门电影前列。' },
  { title: '峡湾', rate: '8.0', note: '站内热门电影前列。' },
  { title: '茫然女王', rate: '7.9', note: '接近 8 分，值得一看。' },
  { title: '突如其来', rate: '7.7', note: '评分稳定在 7 分档上游。' },
  { title: '懦夫', rate: '7.5', note: '口碑中等偏上。' },
  { title: '杯雪·一战成名', rate: '7.5', note: '口碑中等偏上。' },
  { title: '每时每刻', rate: '7.4', note: '7 分档，可按口味挑选。' },
  { title: '忘年之约', rate: '7.3', note: '7 分档，可按口味挑选。' },
];

export default function MoviesNov2026Page() {
  return (
    <ContentPage
      title='2026 年 11 月热门电影推荐'
      description='整理时间：2026 年 11 月 25 日。评分均为整理当日站内展示的豆瓣评分，片单会随热度变化，最新评分以影片详情页为准。'
    >
      <section>
        <p>
          11
          月站内热门电影整体口碑不错：20
          部热门电影里有 4 部评分在 8 分以上，7 分以上的占一半。想稳妥的优先看 8
          分档，想尝鲜的可以从 7 分档里按题材挑。
        </p>
      </section>
      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          本月片单（按评分排序）
        </h2>
        <ol className='list-decimal space-y-3 pl-5'>
          {MOVIES.map((movie) => (
            <li key={movie.title}>
              <Link
                href={`/search?query=${encodeURIComponent(movie.title)}`}
                className='font-semibold text-sky-600 dark:text-sky-400'
              >
                {movie.title}
              </Link>
              <span className='ml-2 text-amber-600 dark:text-amber-400'>
                豆瓣 {movie.rate} 分
              </span>
              <span className='text-gray-500 dark:text-gray-400'>
                ——{movie.note}
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <p>
          除了上面这 10
          部，站内热门栏目里还有《野兽之心》《逃出布迪秀》《生化危机：爆发夜》等 7
          分档作品，喜欢对应题材的也可以去首页热门电影栏目里翻一翻。看片前可以先点进详情页看简介与评分，再决定要不要花时间。
        </p>
      </section>
    </ContentPage>
  );
}
