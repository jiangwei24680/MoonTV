import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const M3U_URL = 'https://iptv-org.github.io/iptv/countries/cn.m3u';
const OUTPUT = path.resolve(__dirname, '../public/channels.json');

async function run() {
  const res = await fetch(M3U_URL);
  const text = await res.text();
  const lines = text.split('\n');

  const channels = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF')) {
      const info = lines[i];
      const url = lines[i + 1];
      const nameMatch = info.match(/tvg-name="(.*?)"/);
      const logoMatch = info.match(/tvg-logo="(.*?)"/);
      const groupMatch = info.match(/group-title="(.*?)"/);
      const name = nameMatch?.[1] || info.split(',')[1] || '未知频道';

      channels.push({
        name,
        url,
        logo: logoMatch?.[1],
        group: groupMatch?.[1],
      });
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(channels, null, 2));
  console.log(`✅ 已解析 ${channels.length} 个频道到 channels.json`);
}

run();
