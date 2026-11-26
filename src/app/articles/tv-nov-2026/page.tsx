import type { Metadata } from 'next';

import TvNov2026Content from './TvNov2026Content';

export const metadata: Metadata = {
  title: '2026 年 11 月热门剧集推荐 - kyrinMedia 影单',
  description:
    '2026 年 11 月站内热门剧集推荐：我的有罪之人 8.9 分、伟大的长征 8.8 分、幻视任务 8.6 分，按豆瓣评分整理的本月值得追的剧集。',
};

export default function TvNov2026Page() {
  return <TvNov2026Content />;
}
