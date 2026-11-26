// 中英界面字典：中文原文作 key，值是英文翻译。
// 语言切换默认中文，选择存 localStorage（kyrinmedia-lang）。
// 豆瓣/直播等数据源自带的名字（影片标题、频道名）不在这里，它们是数据不是界面文案。

export type Language = 'zh' | 'en';

export const LANG_STORAGE_KEY = 'kyrinmedia-lang';

export const dict: Record<string, string> = {
  // —— 导航 / 首页 ——
  '首页': 'Home',
  '搜索': 'Search',
  '收藏夹': 'Favorites',
  '影单': 'Watchlists',
  '直播': 'Live TV',
  '电影': 'Movies',
  '电视剧': 'TV Shows',
  '综艺': 'Variety',
  '剧集': 'Episodes',
  '全部': 'All',
  '热门': 'Trending',
  '热门电影': 'Trending Movies',
  '最新': 'Latest',
  '最新电影': 'Latest Movies',
  '豆瓣高分': 'Top Rated on Douban',
  '冷门佳片': 'Hidden Gems',
  '华语': 'Chinese',
  '国产': 'Chinese (Mainland)',
  '日本': 'Japanese',
  '韩国': 'Korean',
  '欧美': 'Western',
  '国内': 'Domestic',
  '国外': 'International',
  '动漫': 'Anime',
  '纪录片': 'Documentary',
  '自定义': 'Custom',
  '未分类': 'Uncategorized',
  // —— 搜索 ——
  '搜索电影、电视剧...': 'Search movies, TV shows…',
  '删除搜索历史': 'Clear search history',
  '搜索失败': 'Search failed',
  '未找到匹配结果': 'No matching results',
  // —— 播放页 ——
  '影片标题': 'Video Title',
  '播放下一集': 'Play next episode',
  '显示': 'Show',
  '隐藏': 'Hide',
  '显示选集面板': 'Show episode panel',
  '隐藏选集面板': 'Hide episode panel',
  '快进 10 秒': 'Forward 10s',
  '快退 10 秒': 'Back 10s',
  '快进 85 秒': 'Forward 85s',
  '快进 {n} 秒': 'Forward {n}s',
  '快退 {n} 秒': 'Back {n}s',
  '音量 {n}%': 'Volume {n}%',
  '亮度调节仅 App 内可用': 'Brightness control is only available in the App',
  '2x 加速中…': '2x speed…',
  '视频加载中...': 'Loading video…',
  '正在搜索播放源...': 'Searching for sources…',
  '切换播放源...': 'Switching source…',
  '⚡ 正在优选最佳播放源...': '⚡ Finding the best source…',
  '✨ 准备就绪，即将开始播放...': '✨ Ready, starting playback…',
  '🎬 正在获取视频详情...': '🎬 Loading video details…',
  '🔍 正在搜索播放源...': '🔍 Searching for sources…',
  '换源失败': 'Failed to switch source',
  '播放器初始化失败': 'Failed to initialize player',
  '获取视频详情失败': 'Failed to load video details',
  '视频地址无效': 'Invalid video URL',
  '缺少必要参数': 'Missing required parameters',
  '获取数据失败': 'Failed to load data',
  '没有找到对应的分类': 'Category not found',
  '播放出错，该频道可能已失效': 'Playback error. This channel may be unavailable',
  '网络错误，直播源连接失败': 'Network error. Failed to connect to the live source',
  '删除跳过配置': 'Delete skip settings',
  '设置片头': 'Set intro',
  '设置片头时间': 'Set intro time',
  '设置片尾': 'Set outro',
  '设置片尾时间': 'Set outro time',
  '跳过片头片尾': 'Skip intro / outro',
  '跳过片头': 'Skip intro',
  '跳到片尾': 'Skip to credits',
  '跳到片尾前 90 秒': '90s before credits',
  '已从上次进度 {time} 继续播放': 'Resumed from {time}',
  '选集索引无效，当前共 {n} 集': 'Invalid episode index. This series has {n} episodes in total',
  '第 {n} 集': 'Episode {n}',
  '← 返回上页': '← Back',
  '🔍 返回搜索': '🔍 Back to Search',
  '去广告': 'Block Ads',
  '已开启': 'On',
  '已关闭': 'Off',
  '当前开启': 'Currently on',
  '当前关闭': 'Currently off',
  // —— 收藏 / 播放记录 ——
  '切换收藏状态失败': 'Failed to update favorite',
  '删除播放记录失败': 'Failed to delete play record',
  '检查收藏状态失败': 'Failed to check favorite status',
  // —— 豆瓣页 ——
  '加载中...': 'Loading…',
  '已加载全部内容': 'All content loaded',
  '暂无相关内容': 'No related content',
  // —— 直播 ——
  '搜索频道…': 'Search channels…',
  '输入直播 .m3u8 或 .php 地址': 'Enter a live .m3u8 or .php URL',
  ' · 美国 FAST 专区需海外网络': ' · US FAST zone requires an overseas network',
  '暂无频道': 'No channels',
  '没有找到匹配的频道': 'No matching channels found',
  '频道列表加载失败，请检查网络后重试': 'Failed to load channel list. Please check your network and try again',
  '频道加载中…': 'Loading channels…',
  '加载频道中…': 'Loading channels…',
  // —— 登录 / 注册 ——
  '登录': 'Log In',
  '登录中...': 'Logging in…',
  '注册': 'Sign Up',
  '注册中...': 'Signing up…',
  '密码错误': 'Wrong password',
  '服务器错误': 'Server error',
  '网络错误，请稍后重试': 'Network error. Please try again later',
  '输入用户名': 'Enter username',
  '输入访问密码': 'Enter password',
  '有新版本': 'New version available',
  '已是最新': 'Up to date',
  // —— 用户菜单 / 设置 ——
  '设置': 'Settings',
  '本地设置': 'Local Settings',
  '界面语言': 'Language',
  '修改密码': 'Change Password',
  '两次输入的密码不一致': 'The two passwords do not match',
  '新密码不得为空': 'New password cannot be empty',
  '修改密码失败': 'Failed to change password',
  '请输入新密码': 'Enter new password',
  '请再次输入新密码': 'Enter the new password again',
  '修改中...': 'Saving…',
  '确认修改': 'Confirm',
  '重置为默认设置': 'Reset to defaults',
  '登出': 'Log Out',
  '管理面板': 'Admin Panel',
  '检查 App 更新': 'Check for App Updates',
  '用户': 'User',
  '站长': 'Site Owner',
  '管理员': 'Admin',
  '本地': 'Local',
  '请输入管理员口令': 'Enter admin passcode',
  '免广告已开启': 'Ad-free enabled',
  '免广告已关闭': 'Ad-free disabled',
  // —— App 更新 ——
  '已是最新版本': 'Already the latest version',
  '正在检查更新…': 'Checking for updates…',
  '正在下载更新包…': 'Downloading update…',
  '下载完成后会自动弹出安装界面': 'The install screen will pop up after the download finishes',
  '是否立即更新？': 'Update now?',
  '发现新版本 v{version}': 'New version v{version} available',
  '立即更新': 'Update Now',
  '稍后': 'Later',
  '取消': 'Cancel',
  '需要授权': 'Permission Required',
  '去设置': 'Go to Settings',
  '请先允许本应用"安装未知应用"。': 'Please allow this app to "Install unknown apps" first.',
  '请在系统设置中允许本应用"安装未知应用"，然后重新点击更新。': 'Please allow this app to "Install unknown apps" in system settings, then tap Update again.',
  '检查更新失败': 'Update check failed',
  '请检查网络后重试': 'Please check your network and try again',
  '版本信息获取失败': 'Failed to get version info',
  '正在尝试备用下载地址…': 'Trying backup download…',
  // —— 广告 ——
  '广告': 'Ad',
  '跳过广告': 'Skip Ad',
  '{n}s 后可跳过': 'Skip in {n}s',
  // —— 通用 ——
  '关闭': 'Close',
  '关闭错误提示': 'Dismiss error',
  '返回顶部': 'Back to top',
  '刷新重试：': 'Refresh and retry:',
  '关于 kyrinMedia': 'About kyrinMedia',
  '使用指南': 'User Guide',
  '影单推荐': 'Watchlist Picks',
  '隐私政策': 'Privacy Policy',
  '返回首页': 'Back to Home',
  // —— 指南 / 关于 / 隐私 / 警告页正文 ——
  '搜索：': 'Search:',
  '换源：': 'Switch source:',
  '跳过片头片尾：': 'Skip intro / outro:',
  '弹幕：': 'Danmaku:',
  '首页热门栏目：': 'Home sections:',
  '手机能看吗？': 'Can I watch on my phone?',
  '要注册吗？': 'Do I need to register?',
  '要钱吗？': 'Is it free?',
  '片子从哪来？': 'Where do the videos come from?',
  '电视直播：': 'Live TV:',
  '热门电影：': 'Trending movies:',
  '热门剧集：': 'Trending shows:',
  '热门综艺：': 'Trending variety:',
  '影单推荐：': 'Watchlist picks:',
  '收藏与播放记录：': 'Favorites & history:',
  '设备与使用信息：': 'Device & usage info:',
  '账号信息（仅注册用户）：': 'Account info (registered users only):',
  '为确保系统安全性和合规性，请及时完成安全配置': 'To keep the system secure and compliant, please finish the security setup soon',
  '可能收到相关权利方的法律通知': 'You may receive legal notices from rights holders',
  '服务器资源可能被滥用，影响正常服务': 'Server resources may be abused, affecting normal service',
  '服务提供商可能因合规问题终止服务': 'The provider may suspend service over compliance issues',
  '未经授权的访问可能导致内容被恶意传播': 'Unauthorized access may lead to content being spread without permission',
  '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。':
    'This site only provides video search. All content comes from third-party sites. We do not host any videos and are not responsible for the accuracy, legality, or completeness of any content.',
  // —— 设置面板 ——
  '用户名': 'Username',
  '默认聚合搜索结果': 'Aggregate search results by default',
  '搜索时默认按标题和年份聚合显示结果': 'Search results are grouped by title and year by default',
  '启用优选和测速': 'Enable source optimization & speed test',
  '如出现播放器劫持问题可关闭': 'Turn off if the player gets hijacked',
  '启用豆瓣代理': 'Enable Douban proxy',
  '启用后，豆瓣数据将通过代理服务器获取': 'When enabled, Douban data is fetched via the proxy',
  '豆瓣代理地址': 'Douban proxy URL',
  '仅在启用豆瓣代理时生效，留空则使用服务器 API': 'Only applies when the Douban proxy is enabled. Leave empty to use the server API',
  '启用图片代理': 'Enable image proxy',
  '启用后，所有图片加载将通过代理服务器': 'When enabled, all images load via the proxy',
  '图片代理地址': 'Image proxy URL',
  '仅在启用图片代理时生效': 'Only applies when the image proxy is enabled',
  '这些设置保存在本地浏览器中': 'These settings are saved in your browser',
  '新密码': 'New password',
  '确认密码': 'Confirm password',
  '修改密码后需要重新登录': 'You will need to log in again after changing your password',
  '重置': 'Reset',
  '切换界面语言，立即生效': 'Switch the interface language. Takes effect immediately',
  '当前用户': 'Current User',
  '数据存储：': 'Storage:',
  '密码': 'Password',
  // 子代理 A 汇报的字典外串（2026-11-26）
  '我的收藏': 'My Favorites',
  '清空': 'Clear',
  '暂无收藏内容': 'No favorites yet',
  '查看更多': 'View More',
  '热门剧集': 'Popular TV Shows',
  '热门综艺': 'Popular Variety Shows',
  '是一个免费的影视聚合站：热门电影、热门剧集、热门综艺一站搜索，点开海报就能找播放源；喜欢的片子可以收藏，看到一半下次接着看；站内还有多个国家与地区的电视直播频道。不知道看什么的时候，可以去':
    'is a free video aggregation site: search popular movies, TV shows, and variety shows in one place, click a poster to find playback sources; favorite the titles you like and resume where you left off; the site also carries live TV channels from many countries and regions. When you don\'t know what to watch, check out the',
  '按豆瓣评分挑片，或者看': 'to pick titles by Douban rating, or read the',
  '了解收藏、续播与换源的办法。本站不存储任何视频资源，播放内容来自第三方网站，详情见':
    'to learn how favorites, resume playback, and source switching work. This site stores no video resources; playback content comes from third-party sites. See the',
  '关于我们': 'About Us',
  '提示': 'Notice',
  '我知道了': 'Got it',
  '搜索结果': 'Search Results',
  '聚合': 'Aggregated',
  '未找到相关结果': 'No results found',
  '搜索历史': 'Search History',
  '来自豆瓣的精选内容': 'Handpicked content from Douban',
  '共 {n} 个频道': '{n} channels in total',
  '请选择一个频道开始播放': 'Select a channel to start playing',
  '正在播放：': 'Now Playing:',
  '添加': 'Add',
  '站内内容': 'Site Content',
  '继续观看': 'Continue Watching',
  '分类': 'Category',
  '地区': 'Region',
  '类型': 'Type',
  '片单': 'Lists',
  // 子代理 B 汇报的字典外串（2026-11-26，播放页/播放器）
  '{n} 集': '{n} episodes',
  '哎呀，出现了一些问题': 'Oops, something went wrong',
  '封面图片': 'Cover image',
  '已跳过片头 ({time})': 'Skipped intro ({time})',
  '已跳过片尾 ({time})': 'Skipped outro ({time})',
  '影片匹配有误？点击去搜索': 'Wrong match? Tap to search',
  '换源': 'Switch Source',
  '搜索中...': 'Searching...',
  '无测速数据': 'No speed test data',
  '暂无可用的换源': 'No alternative sources available',
  '检测失败': 'Detection failed',
  '观看一段广告后开始播放本集': 'Watch an ad to start this episode',
  '观看广告后开始播放': 'Play after watching the ad',
  '请检查网络连接或尝试刷新页面':
    'Please check your network connection or try refreshing the page',
  '选集': 'Episodes',
  '重试': 'Retry',
  '音量: {n}': 'Volume: {n}',
  '🔄 重新尝试': '🔄 Try again',
  '确认': 'Confirm',
  '完成': 'Done',
  '管理员免广告': 'Admin Ad-Free',
  '当前状态：': 'Current status: ',
  '{n}源': '{n} sources',
  // 影单页（2026-11-26）
  '不知道看什么的时候，就照着这份单子挑：每月按站内热度与豆瓣评分整理一次，只列当前能在站内找到的热门作品。':
    'Not sure what to watch? Pick from this list: updated monthly by on-site popularity and Douban rating, listing only hot titles currently available on the site.',
  '2026 年 11 月热门电影推荐': 'November 2026 Popular Movie Picks',
  '本周站内热度靠前的电影，豆瓣评分 8 分以上的有 4 部，最高 8.6 分。':
    "This week's hottest movies on the site; 4 titles rated 8+ on Douban, highest 8.6.",
  '2026 年 11 月热门剧集推荐': 'November 2026 Popular TV Show Picks',
  '在播与完结的热门剧集，最高 8.9 分，悬疑、历史、都市题材都有。':
    'Hot ongoing and completed shows, highest 8.9; mystery, historical, and urban dramas included.',
  '2026 年 11 月热门综艺推荐': 'November 2026 Popular Variety Show Picks',
  '真人秀、脱口秀、纪录片与农场题材，最高 9.6 分，口碑综艺扎堆。':
    'Reality shows, talk shows, documentaries, and farm life; highest 9.6, packed with acclaimed variety shows.',
  '榜单的评分是豆瓣评分，取自本站首页展示的数据；片单按热度排，评分会随时间变化，页面上标注的分数以整理当月为准，最新分数以影片详情页为准。点片名可以在站内直接搜索播放源。':
    "Ratings on these lists are Douban ratings taken from the data shown on the homepage; lists are ordered by popularity, and ratings change over time — the scores shown are as of the month of compilation, with the latest scores on each title's detail page. Tap a title to search for playback sources on the site.",
  '怎么用这份单子': 'How to use these lists',
  '先看评分：8 分以上基本可以闭眼入，7 分以上值得一试，6 分以下建议先看简介再决定。想直接开看的，点进文章里的片名链接去站内搜索；想慢慢挑的，也可以去首页热门栏目里左右滑动，按自己的口味选。':
    'Check the rating first: 8+ is a safe bet, 7+ is worth a try, and below 6, read the synopsis before deciding. To start watching right away, tap a title link in an article to search on the site; to browse at leisure, swipe through the trending sections on the homepage and pick by taste.',
  '整理时间：2026 年 11 月 25 日。评分均为整理当日站内展示的豆瓣评分，片单会随热度变化，最新评分以影片详情页为准。':
    "Compiled: November 25, 2026. All ratings are the Douban ratings shown on the site on the day of compilation; the list changes with popularity, and the latest ratings are on each film's detail page.",
  '整理时间：2026 年 11 月 25 日。评分均为整理当日站内展示的豆瓣评分，片单会随热度变化，最新评分以剧集详情页为准。':
    "Compiled: November 25, 2026. All ratings are the Douban ratings shown on the site on the day of compilation; the list changes with popularity, and the latest ratings are on each show's detail page.",
  '整理时间：2026 年 11 月 25 日。评分均为整理当日站内展示的豆瓣评分，片单会随热度变化，最新评分以节目详情页为准。':
    "Compiled: November 25, 2026. All ratings are the Douban ratings shown on the site on the day of compilation; the list changes with popularity, and the latest ratings are on each show's detail page.",
  '11 月站内热门电影整体口碑不错：20 部热门电影里有 4 部评分在 8 分以上，7 分以上的占一半。想稳妥的优先看 8 分档，想尝鲜的可以从 7 分档里按题材挑。':
    "November's trending movies on the site are well received overall: of the 20 trending movies, 4 are rated 8+, and half are 7+. For a safe pick, start with the 8+ tier; to try something new, browse the 7+ tier by genre.",
  '11 月站内热门剧集口碑整体比电影还高：20 部热门剧集里 7 部评分在 8 分以上，最高 8.9 分。悬疑、历史、都市题材都有，想追长剧的优先看 8 分档。':
    "November's trending shows are rated even higher than the movies overall: of the 20 trending shows, 7 are rated 8+, highest 8.9. Mystery, historical, and urban dramas are all here — for a long series, start with the 8+ tier.",
  '11 月站内热门综艺口碑是三个栏目里最高的：20 部热门综艺里 9 部评分在 8 分以上，最高 9.6 分。农场、美食、推理、旅行题材都有，下饭综艺扎堆，想放松的直接按这个单子看。':
    'November\'s trending variety shows are the best rated of the three sections: of the 20 trending shows, 9 are rated 8+, highest 9.6. Farm life, food, mystery, and travel are all here — a heap of easy-watching shows, so just pick from this list to unwind.',
  '本月片单（按评分排序）': "This month's list (sorted by rating)",
  '豆瓣 {rate} 分': 'Douban {rate}',
  '除了上面这 10 部，站内热门栏目里还有《野兽之心》《逃出布迪秀》《生化危机：爆发夜》等 7 分档作品，喜欢对应题材的也可以去首页热门电影栏目里翻一翻。看片前可以先点进详情页看简介与评分，再决定要不要花时间。':
    'Besides the 10 titles above, the trending section also has 7-tier titles such as 《野兽之心》《逃出布迪秀》《生化危机：爆发夜》 — fans of those genres can browse the trending movies section on the homepage. Before watching, check the synopsis and rating on the detail page to decide if it\'s worth your time.',
  '追剧建议先确认更新状态：在播的剧可以收藏起来慢慢追，站内会记录你看到第几集，下次打开直接提示继续播放；完结的剧可以一次刷完。除了上面这 10 部，《两京十五日》《宝珠》《醉梦》等也在站内热门剧集栏目里，喜欢历史与古装题材的可以去翻翻。':
    'Before following a show, check its update status: ongoing shows can be favorited and followed at your pace — the site remembers which episode you reached and prompts you to resume next time; completed shows can be binged in one go. Besides the 10 titles above, 《两京十五日》《宝珠》《醉梦》 and others are also in the trending shows section — fans of historical and costume dramas can browse there.',
  '综艺适合碎片时间看：站内会记录播放进度，看到一半退出，下次打开同一节目会提示继续播放。除了上面这 10 部，《花儿与少年 第八季》《奔跑吧·大湾区篇》《脱口秀和Ta的朋友们 第三季》等也在站内热门综艺栏目里，喜欢旅行与脱口秀的可以去翻翻。':
    'Variety shows are great for spare moments: the site remembers your playback progress, so if you leave halfway, it prompts you to resume when you open the same show again. Besides the 10 titles above, 《花儿与少年 第八季》《奔跑吧·大湾区篇》《脱口秀和Ta的朋友们 第三季》 and others are also in the trending variety section — fans of travel and talk shows can browse there.',
  '本月站内评分最高的电影。': 'The highest-rated movie on the site this month.',
  '本月站内评分最高的剧集。': 'The highest-rated show on the site this month.',
  '本月站内评分最高的综艺。': 'The highest-rated variety show on the site this month.',
  '评分 8 分以上，热度靠前。': 'Rated 8+, trending high.',
  '站内热门电影前列。': "Among the site's top trending movies.",
  '接近 8 分，值得一看。': 'Near 8, worth watching.',
  '评分稳定在 7 分档上游。': 'Solidly in the upper 7s.',
  '口碑中等偏上。': 'Above-average word of mouth.',
  '7 分档，可按口味挑选。': 'In the 7s — pick by taste.',
  '评分接近 9 分，热度靠前。': 'Near 9, trending high.',
  '8 分档上游。': 'Upper 8s.',
  '悬疑题材，评分 8 分以上。': 'Mystery, rated 8+.',
  '评分 8 分以上。': 'Rated 8+.',
  '评分 8 分，站内热门剧集前列。': "Rated 8, among the site's top trending shows.",
  '接近 8 分，值得一追。': 'Near 8, worth following.',
  '7 分档上游。': 'Upper 7s.',
  '评分 9 分，情怀向特辑。': 'Rated 9, a nostalgic special.',
  '美食题材，评分 8 分以上。': 'Food-themed, rated 8+.',
  '影迷向，评分 8 分以上。': 'For film buffs, rated 8+.',
  '推理竞技题材。': 'Mystery competition.',
  '旅行真人秀，评分 8 分。': 'Travel reality show, rated 8.',
  '接近 8 分，轻松下饭。': 'Near 8, light and easy watching.',
  // 内容页 guide/about/privacy/warning（2026-11-26，子代理 C 清单）
  '第一次来 kyrinMedia？这篇指南讲清楚找片、收藏、续播、直播和常见问题的处理办法。':
    'New to kyrinMedia? This guide covers finding titles, favorites, resume playback, live TV, and common issues.',
  '找片：三种办法': 'Finding titles: three ways',
  '首页按热门电影、热门剧集、热门综艺三个栏目展示当前热度靠前的作品，左右滑动可以翻更多，点“查看更多”进完整榜单。':
    'The home page shows the hottest titles in three sections — Trending Movies, Trending Shows, and Trending Variety. Swipe sideways for more, or tap “View More” for the full chart.',
  '顶部搜索框输入片名就能搜，支持电影、剧集、综艺一起查。搜不到可以换个名字试试，比如去掉“第 X 季”或用别名。':
    'Type a title in the search box at the top to search movies, shows, and variety together. If nothing comes up, try another name — for example, drop the season number (“Season X”) or use an alternate title.',
  '不知道看什么就去': "If you don't know what to watch, head to the",
  '，编辑每月按豆瓣评分整理的热门片单，照着评分挑基本不踩雷。':
    ', a monthly list of popular titles picked by our editors by Douban rating — follow the ratings and you can hardly go wrong.',
  '收藏与继续观看': 'Favorites & resume watching',
  '点开一部片子，点收藏就会进“收藏夹”，首页顶部可以切换查看。看到一半退出不用怕：下次打开同一部片子，站内会问你是“继续播放”还是“重头播放”，选继续就能从上次断的地方接着看。收藏和播放记录默认保存在你的浏览器本地，换浏览器或清缓存会丢失；注册账号后会跟着账号走。':
    'Open a title and tap Favorite to add it to your “Favorites”, which you can switch to from the top of the home page. If you leave halfway, don\'t worry: next time you open the same title, the site will ask whether to “Resume” or “Play from start” — choose Resume to pick up where you left off. Favorites and playback history are saved in your browser by default, so they are lost if you switch browsers or clear the cache; after registering, they follow your account.',
  '电视直播': 'Live TV',
  '点侧边栏的“直播”进入直播页，先选国家或地区，再选频道。美国 FAST 专区是免费流媒体频道合集。某个频道播不了时，先换一个同频道的备用源；如果一批频道都播不了，一般是源站临时维护，过一阵再来。':
    'Tap “Live TV” in the sidebar to open the live page, pick a country or region first, then a channel. The US FAST zone is a collection of free streaming channels. If a channel won\'t play, try another backup source for the same channel; if a whole batch of channels fails, the source site is usually under temporary maintenance — come back later.',
  '播不了怎么办': 'What to do when playback fails',
  '播放页一般有多个播放源，一个源失败就换下一个；剧集还可以逐集试。':
    'The player page usually offers several sources — if one fails, switch to the next. For series, you can also try episode by episode.',
  '网络抖动会导致加载失败，刷新一次页面再点播放，很多时候就好了。':
    'Network hiccups can cause loading to fail — refresh the page and tap play again; that often fixes it.',
  '播放器上有跳过片头、片尾的按钮，点一下直接进正片。':
    'The player has Skip Intro and Skip Outro buttons — tap one to jump straight to the main feature.',
  '播放器支持本地弹幕，自己发的弹幕只存在本地，不会同步给别人。':
    'The player supports local danmaku (on-screen comments). Comments you post are stored locally only and are not shared with anyone else.',
  '广告说明': 'About ads',
  '本站免费，靠广告维持运营：打开应用会先播一次全屏开屏广告，点播前会先播一段贴片广告，点“取消”可以跳过贴片直接不播，页面底部还有一条横幅广告。广告播完才会开始放片，这是为了让站能一直免费开下去。':
    'This site is free and runs on ads: opening the app plays one full-screen splash ad first, and a pre-roll ad plays before on-demand videos — tap “Cancel” to skip the pre-roll and go straight to the video. There is also a banner ad at the bottom of the page. Videos start after the ad finishes, so the site can stay free.',
  '常见问题': 'FAQ',
  '不用。游客可以直接浏览、搜索、观看；注册只是为了把收藏和播放记录跟着账号走。':
    'No. Guests can browse, search, and watch directly; registering only keeps your favorites and playback history tied to your account.',
  '不要。本站没有会员、没有付费墙，所有功能对访客免费。':
    'No. There is no membership and no paywall — every feature is free for visitors.',
  '能。网站做了移动端适配，也有安卓 App（kyrinMedia），App 里同样免费。':
    'Yes. The site is mobile-friendly, and there is also an Android app (kyrinMedia) that is free too.',
  '播放内容来自第三方网站，本站不存储视频，见':
    'Playback content comes from third-party sites; we host no videos. See the',
  '里的来源说明。': 'for details on sources.',
  // about（2026-11-26，子代理 C 清单）
  'kyrinMedia（原 MoonTV）是一个免费的影视聚合站点，帮你在一个地方找到想看的电影、剧集、综艺和电视直播。':
    'kyrinMedia (formerly MoonTV) is a free video aggregation site that helps you find movies, TV shows, variety shows, and live TV in one place.',
  '本站是什么': 'What this site is',
  'kyrinMedia 聚合了多个公开影视信息源的检索入口：首页按热门电影、热门剧集、热门综艺三个栏目展示当前热度靠前的作品，每个作品都标注了豆瓣评分与年份，点进去可以搜索播放源、查看详情。站内还有电视直播频道，覆盖多个国家与地区的公开频道，以及美国 FAST 专区。':
    'kyrinMedia brings together search entry points for multiple public video sources: the home page shows the hottest titles in three sections — Trending Movies, Trending Shows, and Trending Variety — each labeled with its Douban rating and year. Tap any title to search for playback sources and view details. The site also has live TV channels covering many countries and regions, plus a US FAST zone.',
  '本站不存储任何视频资源，不提供视频下载；播放内容均来自第三方网站，版权归原权利方所有。站名 kyrinMedia 取自站长的儿子蒋骐睿的英文名 kyrin，麒麟的英文谐音，也是本站的标志。':
    'This site stores no video resources and offers no video downloads; all playback content comes from third-party sites, and copyright belongs to the original rights holders. The name kyrinMedia comes from the site owner\'s son, Jiang Qirui — “kyrin” is his English name and a homophone of 麒麟 (qilin), which is also the site\'s emblem.',
  '能在这里找到什么': 'What you can find here',
  '当前热度靠前的院线与网络电影，按豆瓣评分排序展示，可一键搜索播放源。':
    'The hottest theatrical and online movies right now, ranked by Douban rating — one tap searches for playback sources.',
  '在播与完结的热门国产剧、海外剧，支持按集选集、断点续播。':
    'Popular Chinese and international dramas, airing or completed, with per-episode selection and resume-from-breakpoint playback.',
  '真人秀、脱口秀、纪录片等综艺节目，更新后自动出现在栏目里。':
    'Reality shows, talk shows, documentaries, and other variety programs — new episodes appear in the section automatically.',
  '多个国家与地区的公开直播频道，按国家选择，另有美国 FAST 免费流媒体专区。':
    'Public live channels from many countries and regions, selectable by country, plus a US FAST free-streaming zone.',
  '编辑每月整理的站内热门片单，见':
    "The editors' monthly list of popular titles on the site — see the",
  '，按评分挑片不踩雷。': 'and pick by rating to avoid duds.',
  '怎么用': 'How to use it',
  '打开首页就能直接浏览热门内容，不用注册也能看。点一张海报可以查看详情、搜索播放源；喜欢的片子点收藏，会保存在你的浏览器或账号里，下次从收藏夹继续看；看到一半退出，下次打开会提示从上次的位置继续播放。详细步骤见':
    'Open the home page and start browsing trending titles — no registration needed. Tap a poster to view details and search for playback sources; favorite a title to save it in your browser or account, then continue from your favorites next time. If you leave halfway, the next visit will offer to resume from where you left off. For step-by-step instructions, see the',
  '。': '.',
  '内容来源与免责': 'Content sources & disclaimer',
  '本站展示的影片海报、评分、年份等信息来自豆瓣等公开信息源，仅供检索参考；播放源来自第三方网站，本站不对第三方内容的准确性、合法性、完整性负责，也不存储、上传任何视频文件。如果你是权利方，认为站内某条信息侵犯了你的权益，请通过站内反馈渠道联系我们核实处理。':
    'Posters, ratings, years, and other information shown here come from public sources such as Douban and are for search reference only; playback sources come from third-party sites. We are not responsible for the accuracy, legality, or completeness of third-party content, and we do not store or upload any video files. If you are a rights holder and believe any information on this site infringes your rights, please contact us through the site\'s feedback channel so we can verify and handle it.',
  '费用与广告': 'Pricing & ads',
  '本站对访客完全免费，没有会员、没有付费墙。网站通过展示广告维持运营：打开应用时会播一次全屏开屏广告，点播前会先播一段贴片广告（可取消），页面底部有横幅广告。站长本人使用管理员入口可免广告，普通访客看不到这个入口。':
    "This site is completely free for visitors — no membership, no paywall. It runs on ads: opening the app plays one full-screen splash ad, a pre-roll ad plays before on-demand videos (skippable), and there is a banner ad at the bottom of the page. The site owner can use an admin entry to go ad-free; ordinary visitors don't see that entry.",
  // privacy（2026-11-26，子代理 C 清单）
  '最后更新：2026 年 11 月 25 日。本政策说明 kyrinMedia（moontv.hookjune.qzz.io）收集哪些信息、用来做什么、以及你有哪些选择。':
    'Last updated: November 25, 2026. This policy explains what information kyrinMedia (moontv.hookjune.qzz.io) collects, what it\'s used for, and what choices you have.',
  '我们收集的信息': 'Information we collect',
  '注册时提供的用户名与密码（密码经加密存储）。不注册也可以浏览与观看本站大部分内容。':
    'The username and password you provide when registering (passwords are stored encrypted). You can browse and watch most of the site without registering.',
  '你收藏的影片、播放进度、搜索历史默认保存在你自己的浏览器本地（localStorage）或账号下，用于“继续观看”和收藏夹功能，不会出售给第三方。':
    'Your favorited titles, playback progress, and search history are saved by default in your own browser (localStorage) or under your account, to power “Continue Watching” and Favorites. They are never sold to third parties.',
  '访问时服务器会记录常规的访问日志，如 IP 地址、浏览器类型、访问时间，用于排查故障与统计访问量。':
    'When you visit, the server records standard access logs — such as IP address, browser type, and visit time — for troubleshooting and traffic statistics.',
  'Cookie 与广告': 'Cookies & ads',
  '本站使用 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据你对本网站或其他网站的访问记录来展示广告。你可以访问 Google 广告设置选择停用个性化广告，也可以清除浏览器 Cookie 后继续使用本站。站内点播前的贴片广告由 Google Ad Manager 提供，同样可能使用 Cookie 记录广告展示情况。':
    'This site shows ads through Google AdSense. Google and its partners may use cookies to show ads based on your visits to this or other sites. You can opt out of personalized ads in your Google Ads Settings, or clear your browser cookies and keep using the site. Pre-roll ads before on-demand videos are served by Google Ad Manager, which may also use cookies to record ad impressions.',
  '除广告服务外，本站还在浏览器本地保存少量偏好设置（如主题、公告已读状态、管理员免广告标记），仅用于改善你自己的浏览体验。':
    'Besides ads, the site also stores a few preference settings locally in your browser (such as theme, announcement read status, and the admin ad-free flag), only to improve your own browsing experience.',
  '第三方服务': 'Third-party services',
  '本站展示的影片海报、评分等信息来自豆瓣等公开信息源；实际播放内容来自第三方网站，点击播放即跳转到第三方服务，其隐私做法以对方政策为准，本站不承担责任。站内图片经过本站的图片代理加载，仅用于加速与防盗链，不会额外收集你的个人信息。':
    'Posters, ratings, and other information shown here come from public sources such as Douban; actual playback content comes from third-party sites, and tapping play takes you to a third-party service whose privacy practices are governed by its own policy — we take no responsibility for them. Images on the site load through our image proxy for speed and hotlink protection; it collects no additional personal information.',
  '数据保存与删除': 'Data retention & deletion',
  '浏览器本地的收藏与播放记录只存在你自己的设备上，清除浏览器数据即可删除。注册账号的数据保存在本站服务器上；如果你希望注销账号或删除账号数据，请通过站内反馈渠道联系站长核实处理。访问日志仅用于运维排查，会定期清理。':
    'Favorites and playback history stored in your browser live only on your own device — clearing your browser data deletes them. Registered account data is stored on our servers; if you want to close your account or delete your account data, please contact the site owner through the site\'s feedback channel for verification. Access logs are used only for operational troubleshooting and are cleaned up regularly.',
  '未成年人': 'Minors',
  '本站不对未成年人提供定向服务；站内设有内容过滤，默认屏蔽不适宜内容。如果你是未成年人的监护人，发现孩子在使用本站，请自行管理其设备访问。':
    'This site does not provide services directed at minors; it has content filtering that blocks inappropriate content by default. If you are a guardian and find a minor using this site, please manage their device access yourself.',
  '政策变更与联系': 'Policy changes & contact',
  '本政策可能随服务变化而更新，更新后会在本页标注新的最后更新日期。关于隐私的任何问题或删除数据的请求，请通过站内反馈渠道联系站长。':
    "This policy may be updated as the service changes; the new last-updated date will be shown on this page. For any privacy questions or data deletion requests, please contact the site owner through the site's feedback channel.",
  // warning（2026-11-26，子代理 C 清单）
  '安全合规配置警告': 'Security & Compliance Configuration Warning',
  '⚠️ 安全风险提示': '⚠️ Security risk notice',
  '检测到您的站点未配置访问控制，存在潜在的安全风险和法律合规问题。':
    'Your site has no access control configured, which poses potential security risks and legal compliance issues.',
  '主要风险': 'Main risks',
  '🔒 安全配置建议': '🔒 Security setup recommendations',
  '请立即配置': 'Please configure the',
  '环境变量以启用访问控制。': 'environment variable right away to enable access control.',
  // 管理后台 admin（2026-11-26，子代理 D 清单）
  '错误': 'Error',
  '成功': 'Success',
  '操作失败': 'Operation failed',
  '确认删除用户': 'Confirm Delete User',
  '删除用户 {username} 将同时删除其搜索历史、播放记录和收藏夹，此操作不可恢复！':
    'Deleting user {username} will also delete their search history, play records, and favorites. This cannot be undone!',
  '确认删除': 'Delete',
  '用户统计': 'User Statistics',
  '总用户数': 'Total Users',
  '注册设置': 'Registration Settings',
  '允许新用户注册': 'Allow new user registration',
  '(D1 环境下请通过环境变量修改)':
    '(In D1 environments, change it via environment variables)',
  '(Upstash 环境下请通过环境变量修改)':
    '(In Upstash environments, change it via environment variables)',
  '用户列表': 'User List',
  '添加用户': 'Add User',
  '修改用户密码': 'Change User Password',
  '角色': 'Role',
  '状态': 'Status',
  '操作': 'Actions',
  '普通用户': 'Regular User',
  '正常': 'Active',
  '已封禁': 'Banned',
  '设为管理': 'Make Admin',
  '取消管理': 'Remove Admin',
  '封禁': 'Ban',
  '解封': 'Unban',
  '删除用户': 'Delete User',
  '启用中': 'Enabled',
  '已禁用': 'Disabled',
  '禁用': 'Disable',
  '启用': 'Enable',
  '删除': 'Delete',
  '视频源列表': 'Video Source List',
  '添加视频源': 'Add Video Source',
  '名称': 'Name',
  'API 地址': 'API URL',
  'Detail 地址（选填）': 'Detail URL (optional)',
  'Detail 地址': 'Detail URL',
  '保存排序': 'Save Order',
  '自定义分类列表': 'Custom Category List',
  '(D1 环境下请通过配置文件修改)':
    '(In D1 environments, change it via the config file)',
  '(Upstash 环境下请通过配置文件修改)':
    '(In Upstash environments, change it via the config file)',
  '添加分类': 'Add Category',
  '分类名称': 'Category Name',
  '搜索关键词': 'Search Keyword',
  '保存失败': 'Failed to save',
  '保存成功, 请刷新页面': 'Saved. Please refresh the page.',
  '站点名称': 'Site Name',
  '站点公告': 'Site Announcement',
  '搜索接口可拉取最大页数': 'Max pages to fetch from the search API',
  '站点接口缓存时间（秒）': 'Site API cache time (seconds)',
  '图片代理前缀': 'Image Proxy Prefix',
  '例如: https://imageproxy.example.com/?url=':
    'e.g. https://imageproxy.example.com/?url=',
  '用于代理图片访问，解决跨域或访问限制问题。留空则不使用代理。':
    'Proxies image requests to work around cross-origin or access restrictions. Leave empty to disable the proxy.',
  '例如: https://proxy.example.com/fetch?url=':
    'e.g. https://proxy.example.com/fetch?url=',
  '用于代理豆瓣数据访问，解决跨域或访问限制问题。留空则使用服务端API。':
    'Proxies Douban data requests to work around cross-origin or access restrictions. Leave empty to use the server API.',
  '禁用黄色过滤器': 'Disable Adult Content Filter',
  '禁用黄色内容的过滤功能，允许显示所有内容。':
    'Disables the adult-content filter, allowing all content to be shown.',
  '保存中…': 'Saving…',
  '保存': 'Save',
  '获取配置失败': 'Failed to load settings',
  '重置失败': 'Reset failed',
  '确认重置配置': 'Confirm Reset Settings',
  '此操作将重置用户封禁和管理员设置、自定义视频源，站点配置将重置为默认值，是否继续？':
    'This will reset user bans and admin settings, custom video sources, and restore site settings to defaults. Continue?',
  '重置成功，请刷新页面！': 'Reset successful. Please refresh the page!',
  '管理员设置': 'Admin Settings',
  '重置配置': 'Reset Settings',
  '站点配置': 'Site Settings',
  '用户配置': 'User Settings',
  '视频源配置': 'Video Source Settings',
  '分类配置': 'Category Settings',
  // admin 里会弹给用户的 Error 前缀（带参；服务端返回的原文部分无法翻译，保留原样）
  '操作失败: {status}': 'Operation failed: {status}',
  '保存失败: {status}': 'Failed to save: {status}',
  '获取配置失败: {error}': 'Failed to load settings: {error}',
  '重置失败: {status}': 'Reset failed: {status}',
};

/** 取当前语言：localStorage，默认中文。服务端渲染时默认中文。 */
export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'zh';
  try {
    return window.localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export function setStoredLanguage(lang: Language): void {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* 忽略 */
  }
  try {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  } catch {
    /* 忽略 */
  }
}

function applyParams(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  let out = text;
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

/** 翻译：中文原文作 key；英文模式查字典，查不到回落中文原文。 */
export function translateText(
  zh: string,
  lang: Language,
  params?: Record<string, string | number>
): string {
  const base = lang === 'en' ? dict[zh] ?? zh : zh;
  return applyParams(base, params);
}

/** 非组件场景用（例如 Swal 弹窗）：读 localStorage 里的当前语言。 */
export function tStatic(zh: string, params?: Record<string, string | number>): string {
  return translateText(zh, getLanguage(), params);
}
