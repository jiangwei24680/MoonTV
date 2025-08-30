'use client'

import PageLayout from '@/components/PageLayout'

export const dynamic = 'force-dynamic'

export default function LivePage() {
  return (
    <PageLayout activePath="/live">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📺 直播频道</h1>
        <p className="text-gray-600">此页面将支持频道上传与展示，功能模块即将上线。</p>
      </div>
    </PageLayout>
  )
}
