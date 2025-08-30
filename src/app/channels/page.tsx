'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const [channels, setChannels] = useState<{ name: string; url: string }[]>([])

const LivePage = () => {
  const [channels, setChannels] = useState([])
  const router = useRouter()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const lines = text.split('\n')
    const parsed = []

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('#EXTINF')) {
        const nameMatch = lines[i].match(/,(.*)/)
        const name = nameMatch ? nameMatch[1] : `频道${i}`
        const url = lines[i + 1]?.trim()
        if (url) parsed.push({ name, url })
      }
    }

    setChannels(parsed)
  }

  const handleClick = (channel) => {
    const encodedTitle = encodeURIComponent(channel.name)
    const encodedUrl = encodeURIComponent(channel.url)
    router.push(`/play?source=custom&id=${encodedUrl}&title=${encodedTitle}&year=2024`)
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">直播频道预览</h1>

      <input
        type="file"
        accept=".m3u"
        onChange={handleUpload}
        className="mb-4"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {channels.map((channel, idx) => (
          <div
            key={idx}
            className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => handleClick(channel)}
          >
            <img
              src={`/logos/${channel.name}.jpg`}
              alt={channel.name}
              className="w-full h-32 object-cover mb-2"
              onError={(e) => (e.currentTarget.src = '/default.jpg')}
            />
            <p className="text-sm text-center">{channel.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LivePage
