import React, { useEffect, useState } from 'react';

type Channel = {
  name: string;
  url: string;
};

type Props = {
  m3uContent: string; // 直接传入 .m3u 文件内容
};

const LiveChannelList: React.FC<Props> = ({ m3uContent }) => {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const lines = m3uContent.split('\n').map(line => line.trim()).filter(Boolean);
    const parsed: Channel[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('#EXTINF')) {
        const nameMatch = lines[i].match(/,(.*)$/);
        const name = nameMatch ? nameMatch[1] : `频道 ${parsed.length + 1}`;
        const url = lines[i + 1] || '';
        if (url.startsWith('http')) {
          parsed.push({ name, url });
        }
      }
    }

    setChannels(parsed);
  }, [m3uContent]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📺 直播频道列表</h2>
      {channels.length === 0 ? (
        <p>未解析到频道数据。</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {channels.map((channel, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <strong>{channel.name}</strong>
              <br />
              <a href={channel.url} target="_blank" rel="noopener noreferrer">
                播放链接
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveChannelList;
