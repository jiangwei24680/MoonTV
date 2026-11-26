import type { Metadata } from 'next';

import MoviesNov2026Content from './MoviesNov2026Content';

export const metadata: Metadata = {
  title: '2026 年 11 月热门电影推荐 - kyrinMedia 影单',
  description:
    '2026 年 11 月站内热门电影推荐：可能的爱 8.6 分、八仙！8.2 分、多萝西与峡湾 8.0 分，按豆瓣评分整理的本月值得一看的电影。',
};

export default function MoviesNov2026Page() {
  return <MoviesNov2026Content />;
}
