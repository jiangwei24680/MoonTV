// Capacitor 配置：App 壳直接加载线上站，网站更新后 App 自动同步，无需重新打包
const config = {
  appId: 'io.hookjune.moontv',
  appName: 'MoonTV',
  webDir: 'www',
  server: {
    url: 'https://moontv.hookjune.qzz.io',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
