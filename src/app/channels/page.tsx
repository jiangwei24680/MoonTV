'use client'

import PageLayout from '@/components/PageLayout'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function ChannelsPage() {
  return (
    <PageLayout activePath="/channels">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📺 频道中心</h1>
        <p className="text-gray-600">此页面将支持频道上传与展示，功能模块即将上线。</p>
      </div>
    </PageLayout>
  )
}
