/**
 * AdMob 广告封装（APK 用）
 *
 * - 只在 Capacitor 原生环境初始化，网页端所有函数直接返回，不报错。
 * - 下方三个 ID 目前是 Google 官方测试 ID（跑通流程用）：
 *   横幅 ca-app-pub-3940256099942544/6300978111
 *   插屏 ca-app-pub-3940256099942544/1033173712
 *   应用 ID ca-app-pub-3940256099942544~3347511713（在 native-updater/patch_manifest.py 里写入 AndroidManifest）
 * - 正式上线：把 USE_TEST_ADS 改成 false，并把三个 ID 换成自己 AdMob 后台建的真实 ID；
 *   同时把 patch_manifest.py 里的应用 ID 也换成真实的，否则广告请求会被拒。
 */

// true = 测试广告（展示时带 Test Ad 字样，不产生收益）；正式上线改成 false 并替换下方 ID
export const USE_TEST_ADS = true;

// Google 官方测试广告单元 ID（Android）
export const ADMOB_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
export const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
// Google 官方测试应用 ID（Android），写入 AndroidManifest 用，见 native-updater/patch_manifest.py
export const ADMOB_APP_ID = 'ca-app-pub-3940256099942544~3347511713';

// 横幅底部留白（dp）：避开手机端 56px 高的底部导航栏
const BANNER_BOTTOM_MARGIN = 64;

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

/** 首页底部横幅（仅原生 App 内展示，网页端跳过） */
export async function showBanner(): Promise<void> {
  if (!isNativeApp() || bannerVisible) return;
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

/** 隐藏横幅（离开首页时调用） */
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
 * 插屏广告调用入口（预留，当前不在任何用户操作中途调用）。
 * 调用后先预加载再展示；未初始化或加载失败时静默跳过。
 */
export async function showInterstitial(): Promise<void> {
  if (!isNativeApp()) return;
  const ok = await initAdMob();
  if (!ok) return;
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.prepareInterstitial({
      adId: ADMOB_INTERSTITIAL_ID,
      isTesting: USE_TEST_ADS,
    });
    await AdMob.showInterstitial();
  } catch (err) {
    console.warn('[ads] 插屏展示失败', err);
  }
}
