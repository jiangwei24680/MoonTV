package io.hookjune.moontv;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.moontv.updater.AppUpdaterPlugin;

/**
 * CI 在 npx cap add android 之后用此文件覆盖默认的 MainActivity，
 * 以注册 AppUpdater 插件（应用内更新：下载 APK 并调起安装）。
 */
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AppUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
