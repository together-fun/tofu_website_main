"use client"

/**
 * markets-showcase.tsx — Markets 独立 part 的内容体「Trade anything」
 *
 * - 标题词轮换（crypto / stocks / predictions / anything）：容器宽度实时量取
 *   当前词宽并过渡，整行始终保持居中，不因词长差产生视觉错位
 * - 市场行（scroll-part 重构）：pills 静止不自动滚，随页面上下滚动横向 scrub——
 *   useScroll(本区穿越视口的进度) 映射 translateX，向下滚正向、向上滚反向，
 *   中间行 reverse 反向增强层次。reduced-motion 下静止在基准位。
 *   （旧 useVelocity→WAAPI playbackRate 加速方案已随自动滚动一起移除）
 */

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { CRYPTO_MARKETS, PREDICTION_MARKETS, STOCK_MARKETS, type MarketChip } from "@/lib/features-data"
import { useDesktopAnim } from "@/lib/use-desktop-anim"

const GREEN = "#14F195"
const RED = "#f6465d"

const WORDS = [
  { t: "crypto.", c: "#14F195" },
  { t: "stocks.", c: "#27FBE2" },
  { t: "predictions.", c: "#9945FF" },
  { t: "anything.", c: "#FAF518" },
]

const ROW_MASK = "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)"

