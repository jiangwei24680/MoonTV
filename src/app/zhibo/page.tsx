'use client'

import PageLayout from '@/components/PageLayout'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function ZhiboPage() {
  return (
    <PageLayout activePath="/zhibo">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📺 直播频道</h1>
        <p className="text-gray-600">频道上传与展示功能即将上线，敬请期待。</p>
      </div>
    </PageLayout>
  )
}
