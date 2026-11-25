import type { Metadata } from 'next';
import Link from 'next/link';

import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: '2026 年 11 月热门剧集推荐 - kyrinMedia 影单',
  description:
    '2026 年 11 月站内热门剧集推荐：我的有罪之人 8.9 分、伟大的长征 8.8 分、幻视任务 8.6 分，按豆瓣评分整理的本月值得追的剧集。',
};

const SHOWS = [
  { title: '我的有罪之人', rate: '8.9', note: '本月站内评分最高的剧集。' },
  { title: '伟大的长征', rate: '8.8', note: '评分接近 9 分，热度靠前。' },
  { title: '幻视任务', rate: '8.6', note: '8 分档上游。' },
  { title: '翠鸟谋杀案', rate: '8.3', note: '悬疑题材，评分 8 分以上。' },
  { title: '小城良方', rate: '8.1', note: '评分 8 分以上。' },
  { title: '今天是太阳雨', rate: '8.0', note: '评分 8 分，站内热门剧集前列。' },
  { title: 'Doctor X：白色黑手党时代', rate: '8.0', note: '评分 8 分，站内热门剧集前列。' },
  { title: '余红旧事', rate: '7.8', note: '接近 8 分，值得一追。' },
  { title: '蒸蒸日上', rate: '7.8', note: '接近 8 分，值得一追。' },
  { title: '兰香如故', rate: '7.6', note: '7 分档上游。' },
];

export default function TvNov2026Page() {
  return (
    <ContentPage
      title='2026 年 11 月热门剧集推荐'
      description='整理时间：2026 年 11 月 25 日。评分均为整理当日站内展示的豆瓣评分，片单会随热度变化，最新评分以剧集详情页为准。'
    >
      <section>
        <p>
          11
          月站内热门剧集口碑整体比电影还高：20
          部热门剧集里 7 部评分在 8
          分以上，最高 8.9
          分。悬疑、历史、都市题材都有，想追长剧的优先看 8 分档。
        </p>
      </section>
      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          本月片单（按评分排序）
        </h2>
        <ol className='list-decimal space-y-3 pl-5'>
          {SHOWS.map((show) => (
            <li key={show.title}>
              <Link
                href={`/search?query=${encodeURIComponent(show.title)}`}
                className='font-semibold text-sky-600 dark:text-sky-400'
              >
                {show.title}
              </Link>
              <span className='ml-2 text-amber-600 dark:text-amber-400'>
                豆瓣 {show.rate} 分
              </span>
              <span className='text-gray-500 dark:text-gray-400'>
                ——{show.note}
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <p>
          追剧建议先确认更新状态：在播的剧可以收藏起来慢慢追，站内会记录你看到第几集，下次打开直接提示继续播放；完结的剧可以一次刷完。除了上面这
          10 部，《两京十五日》《宝珠》《醉梦》等也在站内热门剧集栏目里，喜欢历史与古装题材的可以去翻翻。
        </p>
      </section>
    </ContentPage>
  );
}
