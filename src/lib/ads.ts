/* eslint-disable no-console */

/**
 * AdMob 广告封装（APK 用）
 *
 * - 只在 Capacitor 原生环境初始化，网页端所有函数直接返回，不报错。
 * - 应用 ID 已是真实 ID（AdMob 账号美国发布商 pub-7387037413649666，
 *   应用 MoonTV 已登记：ca-app-pub-7387037413649666~7723164968；
 *   该 ID 在 native-updater/patch_manifest.py 里写入 AndroidManifest）。
 * - 横幅 / 插屏广告单元仍是 Google 官方测试 ID（真实广告单元还没建）：
 *   横幅 ca-app-pub-3940256099942544/6300978111
 *   插屏 ca-app-pub-3940256099942544/1033173712
 * - 点播前贴片用插件 @capacitor-community/admob 自带的激励插屏
 *   prepareRewardInterstitialAd / showRewardInterstitialAd（已核实支持），
 *   测试单元 ID 来自 Google 官方文档：
 *   developers.google.com/admob/android/next-gen/rewarded-interstitial
 *   激励插屏 ca-app-pub-3940256099942544/5354046379
 * - 贴片规则：每次点播（打开播放页、切集）都先弹全屏激励插屏，看完才开始播放。
 *   弹之前先出提示页（“观看一段广告后开始播放本集”，按钮 [观看广告] / [取消]），
 *   用户点取消或提前关闭广告 → 不播放；看完广告（以获得奖励回调为准）→ 开始播放。
 *   广告实际时长、几秒后可关闭由 AdMob 决定，我们控制不了精确时长。
 *   广告加载或展示失败属于技术故障，放行播放（否则断网/无填充时无法看片）。
 * - 真实广告单元建好后：把下面三个单元 ID 换成真实的，并把 USE_TEST_ADS 改成 false；
 *   换单元 ID 时 patch_manifest.py 里的应用 ID 不用动（已是真实的）。
 */

// true = 测试广告（展示时带 Test Ad 字样，不产生收益）；正式上线改成 false 并替换下方 ID
export const USE_TEST_ADS = true;

// Google 官方测试广告单元 ID（Android）
export const ADMOB_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
export const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
export const ADMOB_REWARDED_INTERSTITIAL_ID =
  'ca-app-pub-3940256099942544/5354046379';
// 真实应用 ID（AdMob 后台 MoonTV 应用，发布商 pub-7387037413649666），写入 AndroidManifest 用，见 native-updater/patch_manifest.py
export const ADMOB_APP_ID = 'ca-app-pub-7387037413649666~7723164968';

// 横幅底部留白（dp）：避开手机端 56px 高的底部导航栏
const BANNER_BOTTOM_MARGIN = 64;

// 广告展示安全超时：防止展示回调丢失时拖住播放
const RI_SHOW_TIMEOUT_MS = 180 * 1000;

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

// ---------------------------------------------------------------------------
// 点播前贴片：每次点播先弹全屏激励插屏，看完才开始播放
// ---------------------------------------------------------------------------

/** 合规前置页回调：由 RewardAdPrompt 组件注册，返回用户是否接受看广告 */
type RewardPromptHandler = () => Promise<boolean>;
let rewardPromptHandler: RewardPromptHandler | null = null;

export function setRewardPromptHandler(
  handler: RewardPromptHandler | null,
): void {
  rewardPromptHandler = handler;
}

async function requestRewardPrompt(): Promise<boolean> {
  if (!rewardPromptHandler) return false;
  try {
    return await rewardPromptHandler();
  } catch {
    return false;
  }
}

let rewardedReady = false;
let rewardedPreparePromise: Promise<boolean> | null = null;

