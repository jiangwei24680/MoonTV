/* eslint-disable no-console */

import { playImaPreroll } from '@/lib/ima-preroll.client';

/**
 * AdMob 广告封装（APK 用）
 *
 * - 只在 Capacitor 原生环境初始化，网页端所有函数直接返回，不报错。
 * - 应用 ID 已是真实 ID（AdMob 账号美国发布商 pub-7387037413649666，
 *   应用 kyrinMedia 已登记：ca-app-pub-7387037413649666~7723164968；
 *   该 ID 在 native-updater/patch_manifest.py 里写入 AndroidManifest）。
 * - 横幅 / 插屏广告单元已是真实 ID（2026-11-18 AdMob 账号获批后建）：
 *   横幅 ca-app-pub-7387037413649666/7583877822
 *   插屏 ca-app-pub-7387037413649666/1091842852
 * - 点播前贴片：网页端与原生 App 统一走 IMA HTML5 贴片（见 ima-preroll.client），
 *   在 WebView 播放器容器内播，广告播完（或被跳过）自动放行出片。
 *   2026-11-26 之前原生 App 用 AdMob 全屏插屏（prepareInterstitial /
 *   showInterstitial），但 AdMob 全屏广告没有程序自动关闭，关闭按钮是谷歌
 *   SDK 画的，只能等用户点叉；实测（v15）广告看完后界面不退出、无退出口，
 *   用户被卡住。改走 IMA 后“看完自动出片”，失败/超时也放行，绝不堵播放。
 *   注意：当前 IMA 用 Google 官方测试 tag（无收益），等 AdSense 获批、配好
 *   真实 VAST tag 后再产生收益；底部横幅仍是真实单元（7583877822），照常计费。
 *   AdMob 插屏单元（1091842852）与激励插屏（6270796156）保留备用，
 *   showInterstitial 函数留作备用，当前贴片不再用它。
 * - 贴片规则：每次点播（打开播放页、切集）都先播 IMA 贴片，播完自动出片；
 *   加载/请求失败或无广告时直接放行。电视端直接放行（AdMob 不支持 Android TV）。
 * - 2026-11-18 已换成真实单元 ID，USE_TEST_ADS 已改 false；
 *   patch_manifest.py 里的应用 ID 不用动（已是真实的）。
 */

// true = 测试广告（展示时带 Test Ad 字样，不产生收益）；正式上线改成 false 并替换下方 ID
export const USE_TEST_ADS = false;

// 真实广告单元 ID（AdMob 后台 kyrinMedia，2026-11-18 建）
export const ADMOB_BANNER_ID = 'ca-app-pub-7387037413649666/7583877822';
export const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-7387037413649666/1091842852';
// 激励插屏真实 ID（2026-11-25 起贴片改普通插屏，该单元停用、ID 保留备用，不删除）
export const ADMOB_REWARDED_INTERSTITIAL_ID =
  'ca-app-pub-7387037413649666/6270796156';
// 真实应用 ID（AdMob 后台 kyrinMedia 应用，发布商 pub-7387037413649666），写入 AndroidManifest 用，见 native-updater/patch_manifest.py
export const ADMOB_APP_ID = 'ca-app-pub-7387037413649666~7723164968';

// 横幅底部留白（dp）：避开手机端 56px 高的底部导航栏
const BANNER_BOTTOM_MARGIN = 64;

// 插屏展示安全超时：防止展示回调丢失时拖住播放
const INTERSTITIAL_SHOW_TIMEOUT_MS = 180 * 1000;

// ---------------------------------------------------------------------------
// 管理员免广告：本地口令校验（仅防普通用户；写在客户端代码里的口令防不住反编译）
// ---------------------------------------------------------------------------
const ADMIN_NO_ADS_KEY = 'moontv_admin_no_ads';
export const ADMIN_NO_ADS_EVENT = 'moontv-admin-no-ads-changed';
const ADMIN_PASSWORD = '1122';