function Rotator() {
  const [idx, setIdx] = useState(0)
  const [width, setWidth] = useState<number>()
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  // 量当前词宽：挂载 / 换词 / 字体就绪 / 视口变化时重量，容器宽度过渡保证整行居中
  useEffect(() => {
    const measure = () => {
      const el = refs.current[idx]
      if (el) setWidth(el.offsetWidth)
    }
    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [idx])

  useEffect(() => {
    const t = window.setInterval(() => setIdx((i) => (i + 1) % WORDS.length), 2200)
    return () => window.clearInterval(t)
  }, [])

  return (
    <span className="inline-grid align-baseline transition-[width] duration-500 ease-out" style={{ width }}>
      {WORDS.map((w, i) => (
        <span
          key={w.t}
          ref={(el) => {
            refs.current[i] = el
          }}
          aria-hidden={i !== idx}
          className={`col-start-1 row-start-1 justify-self-start whitespace-nowrap transition-all duration-500 ${
            i === idx ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
          style={{ color: w.c, textShadow: `0 0 34px ${w.c}59` }}
        >
          {w.t}
        </span>
      ))}
    </span>
  )
}

// pill 深色半透底（session-14）：pit trading 背景图上旧的 white/0.03 几乎全透看不清；
// 不用 backdrop-blur——78 个 chip 逐个采样背景，scrub 平移时合成成本高
function TokenChip({ chip }: { chip: MarketChip }) {
  return (
    <div
      className="flex shrink-0 items-center gap-3.5 whitespace-nowrap rounded-full border px-7 py-4"
      style={{ borderColor: "rgba(255,255,255,0.13)", background: "rgba(6,8,10,0.55)" }}
    >
      {/* decoding=async：三行 ~78 个 chip 的 SVG 在滚近时被 lazy-load 批量触发，
          同步解码曾在深滚处造成单帧 ~100ms 卡顿 */}
      <img src={chip.logo} alt={chip.ticker} loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-contain" />
      <span className="text-base font-bold text-white">{chip.ticker}</span>
      <span className="text-base font-semibold" style={{ color: chip.up ? GREEN : RED }}>
        {chip.change}
      </span>
    </div>
  )
}

function PredChip({ q, yes }: { q: string; yes: string }) {
  return (
    <div
      className="flex shrink-0 items-center gap-4 whitespace-nowrap rounded-full border px-7 py-4"
      style={{ borderColor: "rgba(153,69,255,0.35)", background: "rgba(24,12,42,0.6)" }}
    >
      <span className="text-base font-semibold text-white/80">{q}</span>
      <span
        className="rounded-full px-3 py-0.5 text-sm font-bold"
        style={{ background: "rgba(20,241,149,0.15)", color: GREEN }}
      >
        {yes}
      </span>
    </div>
  )
}

/**
 * scrub 行：静止基准 -25%（行宽的四分之一），随本区穿越视口的进度平移 ±10% 行宽。
 * 行内容为多份拷贝的 w-max 长条（远宽于视口），任意 scrub 位置两端都有内容。
 * transform-only（GPU 合成），滚动倒退自动反向。
 */
function MarqueeRow({
  children,
  progress,
  reverse = false,
}: {
  children: React.ReactNode
  progress: MotionValue<number>
  reverse?: boolean
}) {
  const prefersReduced = useReducedMotion()
  const x = useTransform(progress, [0, 1], reverse ? ["-35%", "-15%"] : ["-15%", "-35%"])

  return (
    <div className="overflow-hidden" style={{ WebkitMaskImage: ROW_MASK, maskImage: ROW_MASK }}>
      <motion.div
        style={prefersReduced ? { x: "-25%" } : { x }}
        className="flex w-max items-center gap-4 pr-4"
      >
        {children}
      </motion.div>
    </div>
  )
}

export function MarketsShowcase() {
  // 本区（内容根）穿越视口的进度：进入视口底 0 → 离开视口顶 1
  const rootRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  })
  // 入场动画仅桌面挂载（session-19 手机回归修复：手机 SSR 即完整可见）
  const anim = useDesktopAnim()

  return (
    <div ref={rootRef}>
      <div className="container mx-auto px-6 text-center">
        <motion.h3
          {...(anim
            ? {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.7 },
              }
            : {})}
          // lg-anim：手机可见性硬保证（globals.css §硬保证）
          className="lg-anim text-4xl font-extrabold tracking-tight leading-tight text-white md:text-6xl lg:text-7xl"
        >
          Trade <Rotator />
        </motion.h3>
        <motion.p
          {...(anim
            ? {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.7, delay: 0.12 },
              }
            : {})}
          className="lg-anim mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
        >
          One account, every market. Crypto perps, tokenized stocks and prediction markets — all
          routed through <span className="font-semibold text-white/85">Hyperliquid</span>, the fastest
          on-chain orderbook.
        </motion.p>
      </div>

      {/* 三行交错 scrub 行：crypto / stocks(反向) / predictions。
          拷贝份数只为宽度覆盖（scrub 位移 ±10% 后两端仍有内容），无循环无缝需求 */}
      <motion.div
        {...(anim
          ? {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport: { once: true },
              transition: { duration: 0.8, delay: 0.15 },
            }
          : {})}
        // lg-anim 挂容器层；MarqueeRow 内部 x scrub 轨道手机也要位移，不挂
        className="lg-anim mt-14 space-y-4"
      >
        <MarqueeRow progress={scrollYProgress}>
          {[...CRYPTO_MARKETS, ...CRYPTO_MARKETS].map((c, i) => (
            <TokenChip key={`${c.ticker}-${i}`} chip={c} />
          ))}
        </MarqueeRow>
        <MarqueeRow reverse progress={scrollYProgress}>
          {[...STOCK_MARKETS, ...STOCK_MARKETS, ...STOCK_MARKETS, ...STOCK_MARKETS].map((c, i) => (
            <TokenChip key={`${c.ticker}-${i}`} chip={c} />
          ))}
        </MarqueeRow>
        <MarqueeRow progress={scrollYProgress}>
          {[...PREDICTION_MARKETS, ...PREDICTION_MARKETS, ...PREDICTION_MARKETS, ...PREDICTION_MARKETS].map((p, i) => (
            <PredChip key={`${p.q}-${i}`} q={p.q} yes={p.yes} />
          ))}
        </MarqueeRow>
      </motion.div>

      {/* Powered by（数字行已删：200+/50x/<1s/0 gas 均为 HL 基础设施属性，
          任何 builder 都一样，无差异化价值 — session-9 裁定） */}
      <div className="container mx-auto px-6">
        <motion.p
          {...(anim
            ? {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true },
                transition: { duration: 0.7, delay: 0.2 },
              }
            : {})}
          // session-21 放大一档（text-xs→text-sm、logo h-4→h-5），保持居中与 mt-14 间距节奏
          className="lg-anim mt-14 flex items-center justify-center gap-2 text-center text-sm uppercase tracking-[0.28em] text-white/30"
        >
          Powered by{" "}
          <span className="flex items-center gap-1.5 font-semibold text-white/60">
            <img src="/images/hype.svg" alt="" className="h-5 w-5" />
            Hyperliquid
          </span>
        </motion.p>
      </div>
    </div>
  )
}
