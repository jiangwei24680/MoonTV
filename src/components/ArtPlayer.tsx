'use client';
import Artplayer from 'artplayer';
import Hls, { HlsConfig } from 'hls.js';
import { useEffect, useRef } from 'react';

interface Props {
  url: string;
  title?: string;
  isLive?: boolean;
  blockAd?: boolean;
}

export default function ArtPlayer({
  url,
  title,
  isLive = false,
  blockAd = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    const loader = blockAd
      ? class extends Hls.DefaultConfig.loader {
          constructor() {
            super(Hls.DefaultConfig);
            const load = this.load.bind(this);
            this.load = function (context, config, callbacks) {
              const onSuccess = callbacks.onSuccess;
              callbacks.onSuccess = function (res, stats, ctx) {
                if (res.data && typeof res.data === 'string') {
                  res.data = res.data
                    .split('\n')
                    .filter((line: string) => !line.includes('#EXT-X-DISCONTINUITY'))
                    .join('\n');
                }
                return onSuccess(res, stats, ctx, null);
              };
              load(context, config, callbacks);
            };
          }
        }
      : Hls.DefaultConfig.loader;

    const hlsConfig: Partial<HlsConfig> = {
      enableWorker: true,
      lowLatencyMode: true,
      maxBufferLength: 30,
      backBufferLength: 30,
      maxBufferSize: 60 * 1000 * 1000,
      loader,
      xhrSetup: function (xhr) {
        xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X)');
        xhr.setRequestHeader('Referer', 'http://example.com');
      },
    };

    playerRef.current = new Artplayer({
      container: containerRef.current,
      url,
      autoplay: true,
      volume: 0.7,
      theme: '#22c55e',
      playbackRate: true,
      fullscreen: true,
      fullscreenWeb: true,
      airplay: true,
      hotkey: true,
      customType: {
        m3u8(video: HTMLVideoElement, url: string) {
          const hls = new Hls(hlsConfig);
          hls.loadSource(url);
          hls.attachMedia(video);
          (video as HTMLVideoElement & { hls?: Hls }).hls = hls;
        },
      },
    });

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [url, blockAd]);

  return <div ref={containerRef} className="w-full h-[360px] bg-black rounded" />;
}
