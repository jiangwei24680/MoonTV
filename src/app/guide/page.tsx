import type { Metadata } from 'next';
import Link from 'next/link';

import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: '使用指南 - kyrinMedia',
  description:
    'kyrinMedia 使用指南：怎么找片、怎么收藏和继续观看、直播频道怎么选、换源失败怎么办、常见问题一次说清。',
};

export default function GuidePage() {
  return (
    <ContentPage
      title='使用指南'
      description='第一次来 kyrinMedia？这篇指南讲清楚找片、收藏、续播、直播和常见问题的处理办法。'
    >
      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          找片：三种办法
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>首页热门栏目：</strong>
            首页按热门电影、热门剧集、热门综艺三个栏目展示当前热度靠前的作品，左右滑动可以翻更多，点“查看更多”进完整榜单。
          </li>
          <li>
            <strong>搜索：</strong>
            顶部搜索框输入片名就能搜，支持电影、剧集、综艺一起查。搜不到可以换个名字试试，比如去掉“第 X 季”或用别名。
          </li>
          <li>
            <strong>影单推荐：</strong>
            不知道看什么就去
            <Link href='/articles' className='text-sky-600 dark:text-sky-400'>
              影单推荐
            </Link>
            ，编辑每月按豆瓣评分整理的热门片单，照着评分挑基本不踩雷。
          </li>
        </ul>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          收藏与继续观看
        </h2>
        <p>
          点开一部片子，点收藏就会进“收藏夹”，首页顶部可以切换查看。看到一半退出不用怕：下次打开同一部片子，站内会问你是“继续播放”还是“重头播放”，选继续就能从上次断的地方接着看。收藏和播放记录默认保存在你的浏览器本地，换浏览器或清缓存会丢失；注册账号后会跟着账号走。
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          电视直播
        </h2>
        <p>
          点侧边栏的“直播”进入直播页，先选国家或地区，再选频道。美国
          FAST 专区是免费流媒体频道合集。某个频道播不了时，先换一个同频道的备用源；如果一批频道都播不了，一般是源站临时维护，过一阵再来。
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          播不了怎么办
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>换源：</strong>
            播放页一般有多个播放源，一个源失败就换下一个；剧集还可以逐集试。
          </li>
          <li>
            <strong>刷新重试：</strong>
            网络抖动会导致加载失败，刷新一次页面再点播放，很多时候就好了。
          </li>
          <li>
            <strong>跳过片头片尾：</strong>
            播放器上有跳过片头、片尾的按钮，点一下直接进正片。
          </li>
          <li>
            <strong>弹幕：</strong>
            播放器支持本地弹幕，自己发的弹幕只存在本地，不会同步给别人。
          </li>
        </ul>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          广告说明
        </h2>
        <p>
          本站免费，靠广告维持运营：打开应用会先播一次全屏开屏广告，点播前会先播一段贴片广告，点“取消”可以跳过贴片直接不播，页面底部还有一条横幅广告。广告播完才会开始放片，这是为了让站能一直免费开下去。
        </p>
      </section>

      <section>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          常见问题
        </h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>要注册吗？</strong>
            不用。游客可以直接浏览、搜索、观看；注册只是为了把收藏和播放记录跟着账号走。
          </li>
          <li>
            <strong>要钱吗？</strong>
            不要。本站没有会员、没有付费墙，所有功能对访客免费。
          </li>
          <li>
            <strong>手机能看吗？</strong>
            能。网站做了移动端适配，也有安卓 App（kyrinMedia），App
            里同样免费。
          </li>
          <li>
            <strong>片子从哪来？</strong>
            播放内容来自第三方网站，本站不存储视频，见
            <Link href='/about' className='text-sky-600 dark:text-sky-400'>
              关于我们
            </Link>
            里的来源说明。
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
