'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageLayout from '@/components/PageLayout'

function ZhiboInner() {
  const params = useSearchParams()
  const url = params.get('url')
  const title = params.get('title') ?? '直播频道'

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📺 {title}</h1>
      <p className="text-gray-600">频道地址：{url}</p>
    </div>
  )
}

export default function ZhiboPage() {
  return (
    <PageLayout activePath="/zhibo">
      <Suspense fallback={<div className="p-6 text-gray-500">加载中...</div>}>
        <ZhiboInner />
      </Suspense>
    </PageLayout>
  )
}
