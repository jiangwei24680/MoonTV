'use client';
import Artplayer from 'artplayer';
import Hls, { HlsConfig } from 'hls.js';
import { useEffect, useRef, useState } from 'react';

interface Props {
  url: string;
  title?: string;
  isLive?: boolean;
  blockAd?: boolean;
  /** 强制播放类型（如 'm3u8'），用于 URL 无扩展名时（代理地址等） */
  type?: string;
}

export default function ArtPlayer({
  url,
  isLive = false,
  blockAd = true,
  type,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !url) return;
    setError(null);

    // 去广告只对点播生效：直播流中的 #EXT-X-DISCONTINUITY 是正常分段标记，过滤会导致断流
    const enableAdFilter = blockAd && !isLive;
    const loader = enableAdFilter
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
      maxBufferLength: 30,
      backBufferLength: 30,
      maxBufferSize: 60 * 1000 * 1000,
      loader,
      ...(isLive ? { lowLatencyMode: true, liveSyncDurationCount: 3 } : {}),
    };

    const player = new Artplayer({
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
      ...(type ? { type } : {}),
      customType: {
        m3u8(video: HTMLVideoElement, src: string) {
          const hls = new Hls(hlsConfig);
          hlsRef.current = hls;
          hls.on(Hls.Events.ERROR, (_evt, data) => {
            if (!data.fatal) return;
            setError(
              data.type === Hls.ErrorTypes.NETWORK_ERROR
                ? '网络错误，直播源连接失败'
                : '播放出错，该频道可能已失效'
            );
            try {
              hls.destroy();
            } catch {
              /* ignore */
            }
            hlsRef.current = null;
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        },
      },
    });

    return () => {
      try {
        hlsRef.current?.destroy();
      } catch {
        /* ignore */
      }
      hlsRef.current = null;
      player.destroy();
    };
  }, [url, isLive, blockAd, type, retryKey]);

  return (
    <div className="relative w-full h-full bg-black rounded overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-white text-sm px-6 text-center">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setRetryKey((k) => k + 1);
            }}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
          >
            重试
          </button>
        </div>
      )}
    </div>
  );
}
