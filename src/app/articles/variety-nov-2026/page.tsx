import type { Metadata } from 'next';

import VarietyNov2026Content from './VarietyNov2026Content';

export const metadata: Metadata = {
  title: '2026 年 11 月热门综艺推荐 - kyrinMedia 影单',
  description:
    '2026 年 11 月站内热门综艺推荐：克拉克森的农场 第五季 9.6 分、孤单又灿烂的神：鬼怪十周年特辑 9.0 分，按豆瓣评分整理的本月值得看的综艺。',
};

export default function VarietyNov2026Page() {
  return <VarietyNov2026Content />;
}
