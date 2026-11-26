import { Metadata } from 'next';

import WarningContent from './WarningContent';

export const metadata: Metadata = {
  title: '安全警告 - kyrinMedia',
  description: '站点安全配置警告',
};

export default function WarningPage() {
  return <WarningContent />;
}
