'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  m3uContent: string;
};

type Channel = {
  name: string;
  url: string;
};

function parseM3U(content: string): Channel[] {
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  const channels: Channel[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF')) {
      const name = lines[i].split(',')[1] || `频道 ${i}`;
      const url = lines[i + 1] || '';
      channels.push({ name, url });
    }
  }

  return channels;
}

export default function LiveChannelList({ m3uContent }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ 顶层调用，合法
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const initial = searchParams.get('filter') || '';
    setFilter(initial);
  }, [searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }

    router.replace(`/live?${params.toString()}`);
  };

  if (!m3uContent) {
    return <p className="text-gray-500">暂无频道数据</p>;
  }

  const allChannels = parseM3U(m3uContent);
  const filteredChannels = filter
    ? allChannels.filter(ch => ch.name.includes(filter))
    : allChannels;

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="筛选频道名称"
        className="w-full px-3 py-2 border rounded"
      />

      <ul className="space-y-2">
        {filteredChannels.map((channel, idx) => (
          <li key={idx} className="border p-2 rounded">
            <div className="font-semibold">{channel.name}</div>
            <div className="text-sm text-gray-600">{channel.url}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
