import type { Metadata } from 'next';

import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: '隐私政策 - kyrinMedia',
  description:
    'kyrinMedia 隐私政策：本站收集哪些数据、收藏与播放记录存在哪里、Cookie 与 Google AdSense 广告如何使用你的信息、如何联系我们删除数据。',
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title='隐私政策'
      description='最后更新：2026 年 11 月 25 日。本政策说明 kyrinMedia（moontv.hookjune.qzz.io）收集哪些信息、用来做什么、以及你有哪些选择。'
    >
      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          我们收集的信息
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>账号信息（仅注册用户）：</strong>
            注册时提供的用户名与密码（密码经加密存储）。不注册也可以浏览与观看本站大部分内容。
          </li>
          <li>
            <strong>收藏与播放记录：</strong>
            你收藏的影片、播放进度、搜索历史默认保存在你自己的浏览器本地（localStorage）或账号下，用于“继续观看”和收藏夹功能，不会出售给第三方。
          </li>
          <li>
            <strong>设备与使用信息：</strong>
            访问时服务器会记录常规的访问日志，如 IP
            地址、浏览器类型、访问时间，用于排查故障与统计访问量。
          </li>
        </ul>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          Cookie 与广告
        </h2>
        <p>
          本站使用 Google AdSense
          展示广告。Google
          及其合作伙伴可能会使用 Cookie，根据你对本网站或其他网站的访问记录来展示广告。你可以访问
          Google 广告设置选择停用个性化广告，也可以清除浏览器 Cookie
          后继续使用本站。站内点播前的贴片广告由 Google Ad Manager
          提供，同样可能使用 Cookie 记录广告展示情况。
        </p>
        <p>
          除广告服务外，本站还在浏览器本地保存少量偏好设置（如主题、公告已读状态、管理员免广告标记），仅用于改善你自己的浏览体验。
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          第三方服务
        </h2>
        <p>
          本站展示的影片海报、评分等信息来自豆瓣等公开信息源；实际播放内容来自第三方网站，点击播放即跳转到第三方服务，其隐私做法以对方政策为准，本站不承担责任。站内图片经过本站的图片代理加载，仅用于加速与防盗链，不会额外收集你的个人信息。
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          数据保存与删除
        </h2>
        <p>
          浏览器本地的收藏与播放记录只存在你自己的设备上，清除浏览器数据即可删除。注册账号的数据保存在本站服务器上；如果你希望注销账号或删除账号数据，请通过站内反馈渠道联系站长核实处理。访问日志仅用于运维排查，会定期清理。
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          未成年人
        </h2>
        <p>
          本站不对未成年人提供定向服务；站内设有内容过滤，默认屏蔽不适宜内容。如果你是未成年人的监护人，发现孩子在使用本站，请自行管理其设备访问。
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          政策变更与联系
        </h2>
        <p>
          本政策可能随服务变化而更新，更新后会在本页标注新的最后更新日期。关于隐私的任何问题或删除数据的请求，请通过站内反馈渠道联系站长。
        </p>
      </section>
    </ContentPage>
  );
}
