import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: '关于 kyrinMedia - 免费影视聚合站',
  description:
    'kyrinMedia 是一个免费的影视聚合站点：热门电影、剧集、综艺一站搜索，支持收藏、继续观看与全球电视直播。了解本站是什么、怎么用、内容从哪里来。',
};

export default function AboutPage() {
  return <AboutContent />;
}
