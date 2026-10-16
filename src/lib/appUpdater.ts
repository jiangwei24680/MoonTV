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
  const updater = getUpdater();
  if (!updater) return;

  Swal.fire({
    title: '正在检查更新…',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { versionCode } = await updater.getVersionCode();
    const res = await fetch('/app-version.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('版本信息获取失败');
    const info = (await res.json()) as AppVersionInfo;

    if (!info.apkUrl || info.versionCode <= versionCode) {
      Swal.fire({ icon: 'success', title: '已是最新版本', timer: 1500, showConfirmButton: false });
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
    const msg = typeof e?.message === 'string' ? e.message : '';
    if (msg.includes('NEED_INSTALL_PERMISSION')) {
      Swal.fire({ icon: 'warning', title: '需要授权', text: '请先允许本应用"安装未知应用"。' });
    } else {
      Swal.fire({ icon: 'error', title: '检查更新失败', text: msg || '请检查网络后重试' });
    }
  }
}
