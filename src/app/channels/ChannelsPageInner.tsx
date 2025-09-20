'use client';
import { useEffect, useState } from 'react';
import ArtPlayer from '@/components/ArtPlayer';

interface Channel {
  name: string;
  url: string;
  group?: string;
  country?: string;
  language?: string;
}

export default function ChannelsPageInner() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  useEffect(() => {
    fetch('/channels.json')
      .then((res) => res.json())
      .then((data) => setChannels(data));
  }, []);

  const grouped = channels.reduce((acc, ch) => {
    const key = ch.group || '未分组';
    if (!acc[key]) acc[key] = [];
    acc[key].push(ch);
    return acc;
  }, {} as Record<string, Channel[]>);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">IPTV 频道列表</h1>

      {Object.entries(grouped).map(([group, list]) => (
        <div key={group} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{group}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {list.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentChannel(ch)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded"
              >
                {ch.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {currentChannel && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">{currentChannel.name}</h2>
          <ArtPlayer
            option={{
              url: currentChannel.url,
              type: 'm3u8',
              autoplay: true,
            }}
          />
        </div>
      )}
    </div>
  );
}
