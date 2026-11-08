/* eslint-disable @next/next/no-img-element */

// 涨水 logo 动效（与 APK 启动页 www/index.html 同款）：
// 两张同一张 logo 上下叠放，下层是 0.4 透明度的完整轮廓（全程可见），
// 上层全彩线稿自下而上揭示，完整显示后停住再淡出，1.8s 循环。
// 纯展示组件：不带跳转、不带进度条/倒计时逻辑。

export default function LoadingLogo({
  size = 180,
  showBrand = true,
}: {
  size?: number;
  showBrand?: boolean;
}) {
  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='relative' style={{ width: size, height: size }}>
        {/* 下层完整轮廓（0.4 透明度，全程可见） */}
        <img src='/logo.png' alt='' className='logo-glow block h-full w-full opacity-40' />
        {/* 上层全彩线稿：自下而上揭示 */}
        <img
          src='/logo.png'
          alt='kyrinMedia'
          className='logo-rise-fill logo-glow absolute inset-0 block h-full w-full'
        />
      </div>
      {showBrand && (
        <div className='text-lg font-bold tracking-[0.12em] text-[#e0f2fe]'>
          kyrinMedia
        </div>
      )}
      <style>{`
        .logo-glow {
          filter: drop-shadow(0 0 1.5px rgba(232,198,106,0.55));
        }
        .logo-rise-fill {
          clip-path: inset(100% 0 0 0);
          animation: logo-rise 1.8s ease-in-out infinite;
        }
        @keyframes logo-rise {
          0% { clip-path: inset(100% 0 0 0); opacity: 1; }
          50% { clip-path: inset(0 0 0 0); opacity: 1; }
          80% { clip-path: inset(0 0 0 0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
