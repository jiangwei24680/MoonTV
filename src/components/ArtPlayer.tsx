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
  const playerRef = useRef<Artplayer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  // 手势提示
  const [gestureTip, setGestureTip] = useState<string | null>(null);
  const gestureTipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTip = (text: string) => {
    setGestureTip(text);
    if (gestureTipTimer.current) clearTimeout(gestureTipTimer.current);
    gestureTipTimer.current = setTimeout(() => setGestureTip(null), 800);
  };

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

    playerRef.current = player;

    return () => {
      try {
        hlsRef.current?.destroy();
      } catch {
        /* ignore */
      }
      hlsRef.current = null;
      playerRef.current = null;
      player.destroy();
    };
  }, [url, isLive, blockAd, type, retryKey]);

  // ---------- 手机手势：滑动快进退/音量、双击、长按2倍速 ----------
  const gestureRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = gestureRef.current;
    if (!el) return;
    let startX = 0, startY = 0, startT = 0;
    let moving = false;
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let longPressActive = false;
    let lastTap = 0;
    let tapTimer: ReturnType<typeof setTimeout> | null = null;
    const SEEK_PX = 50; // 首次判定阈值，防误触

    const getPlayer = () => playerRef.current;
    const getVideo = () => getPlayer()?.video as HTMLVideoElement | undefined;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; startT = Date.now();
      moving = false; longPressActive = false;
      // 长按 350ms -> 2倍速
      longPressTimer = setTimeout(() => {
        const p = getPlayer();
        if (p && !p.video.paused) {
          longPressActive = true;
          p.playbackRate = 2;
          showTip('2x 加速中…');
        }
      }, 350);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) > SEEK_PX || Math.abs(dy) > SEEK_PX) {
        moving = true;
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      }
      if (!moving) return;
      const p = getPlayer(); const v = getVideo();
      if (!p || !v) return;
      const rect = el.getBoundingClientRect();
      if (Math.abs(dx) > Math.abs(dy)) {
        // 水平滑动：快进/快退（每 50px 约 10 秒）
        const secs = Math.round(dx / 50) * 10;
        if (secs !== 0) {
          v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + secs));
          showTip(`${secs > 0 ? '快进' : '快退'} ${Math.abs(secs)} 秒`);
          startX = t.clientX; // 跟手
        }
      } else {
        // 垂直滑动：右侧音量
        const isRight = t.clientX > rect.left + rect.width / 2;
        if (isRight) {
          const delta = -dy / 200; // 上滑增大
          const vol = Math.max(0, Math.min(1, (v.volume || 0) + delta));
          v.volume = vol;
          showTip(`音量 ${Math.round(vol * 100)}%`);
          startY = t.clientY;
        } else {
          showTip('亮度调节仅 App 内可用');
        }
      }
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (longPressActive) {
        const p = getPlayer();
        if (p) p.playbackRate = 1;
        longPressActive = false;
        return;
      }
      if (moving) return;
      // 点按：区分单击/双击
      const now = Date.now();
      const x = (e.changedTouches[0]?.clientX ?? 0);
      const rect = el.getBoundingClientRect();
      const relX = (x - rect.left) / rect.width;
      if (now - lastTap < 300) {
        if (tapTimer) { clearTimeout(tapTimer); tapTimer = null; }
        lastTap = 0;
        const v = getVideo();
        if (!v) return;
        if (relX < 0.3) {
          v.currentTime = Math.max(0, v.currentTime - 10);
          showTip('快退 10 秒');
        } else if (relX > 0.7) {
          v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
          showTip('快进 10 秒');
        } else {
          const p = getPlayer();
          if (p) p.toggle();
        }
      } else {
        lastTap = now;
        tapTimer = setTimeout(() => {
          // 单击：切换控制栏（Artplayer 默认点击行为）
          tapTimer = null;
        }, 320);
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black rounded overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {/* 手势层 */}
      <div ref={gestureRef} className="absolute inset-0 z-10 touch-none" />
      {/* 手势提示 */}
      {gestureTip && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-4 py-2 bg-black/70 text-white text-sm rounded-lg pointer-events-none">
          {gestureTip}
        </div>
      )}
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
