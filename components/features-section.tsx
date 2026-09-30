"use client"

/**
 * features-section.tsx — Core Features 区（双 DOM 分支版，session-22 结构性根治）
 *
 * ⚠️ 手机可见性四次复发的最终结构（勿回退到单分支 + JS gate）：
 * 手机（<lg）与桌面（lg+）是**两个独立 DOM 分支**，纯 CSS 断点切换：
 * - 手机分支 `lg:hidden`：普通文档流顺排（标题 → 支柱 1 → 2 → 3），零 motion
 *   组件、零 inline style、零 sticky、零轨道空高。SSR HTML 即完整可见。
 * - 桌面分支 `hidden lg:block`：375svh 轨道 + sticky 满屏 + 三支柱 absolute
 *   叠放轮换（useScroll + useTransform 分段 opacity/y）。motion style 无条件
 *   挂载——该分支在 <lg 视口 display:none，任何 inline 残留都不可见。
 *
 * 四次复发的真正根因（session-22 法医结论）：单分支结构下桌面态由
 * JS matchMedia gate 决定是否挂 motion style；视口从桌面 resize 到手机
 * （DevTools 设备模拟 = resize）时 React 撤掉 style prop，但 framer-motion
 * 会把最后写入的 inline opacity **残留**在 DOM 上（实测 P1=0/P2=0.52/P3=0），
 * 三支柱带着轮换残留进手机文档流 → 大片黑块 + 只显示某一根支柱。残留组合
 * 取决于 resize 瞬间滚动进度，因此症状不稳定（只剩 P1 / P2 / P3 都出现过）。
 * 双分支结构从物理上免疫：残留只可能写进桌面分支，而桌面分支 <lg 不渲染。
 *
 * reduced-motion（桌面）：保留滚动轮换 opacity（用户主导、非自主动画），
 * 去掉 y 位移与入场动画。
 *
 * 注意：桌面分支根用 overflow-x-clip 而非 overflow-hidden——overflow: clip
 * 不产生滚动容器，不会杀内部 sticky（hidden 会）。
 * Markets 支柱已拆出为独立 part（components/markets-section.tsx）。
 */

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Infinity as InfinityIcon } from "lucide-react"
import { useRef } from "react"
import { DropsScene } from "@/components/features/drops-scene"
import { GameGrid } from "@/components/features/game-grid"
import { SocialScene } from "@/components/features/social-scene"

const GREEN = "#14F195"
const GOLD = "#fedf00"
const CYAN = "#27FBE2"

/** 子项圆点（统一绿色圆形 + 微光）。 */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-white/85">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: GREEN, boxShadow: "0 0 8px rgba(20,241,149,0.7)" }}
      />
      {children}
    </div>
  )
}

function StatPair({ stats }: { stats: { n: React.ReactNode; l: string }[] }) {
  return (
    <div className="mt-10 flex items-center gap-10 border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      {stats.map((s) => (
        <div key={s.l}>
          {/* h-8 对齐 text-2xl 行高，icon 型数值（如 ∞）与文字型基线一致 */}
          <div className="flex h-8 items-center text-2xl font-extrabold" style={{ color: GREEN }}>
            {s.n}
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{s.l}</div>
        </div>
      ))}
    </div>
  )
}

/** 滚动指示器圆点：灰描边常驻，激活时内芯变绿放大 + 微光（active 为 0..1 的 MotionValue）。 */
function IndicatorDot({ active }: { active: MotionValue<number> }) {
  const scale = useTransform(active, [0, 1], [1, 1.35])
  return (
    <motion.span
      className="block h-2.5 w-2.5 rounded-full border"
      style={{
        scale,
        borderColor: useTransform(active, (a) => (a > 0.5 ? GREEN : "rgba(255,255,255,0.5)")),
        backgroundColor: useTransform(active, (a) => (a > 0.5 ? GREEN : "transparent")),
        boxShadow: useTransform(active, (a) => (a > 0.5 ? "0 0 10px rgba(20,241,149,0.7)" : "none")),
      }}
    />
  )
}

