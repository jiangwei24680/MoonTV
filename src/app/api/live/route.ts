export const runtime = 'edge';

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get('url');
  if (!raw) return new Response('missing url', { status: 400 });

  const res = await fetch(raw, {
    headers: {
      'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
      Referer: new URL(raw).origin,
    },
    redirect: 'follow',
  });

  if (!res.ok) return new Response(`upstream ${res.status}`, { status: 502 });

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
