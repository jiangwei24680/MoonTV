// scripts/parseM3U.ts
import fs from 'fs';
const text = fs.readFileSync('./cn.m3u', 'utf-8');
const lines = text.split('\n');
const result = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('#EXTINF')) {
    const name = lines[i].split(',')[1];
    const url = lines[i + 1];
    result.push({ name, url });
  }
}

fs.writeFileSync('./public/channels.json', JSON.stringify(result, null, 2));
