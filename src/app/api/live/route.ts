// src/app/api/live/route.ts
export const runtime = 'edge'; // ← 新增这一行

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  const upstream = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Referer: new URL(url).origin,
    },
    redirect: 'follow',
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
