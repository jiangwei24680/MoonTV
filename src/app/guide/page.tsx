import type { Metadata } from 'next';
import GuideContent from './GuideContent';

export const metadata: Metadata = {
  title: '使用指南 - kyrinMedia',
  description:
    'kyrinMedia 使用指南：怎么找片、怎么收藏和继续观看、直播频道怎么选、换源失败怎么办、常见问题一次说清。',
};

export default function GuidePage() {
  return <GuideContent />;
}
