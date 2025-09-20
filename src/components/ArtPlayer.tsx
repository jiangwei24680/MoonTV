'use client';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

interface Props {
  url: string;
  title?: string;
  poster?: string;
  isLive?: boolean;
  skipConfig?: {
    enable: boolean;
    intro_time: number;
    outro_time: number;
  };
  blockAd?: boolean;
}

export default function ArtPlayer({
  url,
  title = '',
  poster = '',
  isLive = false,
  skipConfig = { enable: false, intro_time: 0, outro_time: 0 },
  blockAd = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const skipRef = useRef(skipConfig);

  useEffect(() => {
    skipRef.current = skipConfig;
  }, [skipConfig]);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    if (playerRef.current) {
      playerRef.current.switch = url;
      playerRef.current.title = title;
      playerRef.current.poster = poster;
      return;
    }

    const loader = blockAd
      ? class extends Hls.DefaultConfig.loader {
          constructor(config: any) {
            super(config);
            const load = this.load.bind(this);
            this.load = function (context: any, config: any, callbacks: any) {
              const onSuccess = callbacks.onSuccess;
              callbacks.onSuccess = function (res: any, stats: any, ctx: any) {
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

    const hlsConfig = {
      enableWorker: true,
      lowLatencyMode: true,
      maxBufferLength: 30,
      backBufferLength: 30,
      maxBufferSize: 60 * 1000 * 1000,
      loader,
    };

    playerRef.current = new Artplayer({
      container: containerRef.current,
      url,
      title,
      poster,
      isLive,
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
          video.hls = hls;
        },
      },
    });

    playerRef.current.on('video:timeupdate', () => {
      const current = playerRef.current.currentTime || 0;
      const duration = playerRef.current.duration || 0;
      const config = skipRef.current;

      if (config.enable) {
        if (config.intro_time > 0 && current < config.intro_time) {
          playerRef.current.currentTime = config.intro_time;
          playerRef.current.notice.show = `已跳过片头 (${formatTime(config.intro_time)})`;
        }
        if (
          config.outro_time < 0 &&
          duration > 0 &&
          current > duration + config.outro_time
        ) {
          playerRef.current.pause();
          playerRef.current.notice.show = `已跳过片尾 (${formatTime(config.outro_time)})`;
        }
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [url, title, poster, isLive, blockAd]);

  return <div ref={containerRef} className="w-full h-[360px] bg-black rounded" />;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
