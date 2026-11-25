/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Swal from 'sweetalert2';

export interface AppVersionInfo {
  versionCode: number;
  versionName: string;
  apkUrl: string;
  changelog: string;
}

function getUpdater(): any | null {
  if (typeof window === 'undefined') return null;
  return (window as any).Capacitor?.Plugins?.AppUpdater || null;
}

/** 是否在 App 内（Capacitor 环境且有更新插件） */
export function isAppEnvironment(): boolean {
  return getUpdater() !== null;
}

/**
 * 检查 App 更新。返回 true 表示已处理（有更新/无更新/出错均弹提示），
 * 由用户在用户菜单点击"检查 App 更新"时调用。
 */
export async function checkAppUpdate(): Promise<void> {
  await runUpdateCheck(false);
}

// 启动自动检查只跑一次（CapacitorInit 的 effect 在 App 冷启动时触发一次）
let autoCheckDone = false;

/**
 * 启动时自动检查更新（CapacitorInit 调用）：无更新或失败时静默，
 * 只有发现新版时才弹现有那套“发现新版本 vX，是否立即更新？”提示，
 * 确认后走同一套授权 + downloadAndInstall 流程。
 * 非 Play 安装的应用安卓不允许静默安装，下载完一定会弹系统安装界面让用户点一下“安装”。
 */
export async function checkAppUpdateOnLaunch(): Promise<void> {
  if (autoCheckDone) return;
  autoCheckDone = true;
  await runUpdateCheck(true);
}

/**
 * 更新检查主流程。
 * quiet=true（启动自动检查）：无更新/失败静默返回，只有发现新版才弹提示；
 * quiet=false（手动检查）：全程弹提示，与原来一致。
 */
async function runUpdateCheck(quiet: boolean): Promise<void> {
  const updater = getUpdater();
  if (!updater) return;

  if (!quiet) {
    Swal.fire({
      title: '正在检查更新…',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  // 用户已确认更新后才置 true：quiet 模式下确认前的失败静默，确认后的失败仍要提示
  let confirmed = false;

  try {
    const { versionCode } = await updater.getVersionCode();
    const res = await fetch('/app-version.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('版本信息获取失败');
    const info = (await res.json()) as AppVersionInfo;

    if (!info.apkUrl || info.versionCode <= versionCode) {
      if (!quiet) {
        Swal.fire({ icon: 'success', title: '已是最新版本', timer: 1500, showConfirmButton: false });
      }
      return;
    }

    const { isConfirmed } = await Swal.fire({
      icon: 'info',
      title: `发现新版本 v${info.versionName}`,
      html: info.changelog
        ? `<div style="text-align:left;white-space:pre-wrap">${info.changelog}</div>`
        : '是否立即更新？',
      showCancelButton: true,
      confirmButtonText: '立即更新',
      cancelButtonText: '稍后',
    });
    if (!isConfirmed) return;
    confirmed = true;

    // Android 8+ 需要"安装未知应用"授权
    try {
      const { canInstall } = await updater.canInstallPackages();
      if (!canInstall) {
        const go = await Swal.fire({
          icon: 'warning',
          title: '需要授权',
          text: '请在系统设置中允许本应用"安装未知应用"，然后重新点击更新。',
          showCancelButton: true,
          confirmButtonText: '去设置',
          cancelButtonText: '取消',
        });
        if (go.isConfirmed) {
          await updater.openInstallSettings();
        }
        return;
      }
    } catch {
      /* 低版本 Android 无此限制，继续 */
    }

    Swal.fire({
      title: '正在下载更新包…',
      text: '下载完成后会自动弹出安装界面',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    await updater.downloadAndInstall({ url: info.apkUrl });
    Swal.close();
  } catch (e: any) {
    if (quiet && !confirmed) return;
    const msg = typeof e?.message === 'string' ? e.message : '';
    if (msg.includes('NEED_INSTALL_PERMISSION')) {
      Swal.fire({ icon: 'warning', title: '需要授权', text: '请先允许本应用"安装未知应用"。' });
    } else {
      Swal.fire({ icon: 'error', title: '检查更新失败', text: msg || '请检查网络后重试' });
    }
  }
}
