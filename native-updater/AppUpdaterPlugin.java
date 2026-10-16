package com.moontv.updater;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * App 内更新插件：获取已安装版本号、下载 APK 并调起系统安装器。
 * 由 CI workflow 在 cap add 之后拷贝进 android 工程，并在 MainActivity 注册。
 */
@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {

    @PluginMethod
    public void getVersionCode(PluginCall call) {
        try {
            Context ctx = getContext();
            long versionCode;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                versionCode = ctx.getPackageManager()
                        .getPackageInfo(ctx.getPackageName(), 0)
                        .getLongVersionCode();
            } else {
                @SuppressWarnings("deprecation")
                int vc = ctx.getPackageManager()
                        .getPackageInfo(ctx.getPackageName(), 0).versionCode;
                versionCode = vc;
            }
            JSObject ret = new JSObject();
            ret.put("versionCode", versionCode);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("获取版本号失败: " + e.getMessage());
        }
    }

    /** Android 8+ 安装未知应用是否已授权 */
    @PluginMethod
    public void canInstallPackages(PluginCall call) {
        boolean can = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            can = getContext().getPackageManager().canRequestPackageInstalls();
        }
        JSObject ret = new JSObject();
        ret.put("canInstall", can);
        call.resolve(ret);
    }

    /** 跳到系统设置页，让用户打开"允许安装未知应用" */
    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Intent intent = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + getContext().getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
        }
        call.resolve();
    }

    /** 下载 APK，完成后自动调起系统安装器 */
    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String url = call.getString("url");
        if (url == null || url.isEmpty()) {
            call.reject("缺少下载地址");
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                && !getContext().getPackageManager().canRequestPackageInstalls()) {
            call.reject("NEED_INSTALL_PERMISSION");
            return;
        }
        // 保留 call，后台线程下载完成后 resolve
        new Thread(() -> {
            try {
                File apkFile = downloadApk(url);
                installApk(apkFile);
                call.resolve();
            } catch (Exception e) {
                call.reject("下载失败: " + e.getMessage());
            }
        }).start();
    }

    private File downloadApk(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setInstanceFollowRedirects(true);
        conn.setConnectTimeout(30000);
        conn.setReadTimeout(60000);
        conn.setRequestProperty("User-Agent", "MoonTV-Updater");
        conn.connect();
        int code = conn.getResponseCode();
        if (code < 200 || code >= 300) {
            throw new Exception("HTTP " + code);
        }
        File dir = getContext().getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
        if (dir == null) {
            dir = getContext().getFilesDir();
        }
        if (!dir.exists()) {
            dir.mkdirs();
        }
        File apkFile = new File(dir, "moontv-update.apk");
        try (InputStream in = conn.getInputStream();
             FileOutputStream out = new FileOutputStream(apkFile)) {
            byte[] buf = new byte[8192];
            int len;
            while ((len = in.read(buf)) != -1) {
                out.write(buf, 0, len);
            }
        } finally {
            conn.disconnect();
        }
        return apkFile;
    }

    private void installApk(File apkFile) {
        Context ctx = getContext();
        Uri apkUri;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            apkUri = FileProvider.getUriForFile(
                    ctx, ctx.getPackageName() + ".fileprovider", apkFile);
        } else {
            apkUri = Uri.fromFile(apkFile);
        }
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        ctx.startActivity(intent);
    }
}