/** 管理员免广告是否开启（本机 localStorage 持久标记，App 更新后保留） */
export function isAdminNoAds(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(ADMIN_NO_ADS_KEY) === '1';
  } catch {
    return false;
  }
}

/** 开关管理员免广告（开启时立即隐藏当前横幅；网页端 AdBanner 通过事件同步） */
export function setAdminNoAds(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      window.localStorage.setItem(ADMIN_NO_ADS_KEY, '1');
    } else {
      window.localStorage.removeItem(ADMIN_NO_ADS_KEY);
    }
  } catch {
    /* ignore */
  }
  // 通知网页端 AdBanner 同步隐藏/恢复（原生横幅走下面的 hideBanner）
  window.dispatchEvent(new Event(ADMIN_NO_ADS_EVENT));
  if (enabled) {
    void hideBanner();
  }
}

/** 本地校验管理员口令（只做本地比对，不发服务器、不记日志） */
export function verifyAdminPassword(input: string): boolean {
  return input === ADMIN_PASSWORD;
}

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const cap = (
      window as unknown as {
        Capacitor?: {
          isNativePlatform?: () => boolean;
          getPlatform?: () => string;
        };
      }
    ).Capacitor;
    if (!cap) return false;
    if (typeof cap.isNativePlatform === 'function') {
      return cap.isNativePlatform();
    }
    const platform =
      typeof cap.getPlatform === 'function' ? cap.getPlatform() : '';
    return platform === 'android' || platform === 'ios';
  } catch {
    return false;
  }
}

/**
 * 是否电视端（Android TV / Tizen / WebOS / GoogleTV，或 URL 带 ?tv=1）。
 * AdMob 不支持 Android TV，电视端没有 AdMob 可用，贴片直接放行
 * （否则电视上永远播不了，直接变砖）；电视端暂时无贴片广告，以后再说。
 */
export function isTV(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tv') === '1') return true;
    const ua = window.navigator.userAgent || '';
    return /Android TV|GoogleTV|Tizen|WebOS|SmartTV|Smart-TV/i.test(ua);
  } catch {
    return false;
  }
}

let initialized = false;
let initPromise: Promise<boolean> | null = null;

export async function initAdMob(): Promise<boolean> {
  if (!isNativeApp()) return false;
  if (initialized) return true;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.initialize();
      initialized = true;
      return true;
    } catch (err) {
      console.warn('[ads] AdMob 初始化失败', err);
      return false;
    }
  })();
  return initPromise;
}

let bannerCreated = false;
let bannerVisible = false;

/** 底部横幅常驻（仅原生 App 内展示，网页端跳过；管理员免广告时不展示；切页不隐藏） */
export async function showBanner(): Promise<void> {
  if (!isNativeApp() || bannerVisible) return;
  if (isAdminNoAds()) return;
  const ok = await initAdMob();
  if (!ok) return;
  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await import(
      '@capacitor-community/admob'
    );
    if (bannerCreated) {
      await AdMob.resumeBanner();
    } else {
      await AdMob.showBanner({
        adId: ADMOB_BANNER_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: BANNER_BOTTOM_MARGIN,
        isTesting: USE_TEST_ADS,
      });
      bannerCreated = true;
    }
    bannerVisible = true;
  } catch (err) {
    console.warn('[ads] 横幅展示失败', err);
  }
}

/** 隐藏横幅（仅管理员免广告时调用） */
export async function hideBanner(): Promise<void> {
  if (!isNativeApp() || !bannerVisible) return;
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.hideBanner();
    bannerVisible = false;
  } catch {
    /* 隐藏失败时忽略，不影响页面 */
  }
}

/**
 * 普通插屏（备用，当前贴片不再用）：预加载 → 展示 → 等用户点叉关闭（Dismissed
 * 事件）才算过关。2026-11-26 起贴片改走 IMA（见 playWithPrerollAd），原因：
 * AdMob 全屏广告无法由程序自动关闭，实测 v15 广告看完后界面不退出、用户被卡住。
 * 返回 true = 广告已展示且用户已关闭；返回 false = 初始化/加载/展示失败。
 * 注意：原生层 showInterstitial 的 promise 在广告展示出来时就 resolve，
 * 绝不能拿它当“看完”信号；关闭按钮是谷歌 SDK 画的，只能等用户点叉。
 */
