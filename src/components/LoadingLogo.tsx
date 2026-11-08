/* eslint-disable @next/next/no-img-element */

// 涨水 logo 动效（与 APK 启动页 www/index.html 同款）：
// 两张同一张 logo 上下叠放，下层暗淡线稿，上层全彩线稿自下而上揭示，1.2s 循环。
// 纯展示组件：不带跳转、不带进度条/倒计时逻辑。

export default function LoadingLogo({
  size = 120,
  showBrand = true,
}: {
  size?: number;
  showBrand?: boolean;
}) {
  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='relative' style={{ width: size, height: size }}>
        {/* 下层暗淡线稿 */}
        <img src='/logo.png' alt='' className='block h-full w-full opacity-25' />
        {/* 上层全彩线稿：自下而上揭示 */}
        <img
          src='/logo.png'
          alt='kyrinMedia'
          className='logo-rise-fill absolute inset-0 block h-full w-full'
        />
      </div>
      {showBrand && (
        <div className='text-lg font-bold tracking-[0.12em] text-[#e0f2fe]'>
          kyrinMedia
        </div>
      )}
      <style>{`
        .logo-rise-fill {
          clip-path: inset(100% 0 0 0);
          animation: logo-rise 1.2s ease-in-out infinite alternate;
        }
        @keyframes logo-rise {
          from { clip-path: inset(100% 0 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
      `}</style>
    </div>
  );
}
