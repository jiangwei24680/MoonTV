'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import LiveUploadPage from '@/components/LiveUploadPage';
import LiveChannelList from '@/components/LiveChannelList';

export default function LivePage() {
  const [m3uContent, setM3uContent] = useState('');

  return (
    <PageLayout activePath="/live">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📺 直播频道上传</h1>
        <Suspense fallback={<div>加载上传组件...</div>}>
          <LiveUploadPage onUpload={setM3uContent} />
        </Suspense>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">已上传频道</h2>
          <Suspense fallback={<div>加载频道列表...</div>}>
            {/*<LiveChannelList m3uContent={m3uContent} />*/}
          </Suspense>
        </div>
      </div>
    </PageLayout>
  );
}