export async function showInterstitial(): Promise<boolean> {
  if (!isNativeApp()) return false;
  if (isAdminNoAds()) return true;
  const ok = await initAdMob();
  if (!ok) return false;

  let dismissedHandle: { remove: () => Promise<void> } | null = null;
  let failedHandle: { remove: () => Promise<void> } | null = null;

  try {
    const { AdMob, InterstitialAdPluginEvents } = await import(
      '@capacitor-community/admob'
    );
    await AdMob.prepareInterstitial({
      adId: ADMOB_INTERSTITIAL_ID,
      isTesting: USE_TEST_ADS,
    });

    return await new Promise<boolean>((resolve) => {
      let settled = false;
      const cleanup = () => {
        void dismissedHandle?.remove().catch(() => undefined);
        void failedHandle?.remove().catch(() => undefined);
      };
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanup();
        resolve(value);
      };
      // 安全超时：防止展示回调丢失时拖住播放
      const timer = setTimeout(
        () => finish(false),
        INTERSTITIAL_SHOW_TIMEOUT_MS,
      );
      void AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        finish(true);
      }).then((h) => {
        dismissedHandle = h;
      });
      void AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
        finish(false);
      }).then((h) => {
        failedHandle = h;
      });
      // show 的 promise 在广告展示出来时即 resolve，不代表用户已关闭，
      // 所以这里只处理 reject（展示失败），不拿 resolve 当过关信号
      void AdMob.showInterstitial().then(
        () => {
          /* 已展示，等 Dismissed 事件 */
        },
        () => finish(false),
      );
    });
  } catch (err) {
    console.warn('[ads] 插屏展示失败', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// 点播前贴片：网页端与原生 App 统一走 IMA 贴片，播完自动出片
// ---------------------------------------------------------------------------

let prerollInFlight: Promise<boolean> | null = null;

/**
 * 点播前贴片主入口：每次点播（打开播放页、切集、自动连播）都先过广告关。
 * - 管理员免广告：直接放行。
 * - 电视端（isTV）：直接放行（AdMob 不支持 Android TV，没有广告可弹）。
 * - 网页端与原生 App：统一走 IMA HTML5 贴片（Ad Manager 视频广告），
 *   在播放器容器内播，广告播完（或被跳过）自动放行出片；请求失败、无广告、
 *   超时时也放行，绝不堵死播放（等真实 tag 配好再收紧）。
 *   原生 App 之前用 AdMob 全屏插屏，因 SDK 不给程序关闭、实测看完卡住，
 *   2026-11-26 起改走 IMA；底部横幅仍是 AdMob 真实单元，不受影响。
 * 参数 videoWrap：IMA 贴片的挂载容器（播放器外层 relative 容器）。
 * 返回 true = 可以开始播放（失败也放行）。
 */
export async function playWithPrerollAd(
  videoWrap?: HTMLElement | null,
): Promise<boolean> {
  if (isAdminNoAds()) return true;
  if (isTV()) return true;
  if (prerollInFlight) return prerollInFlight;
  const run = (async (): Promise<boolean> => {
    // 网页端与原生 App 统一走 IMA 贴片：播完自动出片；失败/超时也放行。
    // 不再用 AdMob 全屏插屏——SDK 不给程序关闭，实测看完卡住无退出口。
    try {
      const result = await playImaPreroll(videoWrap ?? null);
      if (result === 'failed') {
        console.warn('[ads] 贴片未播出，放行播放');
      }
    } catch (err) {
      console.warn('[ads] 贴片失败，放行播放', err);
    }
    return true;
  })();
  prerollInFlight = run;
  try {
    return await run;
  } finally {
    prerollInFlight = null;
  }
}
