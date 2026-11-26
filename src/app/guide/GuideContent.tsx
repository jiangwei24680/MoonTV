'use client';

import Link from 'next/link';

import ContentPage from '@/components/ContentPage';
import { useLanguage } from '@/components/LanguageProvider';

export default function GuideContent() {
  const { t } = useLanguage();
  return (
    <ContentPage
      title={t('使用指南')}
      description={t('第一次来 kyrinMedia？这篇指南讲清楚找片、收藏、续播、直播和常见问题的处理办法。')}
    >
      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('找片：三种办法')}
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>{t('首页热门栏目：')}</strong>
            {t('首页按热门电影、热门剧集、热门综艺三个栏目展示当前热度靠前的作品，左右滑动可以翻更多，点“查看更多”进完整榜单。')}
          </li>
          <li>
            <strong>{t('搜索：')}</strong>
            {t('顶部搜索框输入片名就能搜，支持电影、剧集、综艺一起查。搜不到可以换个名字试试，比如去掉“第 X 季”或用别名。')}
          </li>
          <li>
            <strong>{t('影单推荐：')}</strong>
            {t('不知道看什么就去')}
            <Link href='/articles' className='text-sky-600 dark:text-sky-400'>
              {t('影单推荐')}
            </Link>
            {t('，编辑每月按豆瓣评分整理的热门片单，照着评分挑基本不踩雷。')}
          </li>
        </ul>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('收藏与继续观看')}
        </h2>
        <p>
          {t('点开一部片子，点收藏就会进“收藏夹”，首页顶部可以切换查看。看到一半退出不用怕：下次打开同一部片子，站内会问你是“继续播放”还是“重头播放”，选继续就能从上次断的地方接着看。收藏和播放记录默认保存在你的浏览器本地，换浏览器或清缓存会丢失；注册账号后会跟着账号走。')}
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('电视直播')}
        </h2>
        <p>
          {t('点侧边栏的“直播”进入直播页，先选国家或地区，再选频道。美国 FAST 专区是免费流媒体频道合集。某个频道播不了时，先换一个同频道的备用源；如果一批频道都播不了，一般是源站临时维护，过一阵再来。')}
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('播不了怎么办')}
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>{t('换源：')}</strong>
            {t('播放页一般有多个播放源，一个源失败就换下一个；剧集还可以逐集试。')}
          </li>
          <li>
            <strong>{t('刷新重试：')}</strong>
            {t('网络抖动会导致加载失败，刷新一次页面再点播放，很多时候就好了。')}
          </li>
          <li>
            <strong>{t('跳过片头片尾：')}</strong>
            {t('播放器上有跳过片头、片尾的按钮，点一下直接进正片。')}
          </li>
          <li>
            <strong>{t('弹幕：')}</strong>
            {t('播放器支持本地弹幕，自己发的弹幕只存在本地，不会同步给别人。')}
          </li>
        </ul>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('广告说明')}
        </h2>
        <p>
          {t('本站免费，靠广告维持运营：打开应用会先播一次全屏开屏广告，点播前会先播一段贴片广告，点“取消”可以跳过贴片直接不播，页面底部还有一条横幅广告。广告播完才会开始放片，这是为了让站能一直免费开下去。')}
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('常见问题')}
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>{t('要注册吗？')}</strong>
            {t('不用。游客可以直接浏览、搜索、观看；注册只是为了把收藏和播放记录跟着账号走。')}
          </li>
          <li>
            <strong>{t('要钱吗？')}</strong>
            {t('不要。本站没有会员、没有付费墙，所有功能对访客免费。')}
          </li>
          <li>
            <strong>{t('手机能看吗？')}</strong>
            {t('能。网站做了移动端适配，也有安卓 App（kyrinMedia），App 里同样免费。')}
          </li>
          <li>
            <strong>{t('片子从哪来？')}</strong>
            {t('播放内容来自第三方网站，本站不存储视频，见')}
            <Link href='/about' className='text-sky-600 dark:text-sky-400'>
              {t('关于我们')}
            </Link>
            {t('里的来源说明。')}
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