/* ============================================================
   三支柱共享内容（两个分支都渲染同一份，同 URL 媒体命中浏览器缓存
   不会重复下载）。heading/body/bullets/stats/Media 数据化，改文案只改这里。
   ============================================================ */

interface PillarDef {
  key: string
  heading: React.ReactNode
  /** 手机分支专用换行版（session-25：支柱 1 手机居中后合并为两行）；缺省沿用 heading */
  headingMobile?: React.ReactNode
  body: string
  bullets: string[]
  stats: { n: React.ReactNode; l: string }[]
  Media: React.ComponentType
  /** 桌面栅格：文字列是否在右（支柱 2 左右互换，形成 左-右-左 节奏） */
  textRight?: boolean
  /** 桌面矮屏缩放阈值：支柱 3 图列最高，阈值放宽到 960 */
  scaleAt960?: boolean
}

const PILLARS: PillarDef[] = [
  {
    key: "social",
    heading: (
      <>
        Trade inside
        <br />
        the <span style={{ color: GREEN, textShadow: "0 0 34px rgba(20,241,149,0.4)" }}>crowd</span>,
        <br />
        <span className="text-white/35">not alone.</span>
      </>
    ),
    headingMobile: (
      <>
        Trade inside
        <br />
        <span className="whitespace-nowrap">
          the <span style={{ color: GREEN, textShadow: "0 0 34px rgba(20,241,149,0.4)" }}>crowd</span>,{" "}
          <span className="text-white/35">not alone.</span>
        </span>
      </>
    ),
    body: "Every token has a live room. Danmaku flies across the candles, the chat reacts to every wick, and your best calls become part of the room's history.",
    bullets: ["Danmaku on charts", "Live token chat", "Together Moments", "Legendary calls feed"],
    stats: [
      { n: "24/7", l: "Rooms live" },
      { n: "0ms", l: "To talk your book" },
    ],
    Media: SocialScene,
  },
  {
    key: "gamified",
    heading: (
      <>
        Every trade
        <br />
        <span className="whitespace-nowrap">
          <span style={{ color: GOLD, textShadow: "0 0 34px rgba(254,223,0,0.35)" }}>levels</span> you up.
        </span>
      </>
    ),
    body: "Volume becomes XP. XP becomes levels, Trading Drops and cosmetics. Your avatar frame tells the room who they're dealing with — before you say a word.",
    bullets: ["Trading Drops", "Farm $XP", "Avatar frames & titles", "Achievements"],
    stats: [
      { n: "100+", l: "Levels to climb" },
      { n: "4", l: "Rarity tiers" },
    ],
    Media: GameGrid,
    textRight: true,
  },
  {
    key: "drops",
    heading: (
      <>
        Trade more,
        <br />
        <span style={{ color: CYAN, textShadow: "0 0 34px rgba(39,251,226,0.35)" }}>loot</span> harder.
      </>
    ),
    body: "Volume fills your next Trading Drop — a mystery box of avatar frames, nameplates and danmaku styles. Four tiers deep, one shot at legendary every time you open.",
    bullets: ["Free drops from volume", "Danmaku styles & frames", "Common → Legendary", "Pulls announced in chat"],
    stats: [
      { n: "FREE", l: "Earned by trading" },
      // 字体渲染 ∞ 左小右大像 8，换 lucide 图标（与 FREE 同档 28px 高）
      { n: <InfinityIcon aria-label="Unlimited" className="h-7 w-7" strokeWidth={2.5} />, l: "Bragging rights" },
    ],
    Media: DropsScene,
    scaleAt960: true,
  },
]

function PillarHeading({ p, mobile }: { p: PillarDef; mobile?: boolean }) {
  // 手机分支（session-25）：标题居中（堆叠排版下更突出），支柱 1 用两行合并版；
  // 副文保持左对齐（max-w-md 窄屏近满宽，与居中标题不打架）。桌面分支不变。
  return (
    <div>
      <h3
        // max-[389px]:text-[27px]：支柱 1 手机版第二行（nowrap）在 390 宽 text-3xl
        // 下恰好满宽零余量，<390 的窄安卓（360 等）整体降一档防溢出
        className={`text-3xl font-extrabold tracking-tight leading-[1.12] text-white md:text-5xl ${mobile ? "text-center max-[389px]:text-[27px]" : ""}`}
      >
        {mobile && p.headingMobile ? p.headingMobile : p.heading}
      </h3>
      <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">{p.body}</p>
    </div>
  )
}

