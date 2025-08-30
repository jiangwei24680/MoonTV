'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const ArtPlayer = dynamic(() => import('@/components/ArtPlayer'), { ssr: false })

type Channel = {
  name: string
  url: string
  logo?: string
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [currentStream, setCurrentStream] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const lines = text.split('\n')
    const parsed: Channel[] = []

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('#EXTINF')) {
        const name = lines[i].split(',')[1]?.trim() || `频道 ${i}`
        const url = lines[i + 1]?.trim()
        parsed.push({ name, url })
      }
    }

    setChannels(parsed)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📺 MoonTV 直播频道</h1>

      <input
        type="file"
        accept=".m3u"
        onChange={handleUpload}
        className="mb-6 block"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {channels.map((ch, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentStream(ch.url)}
            className="cursor-pointer border rounded-lg p-2 hover:shadow-md transition"
          >
            <img
              src={ch.logo || '/default-logo.png'}
              alt={ch.name}
              className="w-full h-24 object-cover rounded"
            />
            <p className="mt-2 text-center text-sm">{ch.name}</p>
          </div>
        ))}
      </div>

      {currentStream && (
        <div className="mt-8">
          <ArtPlayer url={currentStream} />
        </div>
      )}
    </div>
  )
}
