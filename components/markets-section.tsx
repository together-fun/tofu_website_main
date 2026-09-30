"use client"

/**
 * markets-section.tsx — Markets 独立 part（scroll-part 重构 + session-13 覆盖式进场）
 *
 * 「Trade crypto. stocks. predictions. anything.」从 FeaturesSection 拆出，
 * 独立满屏、内容垂直居中。跑马灯行为见 components/features/markets-showcase.tsx。
 *
 * 覆盖式进场（桌面）：features 轨道尾部预留了 100svh（375svh 轨道，sticky 屏
 * 钉到轨道底），本区外层轨道 lg:-mt-[100svh] + z-20，section 不透明底从视口
 * 下方滑入盖住仍钉住的 features 屏——与 hero→features 覆盖同手法，纯 sticky +
 * 负 margin 布局，无动画属性（reduced-motion 天然安全）。
 * 盖满后停留（session-15 +10svh）：外层轨道 130svh + section lg:sticky，
 * 盖满全屏后钉住 ~30svh 再释放进入 seasons。手机无轨道/负 margin，普通顺序滚动。
 *
 * 背景：pit trading 场景图（桌面横版 / 手机竖版，<picture> 768px 切换）+
 * 黑色渐变暗化保证前景标题与 pills 对比度。
 */

import { MarketsShowcase } from "@/components/features/markets-showcase"

export function MarketsSection() {
  return (
    <div className="relative z-20 lg:-mt-[100svh] lg:h-[130svh]">
    <section
      id="markets"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-black py-14 md:py-16 shadow-[0_-40px_80px_rgba(0,0,0,0.6)] lg:sticky lg:top-0 lg:h-svh"
    >
      {/* pit trading 背景图：桌面 2560x1441 / 手机 1080x1920，object-cover 满铺 */}
      <picture aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <source media="(min-width: 768px)" srcSet="/images/pit_trading-bg.webp" />
        <img
          src="/images/pit_trading-bg-mobile.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {/* 暗化遮罩：上下重、中段稍轻（标题与 pills 集中在中部，保留背景可辨）。
          手机版中段加深一档——竖版图吉祥物亮部正好压在正文区 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 38%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 38%, rgba(0,0,0,0.7) 62%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* 品牌光斑（沿用 features 的青绿调，叠在暗化图上） */}
      <div
        className="pointer-events-none absolute right-[6%] top-[12%] h-[42vw] w-[42vw]"
        style={{ background: "radial-gradient(circle, rgba(39, 251, 226, 0.05), transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-[4%] left-[2%] h-[44vw] w-[44vw]"
        style={{ background: "radial-gradient(circle, rgba(20, 241, 149, 0.055), transparent 65%)" }}
      />
      <div className="relative z-10">
        <MarketsShowcase />
      </div>
    </section>
    </div>
  )
}
