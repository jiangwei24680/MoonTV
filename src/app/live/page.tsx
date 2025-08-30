'use client'

import PageLayout from '@/components/PageLayout'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function ChannelsPage() {
  return (
    <PageLayout activePath="/channels">
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative mb-8">
            <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-white text-4xl">📺</div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-20 animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              频道功能即将上线
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              你可以在此上传直播频道、管理列表，敬请期待。
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              🔄 刷新页面
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
