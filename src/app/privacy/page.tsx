import type { Metadata } from 'next';

import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: '隐私政策 - kyrinMedia',
  description:
    'kyrinMedia 隐私政策：本站收集哪些数据、收藏与播放记录存在哪里、Cookie 与 Google AdSense 广告如何使用你的信息、如何联系我们删除数据。',
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
