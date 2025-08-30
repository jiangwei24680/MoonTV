// src/app/api/live/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  // 转发原始请求，伪装 UA、Referer
  const upstream = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
      Referer: new URL(url).origin,
    },
    redirect: 'follow',
  });

  // 把真实 .m3u8 回给播放器
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