function PillarBullets({ p }: { p: PillarDef }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {p.bullets.map((b) => (
          <Bullet key={b}>{b}</Bullet>
        ))}
      </div>
      <StatPair stats={p.stats} />
    </div>
  )
}

function SectionTitle({ withSub }: { withSub: boolean }) {
  return (
    <>
      <h2 className="text-4xl font-extrabold tracking-tight leading-tight md:text-6xl lg:text-7xl">
        <span className="text-white">The most fun way</span>
        <br />
        <span className="text-white">to trade is </span>
        <span style={{ color: GREEN, textShadow: "0 0 34px rgba(20,241,149,0.4)" }}>together</span>
      </h2>
      {withSub && (
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
          Charts, chat, danmaku, drops and every market on{" "}
          <span className="whitespace-nowrap font-semibold text-white/85">
            <img src="/images/hype.svg" alt="" className="mr-1 inline h-[1.05em] w-auto align-[-0.18em]" />
            Hyperliquid
          </span>{" "}
          — fused into{" "}
          <span className="font-semibold" style={{ color: "#27FBE2" }}>
            one social trading floor
          </span>
          .
        </p>
      )}
    </>
  )
}

// 轮换进度分段（轨道 progress 0..1）：三支柱 P1 → P2 → P3 依次交叉切换。
// 轨道 375svh（session-16 三支柱版）：尾部 100svh 供 Markets 覆盖式进场
// （markets-section 用 lg:-mt-[100svh] 叠上来盖住仍钉住的本屏），可滚 275svh。
// 绝对滚距（×275）：P1 常显 ~36svh → 切换 1（out 22 / in 18svh）→ P2 常显
// ~29svh → 切换 2（同节奏）→ P3 于 ~146svh 完成 → ~29svh 停留 → 覆盖开始
// 175svh。每支柱常显/切换体感与两支柱版持平，停留档位系用户两轮裁定，别再加长。
const P1_OUT = [0.13, 0.21] as const
const P2_IN = [0.21, 0.275] as const
const P2_OUT = [0.38, 0.46] as const
const P3_IN = [0.46, 0.53] as const

const textReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 },
} as const

const mediaReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: 0.1 },
} as const

/* ============================================================
   手机分支（<lg）：纯静态文档流。禁止在此分支引入 motion 组件 /
   inline style 动画 / sticky / svh 轨道（landing-mobile-visibility.mdc）。
   ============================================================ */
