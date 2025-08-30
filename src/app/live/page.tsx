'use client';

import PageLayout from '@/components/PageLayout';
import LiveUploadPage from '@/components/LiveUploadPage';
import LiveChannelList from '@/components/LiveChannelList';

export default function LivePage() {
  return (
    <PageLayout activePath="/live">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📺 直播频道上传</h1>
        <LiveUploadPage />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">已上传频道</h2>
          <LiveChannelList m3uContent="" />
        </div>
      </div>
    </PageLayout>
  );
}
