/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 网页端点播前贴片：Google IMA HTML5 SDK + Ad Manager 视频广告
 *
 * - 网页端没有 AdMob 插件（AdMob 是 App 专用的），所以网页走 IMA；
 *   旧的 AdSense 视频版（AFV）已于 2026-05-31 停用，须走 AdX Video / Ad Manager。
 * - 流程：动态加载 IMA SDK → 用 VAST tag 请求视频广告 → 在播放器上播完贴片
 *   再开始播正片；广告播完（或可跳过的广告被用户跳过）后放行。
 * - 失败放行：SDK 加载失败、广告请求失败、没有广告可播时都放行播放，
 *   不要堵死网页用户；等真实 tag 配好、广告能正常播出后再收紧。
 * - tag URL 从 window.RUNTIME_CONFIG.IMA_AD_TAG_URL 读（环境变量
 *   NEXT_PUBLIC_IMA_AD_TAG_URL，见 src/app/layout.tsx）；未配置时默认用
 *   Google 官方 IMA HTML5 示例的测试 tag（googleads-ima-html5/simple/ads.js），
 *   先保证机制能跑通、能验证。
 * - 真实 tag 配法：Ad Manager 后台建视频广告单元，拿到 VAST tag URL 后填到
 *   Cloudflare Pages 项目 moontv 的环境变量 NEXT_PUBLIC_IMA_AD_TAG_URL，
 *   保存后重新部署一次即可。
 * - IMA 集成按 Google IMA HTML5 文档：AdDisplayContainer + AdsLoader +
 *   AdsRequest + AdsManager；initialize() 尽量发生在用户点击播放的手势里
 *   （否则带声音的广告可能播不出来）；监听 CONTENT_PAUSE_REQUESTED /
 *   CONTENT_RESUME_REQUESTED 控制正片暂停与恢复。ArtPlayer 没有官方 IMA
 *   插件，这里手动把 IMA 接到一个临时 video 元素上（贴片播完即移除，
 *   正片仍由 ArtPlayer 播）。
 */

export type ImaPrerollResult = 'played' | 'failed';

// Google 官方 IMA HTML5 示例的测试 tag（googleads-ima-html5/simple/ads.js）
export const IMA_TEST_AD_TAG_URL =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&correlator=';

const IMA_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
// 单次贴片总超时：广告本身一般 15–30 秒，超时仍无终态事件时放行
const IMA_TIMEOUT_MS = 60 * 1000;

/** 广告 tag URL：优先用配置的真实 tag，未配置用官方测试 tag */
export function getImaAdTagUrl(): string {
  if (typeof window === 'undefined') return IMA_TEST_AD_TAG_URL;
  const cfg = (window as any).RUNTIME_CONFIG as
    | { IMA_AD_TAG_URL?: string }
    | undefined;
  const url = cfg?.IMA_AD_TAG_URL?.trim();
  return url || IMA_TEST_AD_TAG_URL;
}

let imaSdkPromise: Promise<boolean> | null = null;

/** 动态加载 IMA SDK（只加载一次） */
function loadImaSdk(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any).google?.ima) return Promise.resolve(true);
  if (imaSdkPromise) return imaSdkPromise;
  imaSdkPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = IMA_SDK_URL;
    script.async = true;
    script.onload = () => resolve(Boolean((window as any).google?.ima));
    script.onerror = () => {
      console.warn('[ima] IMA SDK 加载失败');
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return imaSdkPromise;
}

/**
 * 在播放器容器上播一段 IMA 视频贴片。
 * @param container 播放器外层 relative 容器（贴片遮罩与临时 video 挂在这里）
 * @returns 'played' = 广告播完（或被跳过）；'failed' = 没播出（调用方放行播放）
 */
export async function playImaPreroll(
  container: HTMLElement | null,
): Promise<ImaPrerollResult> {
  if (!container || typeof window === 'undefined') return 'failed';
  const sdkOk = await loadImaSdk();
  if (!sdkOk) return 'failed';
  const ima = (window as any).google.ima;

  // 贴片遮罩 + 临时 video（只给广告用，播完即移除，不动 ArtPlayer）
  const adDiv = document.createElement('div');
  adDiv.style.cssText =
    'position:absolute;inset:0;z-index:550;background:#000;';
  const video = document.createElement('video');
  video.setAttribute('playsinline', '');
  video.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;background:#000;';
  adDiv.appendChild(video);
  container.appendChild(adDiv);

  let adsManager: any = null;
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    try {
      adsManager?.destroy();
    } catch {
      /* ignore */
    }
    adsManager = null;
    adDiv.remove();
  };

  return new Promise<ImaPrerollResult>((resolve) => {
    const finish = (result: ImaPrerollResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    timer = setTimeout(() => {
      console.warn('[ima] 贴片超时未结束，放行播放');
      finish('failed');
    }, IMA_TIMEOUT_MS);

    try {
      const adDisplayContainer = new ima.AdDisplayContainer(adDiv, video);
      // 尽量在用户手势里初始化（带声音的广告才播得出来）；若不在手势里，
      // IMA 会按浏览器自动播放策略处理，失败时走 AD_ERROR → 放行。
      adDisplayContainer.initialize();

      const adsLoader = new ima.AdsLoader(adDisplayContainer);
      adsLoader.addEventListener(
        ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (adsManagerLoadedEvent: any) => {
          try {
            const adsRenderingSettings = new ima.AdsRenderingSettings();
            adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete =
              true;
            adsManager = adsManagerLoadedEvent.getAdsManager(
              video,
              adsRenderingSettings,
            );
            adsManager.addEventListener(
              ima.AdErrorEvent.Type.AD_ERROR,
              (adErrorEvent: any) => {
                console.warn(
                  '[ima] 广告播放出错，放行播放',
                  adErrorEvent?.getError?.(),
                );
                finish('failed');
              },
            );
            adsManager.addEventListener(
              ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
              () => {
                try {
                  video.pause();
                } catch {
                  /* ignore */
                }
              },
            );
            // 广告播完、或可跳过广告被用户跳过，都回到正片
            adsManager.addEventListener(
              ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
              () => finish('played'),
            );
            adsManager.addEventListener(
              ima.AdEvent.Type.ALL_ADS_COMPLETED,
              () => finish('played'),
            );
            adsManager.addEventListener(ima.AdEvent.Type.SKIPPED, () =>
              finish('played'),
            );
            const width = container.clientWidth || 640;
            const height = container.clientHeight || 360;
            adsManager.init(width, height, ima.ViewMode.NORMAL);
            adsManager.start();
          } catch (err) {
            console.warn('[ima] 广告管理器启动失败，放行播放', err);
            finish('failed');
          }
        },
      );
      adsLoader.addEventListener(
        ima.AdErrorEvent.Type.AD_ERROR,
        (adErrorEvent: any) => {
          console.warn(
            '[ima] 广告请求失败，放行播放',
            adErrorEvent?.getError?.(),
          );
          finish('failed');
        },
      );

      const adsRequest = new ima.AdsRequest();
      adsRequest.adTagUrl = getImaAdTagUrl();
      adsRequest.linearAdSlotWidth = container.clientWidth || 640;
      adsRequest.linearAdSlotHeight = container.clientHeight || 360;
      adsRequest.nonLinearAdSlotWidth = container.clientWidth || 640;
      adsRequest.nonLinearAdSlotHeight = 150;
      adsRequest.setAdWillAutoPlay(true);
      adsRequest.setAdWillPlayMuted(false);
      adsLoader.requestAds(adsRequest);
    } catch (err) {
      console.warn('[ima] 贴片初始化失败，放行播放', err);
      finish('failed');
    }
  });
}