function FeaturesMobile() {
  return (
    <div className="relative py-14 lg:hidden">
      {/* 背景光斑（静态装饰，与桌面分支同款） */}
      <div
        className="pointer-events-none absolute left-0 top-[8%] h-[50vw] w-[50vw]"
        style={{ background: "radial-gradient(circle, rgba(20, 241, 149, 0.065), transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute right-0 top-[42%] h-[48vw] w-[48vw]"
        style={{ background: "radial-gradient(circle, rgba(254, 223, 0, 0.045), transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-[48vw] w-[48vw]"
        style={{ background: "radial-gradient(circle, rgba(153, 69, 255, 0.055), transparent 65%)" }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <SectionTitle withSub />
      </div>

      {/* 手机信息流（session-12 排版裁定）：标题+副文 → 图 → bullets+统计 */}
      {PILLARS.map((p, i) => (
        <div key={p.key} className={`relative z-10 container mx-auto px-6 ${i === 0 ? "mt-16 md:mt-24" : "mt-20 md:mt-36"}`}>
          <PillarHeading p={p} mobile />
          <div className="mt-10">
            <p.Media />
          </div>
          <div className="mt-10">
            <PillarBullets p={p} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   桌面分支（lg+）：375svh 轨道 + sticky 满屏 + 三支柱 absolute 轮换。
   motion style 无条件挂载——本分支 <lg 时 display:none，视口切换产生的
   inline 残留不可能影响手机（session-22 根治结构）。
   ============================================================ */
function FeaturesDesktop() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })

  // reduced-motion：保留滚动轮换 opacity（absolute 叠放不轮换会叠影），
  // 去掉 y 位移与 whileInView 入场动画
  const prefersReduced = useReducedMotion()
  const anim = !prefersReduced
  const reveal = anim ? textReveal : {}
  const mReveal = anim ? mediaReveal : {}

  const p1Opacity = useTransform(scrollYProgress, [...P1_OUT], [1, 0])
  const p1Y = useTransform(scrollYProgress, [...P1_OUT], [0, -48])
  const p1Events = useTransform(p1Opacity, (o) => (o < 0.05 ? "none" : "auto"))
  // 支柱 2 有进有出（中间支柱）：进场淡入上移、出场继续上移淡出
  const p2Opacity = useTransform(scrollYProgress, [P2_IN[0], P2_IN[1], P2_OUT[0], P2_OUT[1]], [0, 1, 1, 0])
  const p2Y = useTransform(scrollYProgress, [P2_IN[0], P2_IN[1], P2_OUT[0], P2_OUT[1]], [64, 0, 0, -48])
  const p2Events = useTransform(p2Opacity, (o) => (o < 0.05 ? "none" : "auto"))
  const p3Opacity = useTransform(scrollYProgress, [...P3_IN], [0, 1])
  const p3Y = useTransform(scrollYProgress, [...P3_IN], [64, 0])
  const p3Events = useTransform(p3Opacity, (o) => (o < 0.05 ? "none" : "auto"))
  const pillarMotion = [
    { opacity: p1Opacity, y: p1Y, events: p1Events },
    { opacity: p2Opacity, y: p2Y, events: p2Events },
    { opacity: p3Opacity, y: p3Y, events: p3Events },
  ]

  // 右缘滚动指示器：3 圆点对应 3 支柱，两段连接线的绿色填充各随对应切换段
  // scaleY 生长，暗示「这里还能继续往下滚」
  const MID_1 = (P1_OUT[1] + P2_IN[0]) / 2
  const MID_2 = (P2_OUT[1] + P3_IN[0]) / 2
  const dot1Active = useTransform(scrollYProgress, [MID_1 - 0.02, MID_1 + 0.02], [1, 0])
  const dot2Active = useTransform(scrollYProgress, [MID_1 - 0.02, MID_1 + 0.02, MID_2 - 0.02, MID_2 + 0.02], [0, 1, 1, 0])
  const dot3Active = useTransform(scrollYProgress, [MID_2 - 0.02, MID_2 + 0.02], [0, 1])
  const line1Fill = useTransform(scrollYProgress, [P1_OUT[0], P2_IN[1]], [0, 1])
  const line2Fill = useTransform(scrollYProgress, [P2_OUT[0], P3_IN[1]], [0, 1])

  return (
    <div ref={trackRef} className="relative hidden h-[375svh] lg:block">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* 背景光斑 — 挂在 sticky 屏内，钉住期间始终可见 */}
        <div
          className="pointer-events-none absolute left-0 top-[8%] h-[50vw] w-[50vw]"
          style={{ background: "radial-gradient(circle, rgba(20, 241, 149, 0.065), transparent 65%)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-[42%] h-[48vw] w-[48vw]"
          style={{ background: "radial-gradient(circle, rgba(254, 223, 0, 0.045), transparent 65%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 h-[48vw] w-[48vw]"
          style={{ background: "radial-gradient(circle, rgba(153, 69, 255, 0.055), transparent 65%)" }}
        />

        {/* 右缘滚动进度指示器 */}
        <div
          aria-hidden
          // 深色胶囊底：支柱内容（终端图等）可能延伸到右缘，保证圆点在任何底上可读
          className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center rounded-full px-2 py-3 xl:right-7"
          style={{ backgroundColor: "rgba(3,3,3,0.55)", backdropFilter: "blur(4px)" }}
        >
          <IndicatorDot active={dot1Active} />
          <div className="relative my-2 h-14 w-px overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top"
              style={{ scaleY: line1Fill, backgroundColor: GREEN, boxShadow: "0 0 6px rgba(20,241,149,0.6)" }}
            />
          </div>
          <IndicatorDot active={dot2Active} />
          <div className="relative my-2 h-14 w-px overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top"
              style={{ scaleY: line2Fill, backgroundColor: GREEN, boxShadow: "0 0 6px rgba(20,241,149,0.6)" }}
            />
          </div>
          <IndicatorDot active={dot3Active} />
        </div>

        {/* 常驻大标题（钉住不动，支柱在其下方轮换）。
            [@media(max-height:840px)]:hidden：矮屏隐藏副标题给轮换区让高度 */}
        <div className="relative z-10 container mx-auto shrink-0 px-6 pt-16 text-center">
          <motion.h2 {...reveal} className="text-7xl font-extrabold tracking-tight leading-tight">
            <span className="text-white">The most fun way</span>
            <br />
            <span className="text-white">to trade is </span>
            <span style={{ color: GREEN, textShadow: "0 0 34px rgba(20,241,149,0.4)" }}>together</span>
          </motion.h2>
          <motion.p
            {...reveal}
            transition={anim ? { duration: 0.7, delay: 0.12 } : undefined}
            className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed text-white/60 [@media(max-height:840px)]:hidden"
          >
            Charts, chat, danmaku, drops and every market on{" "}
            <span className="whitespace-nowrap font-semibold text-white/85">
              <img src="/images/hype.svg" alt="" className="mr-1 inline h-[1.05em] w-auto align-[-0.18em]" />
              Hyperliquid
            </span>{" "}
            — fused into{" "}
            <span className="font-semibold" style={{ color: "#27FBE2" }}>
              one social trading floor
            </span>
            .
          </motion.p>
        </div>

        {/* 支柱轮换区：三支柱 absolute 叠放交叉切换 */}
        <div className="relative z-10 min-h-0 flex-1">
          {PILLARS.map((p, i) => {
            const m = pillarMotion[i]
            return (
              <motion.div
                key={p.key}
                // willChange 常驻：防 framer 动画收尾撤层导致大纹理反复升降级重栅格化（GPU 尖峰）
                // reduced-motion：保留 opacity 轮换、去掉 y 位移
                style={{
                  opacity: m.opacity,
                  pointerEvents: m.events,
                  willChange: "transform, opacity",
                  ...(anim ? { y: m.y } : {}),
                }}
                // pb-12：SocialScene 的聊天卡向下悬挂（md:-bottom-14），居中基准上移防矮屏裁切
                className="container mx-auto absolute inset-0 flex flex-col justify-center px-6 pb-12"
              >
                <div
                  className={`grid grid-cols-12 items-center gap-20 ${
                    p.scaleAt960 ? "[@media(max-height:960px)]:scale-90" : "[@media(max-height:840px)]:scale-90"
                  }`}
                >
                  <div className={`col-span-5 ${p.textRight ? "order-2" : ""}`}>
                    <motion.div {...reveal}>
                      <PillarHeading p={p} />
                    </motion.div>
                    <motion.div {...reveal} className="mt-8">
                      <PillarBullets p={p} />
                    </motion.div>
                  </div>
                  {/* min-w-0 必须有：Cosmetics 跑马灯轨道是 max-content 宽（~1400px），
                      缺它时 grid 列被 min-content 撑爆 */}
                  <motion.div {...mReveal} className={`col-span-7 min-w-0 ${p.textRight ? "order-1" : ""}`}>
                    <p.Media />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    // bg-black：本区作为覆盖层盖住钉住的 hero，必须自带不透明底
    <section id="features" className="relative overflow-x-clip bg-black">
      <FeaturesMobile />
      <FeaturesDesktop />
    </section>
  )
}
