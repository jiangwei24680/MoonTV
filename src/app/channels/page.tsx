'use client'

import MainLayout from '@/components/MainLayout' // 首页使用的布局组件

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function ChannelsPage() {
  return (
    <MainLayout activePath="/channels">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📺 频道中心</h1>
        <p className="text-gray-600">此页面将支持频道上传与展示，功能模块即将上线。</p>
      </div>
    </MainLayout>
  )
}
