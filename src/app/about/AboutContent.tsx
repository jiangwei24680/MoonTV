'use client';

import Link from 'next/link';

import ContentPage from '@/components/ContentPage';
import { useLanguage } from '@/components/LanguageProvider';

export default function AboutContent() {
  const { t } = useLanguage();
  return (
    <ContentPage
      title={t('关于 kyrinMedia')}
      description={t('kyrinMedia（原 MoonTV）是一个免费的影视聚合站点，帮你在一个地方找到想看的电影、剧集、综艺和电视直播。')}
    >
      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('本站是什么')}
        </h2>
        <p>
          {t('kyrinMedia 聚合了多个公开影视信息源的检索入口：首页按热门电影、热门剧集、热门综艺三个栏目展示当前热度靠前的作品，每个作品都标注了豆瓣评分与年份，点进去可以搜索播放源、查看详情。站内还有电视直播频道，覆盖多个国家与地区的公开频道，以及美国 FAST 专区。')}
        </p>
        <p>
          {t('本站不存储任何视频资源，不提供视频下载；播放内容均来自第三方网站，版权归原权利方所有。站名 kyrinMedia 取自站长的儿子蒋骐睿的英文名 kyrin，麒麟的英文谐音，也是本站的标志。')}
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('能在这里找到什么')}
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>{t('热门电影：')}</strong>
            {t('当前热度靠前的院线与网络电影，按豆瓣评分排序展示，可一键搜索播放源。')}
          </li>
          <li>
            <strong>{t('热门剧集：')}</strong>
            {t('在播与完结的热门国产剧、海外剧，支持按集选集、断点续播。')}
          </li>
          <li>
            <strong>{t('热门综艺：')}</strong>
            {t('真人秀、脱口秀、纪录片等综艺节目，更新后自动出现在栏目里。')}
          </li>
          <li>
            <strong>{t('电视直播：')}</strong>
            {t('多个国家与地区的公开直播频道，按国家选择，另有美国 FAST 免费流媒体专区。')}
          </li>
          <li>
            <strong>{t('影单推荐：')}</strong>
            {t('编辑每月整理的站内热门片单，见')}
            <Link href='/articles' className='text-sky-600 dark:text-sky-400'>
              {t('影单推荐')}
            </Link>
            {t('，按评分挑片不踩雷。')}
          </li>
        </ul>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('怎么用')}
        </h2>
        <p>
          {t('打开首页就能直接浏览热门内容，不用注册也能看。点一张海报可以查看详情、搜索播放源；喜欢的片子点收藏，会保存在你的浏览器或账号里，下次从收藏夹继续看；看到一半退出，下次打开会提示从上次的位置继续播放。详细步骤见')}
          <Link href='/guide' className='text-sky-600 dark:text-sky-400'>
            {t('使用指南')}
          </Link>
          {t('。')}
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('内容来源与免责')}
        </h2>
        <p>
          {t('本站展示的影片海报、评分、年份等信息来自豆瓣等公开信息源，仅供检索参考；播放源来自第三方网站，本站不对第三方内容的准确性、合法性、完整性负责，也不存储、上传任何视频文件。如果你是权利方，认为站内某条信息侵犯了你的权益，请通过站内反馈渠道联系我们核实处理。')}
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {t('费用与广告')}
        </h2>
        <p>
          {t('本站对访客完全免费，没有会员、没有付费墙。网站通过展示广告维持运营：打开应用时会播一次全屏开屏广告，点播前会先播一段贴片广告（可取消），页面底部有横幅广告。站长本人使用管理员入口可免广告，普通访客看不到这个入口。')}
        </p>
      </section>
    </ContentPage>
  );
}
