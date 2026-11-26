import type { Metadata } from 'next';

import ArticlesContent from './ArticlesContent';

export const metadata: Metadata = {
  title: '影单推荐 - kyrinMedia',
  description:
    'kyrinMedia 每月影单：按豆瓣评分整理的站内热门电影、剧集、综艺推荐，照着评分挑片不踩雷。',
};

export default function ArticlesPage() {
  return <ArticlesContent />;
}