/** 预加载激励插屏（失败静默返回 false，不抛错） */
async function prepareRewardedInterstitial(): Promise<boolean> {
  if (rewardedReady) return true;
  if (rewardedPreparePromise) return rewardedPreparePromise;
  rewardedPreparePromise = (async () => {
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.prepareRewardInterstitialAd({
        adId: ADMOB_REWARDED_INTERSTITIAL_ID,
        isTesting: USE_TEST_ADS,
      });
      rewardedReady = true;
      return true;
    } catch (err) {
      console.warn('[ads] 激励插屏预加载失败', err);
      return false;
    } finally {
      rewardedPreparePromise = null;
    }
  })();
  return rewardedPreparePromise;
}

type RewardedInterstitialResult = 'granted' | 'closed' | 'failed';

/**
 * 展示已预加载的激励插屏。
 * 以“获得奖励”回调为准：show 的 promise resolve 或 Rewarded 事件任一先到
 * 即算看完（granted）；用户提前关闭且未获奖励为 closed；展示失败为 failed。
 */
async function showRewardedInterstitial(): Promise<RewardedInterstitialResult> {
  const { AdMob, RewardInterstitialAdPluginEvents } = await import(
    '@capacitor-community/admob'
  );
  let granted = false;
  let settled = false;
  let rewardedHandle: { remove: () => Promise<void> } | null = null;
  let dismissedHandle: { remove: () => Promise<void> } | null = null;
  let failedHandle: { remove: () => Promise<void> } | null = null;

  const cleanup = () => {
    rewardedReady = false;
    void rewardedHandle?.remove().catch(() => undefined);
    void dismissedHandle?.remove().catch(() => undefined);
    void failedHandle?.remove().catch(() => undefined);
  };

  return new Promise<RewardedInterstitialResult>((resolve) => {
    const finish = (value: RewardedInterstitialResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve(value);
    };
    // 安全超时：防止展示回调丢失时拖住播放
    const timer = setTimeout(
      () => finish(granted ? 'granted' : 'failed'),
      RI_SHOW_TIMEOUT_MS,
    );
    void AdMob.addListener(
      RewardInterstitialAdPluginEvents.Rewarded,
      () => {
        granted = true;
      },
    ).then((h) => {
      rewardedHandle = h;
    });
    void AdMob.addListener(
      RewardInterstitialAdPluginEvents.Dismissed,
      () => {
        finish(granted ? 'granted' : 'closed');
      },
    ).then((h) => {
      dismissedHandle = h;
    });
    void AdMob.addListener(
      RewardInterstitialAdPluginEvents.FailedToShow,
      () => {
        finish('failed');
      },
    ).then((h) => {
      failedHandle = h;
    });
    void AdMob.showRewardInterstitialAd().then(
      () => {
        granted = true;
        finish('granted');
      },
      () => finish('failed'),
    );
  });
}

let prerollInFlight: Promise<boolean> | null = null;

/**
 * 点播前贴片主入口：每次点播（打开播放页、切集）都先弹全屏激励插屏，
 * 看完广告才允许播放；网页端直接放行，不弹广告。
 * 返回 true = 可以开始播放；false = 用户取消或提前关闭，不播放。
 * 广告加载或展示失败属于技术故障，放行播放（否则断网/无填充时无法看片）。
 */
export async function playWithPrerollAd(): Promise<boolean> {
  if (!isNativeApp()) return true;
  if (prerollInFlight) return prerollInFlight;
  const run = (async (): Promise<boolean> => {
    try {
      const ok = await initAdMob();
      if (!ok) return true;
      const prepared = await prepareRewardedInterstitial();
      if (!prepared) return true;
      // 合规前置页：说明看完广告才开始播放，用户可取消
      const accepted = await requestRewardPrompt();
      if (!accepted) return false;
      const result = await showRewardedInterstitial();
      if (result === 'granted') return true;
      if (result === 'failed') {
        console.warn('[ads] 激励插屏展示失败，放行播放');
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[ads] 贴片广告失败，放行播放', err);
      return true;
    }
  })();
  prerollInFlight = run;
  try {
    return await run;
  } finally {
    prerollInFlight = null;
  }
}
