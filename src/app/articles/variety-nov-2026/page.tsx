import type { Metadata } from 'next';
import Link from 'next/link';

import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: '2026 年 11 月热门综艺推荐 - kyrinMedia 影单',
  description:
    '2026 年 11 月站内热门综艺推荐：克拉克森的农场 第五季 9.6 分、孤单又灿烂的神：鬼怪十周年特辑 9.0 分，按豆瓣评分整理的本月值得看的综艺。',
};

const SHOWS = [
  { title: '克拉克森的农场 第五季', rate: '9.6', note: '本月站内评分最高的综艺。' },
  { title: '孤单又灿烂的神：鬼怪十周年特辑', rate: '9.0', note: '评分 9 分，情怀向特辑。' },
  { title: '街头餐厅斗士', rate: '8.8', note: '美食题材，评分 8 分以上。' },
  { title: '后会友期', rate: '8.7', note: '评分 8 分以上。' },
  { title: '扯淡电影史', rate: '8.6', note: '影迷向，评分 8 分以上。' },
  { title: '魔鬼的计谋：死亡重启', rate: '8.5', note: '推理竞技题材。' },
  { title: '交换生活的我们', rate: '8.2', note: '评分 8 分以上。' },
  { title: '思想验证区域 第二季', rate: '8.2', note: '评分 8 分以上。' },
  { title: '现在就出发 第四季', rate: '8.0', note: '旅行真人秀，评分 8 分。' },
  { title: '奇案84的奇趣民宿 第二季', rate: '7.9', note: '接近 8 分，轻松下饭。' },
];

export default function VarietyNov2026Page() {
  return (
    <ContentPage
      title='2026 年 11 月热门综艺推荐'
      description='整理时间：2026 年 11 月 25 日。评分均为整理当日站内展示的豆瓣评分，片单会随热度变化，最新评分以节目详情页为准。'
    >
      <section>
        <p>
          11
          月站内热门综艺口碑是三个栏目里最高的：20
          部热门综艺里 9 部评分在 8 分以上，最高 9.6
          分。农场、美食、推理、旅行题材都有，下饭综艺扎堆，想放松的直接按这个单子看。
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
          综艺适合碎片时间看：站内会记录播放进度，看到一半退出，下次打开同一节目会提示继续播放。除了上面这
          10 部，《花儿与少年 第八季》《奔跑吧·大湾区篇》《脱口秀和Ta的朋友们
          第三季》等也在站内热门综艺栏目里，喜欢旅行与脱口秀的可以去翻翻。
        </p>
      </section>
    </ContentPage>
  );
}
