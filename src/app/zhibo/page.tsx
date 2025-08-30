'use client'

import { useEffect, useRef, useState } from 'react'
import PageLayout from '@/components/PageLayout'
import Artplayer from 'artplayer'
import Hls from 'hls.js'

export default function ZhiboPage() {
  const artRef = useRef<HTMLDivElement | null>(null)
  const artPlayerRef = useRef<any>(null)
  const [channelUrl, setChannelUrl] = useState('')
  const [channelTitle, setChannelTitle] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const url = params.get('url')
    const title = params.get('title')
    if (url) setChannelUrl(url)
    if (title) setChannelTitle(title || '直播频道')
  }, [])

  useEffect(() => {
    if (!channelUrl || !artRef.current) return

    if (artPlayerRef.current) {
      artPlayerRef.current.destroy()
      artPlayerRef.current = null
    }

    artPlayerRef.current = new Artplayer({
      container: artRef.current,
      url: channelUrl,
      isLive: true,
      autoplay: true,
      volume: 0.7,
      muted: false,
      theme: '#22c55e',
      fullscreen: true,
      airplay: true,
      customType: {
        m3u8: function (video: HTMLVideoElement, url: string) {
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          video.hls = hls
        },
      },
    })
  }, [channelUrl])

  return (
    <PageLayout activePath="/zhibo">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📺 {channelTitle}
        </h1>
        <div className="w-full h-[300px] md:h-[500px] bg-black rounded-xl overflow-hidden shadow-lg">
          <div ref={artRef} className="w-full h-full" />
        </div>
      </div>
    </PageLayout>
  )
}
