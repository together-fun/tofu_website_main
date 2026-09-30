"use client"

/**
 * game-grid.tsx — 支柱 2「Every trade levels you up」左侧视觉
 *
 * - XpCard：复刻站内聊天室 hover 卡排版（头像+框 / 渐变名 / Lv·XP·Title pill），
 *   背景为 manifest nameplate `gold_dust_trail`（本地化 webm，30% 透明度）
 * - CosmeticsCard：头像+框 跑马灯，稀有度标签与 1.6× 头像框保持安全间距
 * - LootCard（可点击盲盒：摇晃 → 白闪 + 金色射线 → 弹出掉落）在 session-19
 *   重组中移居支柱 3（DropsScene 右列），组件仍定义在本文件并 export，
 *   保证「原样移植」零样式漂移。
 */

import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { COSMETIC_RAIL, LOOT_DROPS, RARITY_COLOR } from "@/lib/features-data"

const GOLD = "#fedf00"
const GREEN = "#14F195"

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-6 top-4 z-10 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
      {children}
    </span>
  )
}

/** 头像 + 1.6× 头像框（inset -30%，同站内规格）。 */
function FramedAvatar({
  avatar,
  frame,
  size,
  className = "",
}: {
  avatar: string
  frame: string
  size: number
  className?: string
}) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" />
      <div aria-hidden className="pointer-events-none absolute" style={{ inset: "-30%" }}>
        <img src={frame} alt="" className="h-full w-full object-contain" />
      </div>
    </div>
  )
}

// ============================================================================
// 盲盒
// ============================================================================

export function LootCard() {
  const [phase, setPhase] = useState<"idle" | "shaking" | "open">("idle")
  const [burst, setBurst] = useState(false)
  const [dropIdx, setDropIdx] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const onClick = () => {
    if (phase === "shaking") return
    if (phase === "open") {
      setDropIdx((i) => (i + 1) % LOOT_DROPS.length)
      setPhase("idle")
      return
    }
    setPhase("shaking")
    timers.current.push(
      window.setTimeout(() => {
        setPhase("open")
        setBurst(true)
        timers.current.push(window.setTimeout(() => setBurst(false), 620))
      }, 580)
    )
  }

  const drop = LOOT_DROPS[dropIdx]

  return (
    <button
      type="button"
      onClick={onClick}
      // row-span-2 已随 session-19 重组移除（原 GameGrid 双列布局定位类，非样式）
      className="relative flex min-h-[450px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border text-left md:min-h-[470px]"
      style={{
        borderColor: "rgba(255,255,255,0.12)",
        background: "radial-gradient(ellipse at 50% 32%, rgba(254,223,0,0.09), rgba(255,255,255,0.02) 68%)",
      }}
      aria-label="Open a Trading Drop"
    >
      <CardLabel>Trading Drops</CardLabel>

      <div className="relative flex h-[280px] w-[280px] items-center justify-center">
        {/* 金色旋转神光（开盒后浮现）：大尺寸盖过内容（站内 560px 同比例），
            用 CSS translate 属性居中——rotate 动画写 transform，二者不冲突 */}
        <div
          aria-hidden
          className={`loot-rays pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] rounded-full transition-opacity duration-500 ${
            phase === "open" ? "opacity-100" : "opacity-0"
          }`}
          style={{ translate: "-50% -50%" }}
        />

        {/* 盒体 */}
        <div
          className={`relative flex h-[126px] w-[126px] items-center justify-center rounded-[22px] transition-all duration-300 ${
            phase === "shaking" ? "loot-shake" : ""
          } ${phase === "open" ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
          style={{
            background: "linear-gradient(145deg, #15181d, #0a0c0f)",
            border: "1px solid rgba(254,223,0,0.5)",
            boxShadow: "0 0 44px rgba(254,223,0,0.26), inset 0 0 30px rgba(254,223,0,0.1)",
          }}
        >
          <span aria-hidden className="loot-sheen rounded-[22px]" />
          <span className="text-[34px] font-extrabold" style={{ color: GOLD, textShadow: "0 0 24px rgba(254,223,0,0.7)" }}>
            ?
          </span>
        </div>

        {/* 开盒白闪 */}
        {burst && (
          <div
            aria-hidden
            className="loot-flash pointer-events-none absolute inset-6 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.95), transparent 62%)" }}
          />
        )}

        {/* 掉落揭晓：150px 头像的框在下方溢出 ~45px，稀有度标签留 mt-14 安全距 */}
        <AnimatePresence>
          {phase === "open" && (
            <motion.div
              key={dropIdx}
              initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 240, damping: 17 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <FramedAvatar avatar={drop.avatar} frame={drop.frame} size={150} />
              <div
                className="mt-14 text-[13px] font-extrabold tracking-[0.14em]"
                style={{ color: RARITY_COLOR[drop.rarity], textShadow: `0 0 18px ${RARITY_COLOR[drop.rarity]}55` }}
              >
                {drop.rarity}
              </div>
              <div className="mt-1.5 text-xs font-semibold text-white/60">{drop.name}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] transition-colors"
        style={{ color: phase === "open" ? "rgba(255,255,255,0.4)" : GOLD }}
      >
        {phase === "open" ? "Click to roll again" : "Click to open"}
      </div>
    </button>
  )
}

// ============================================================================
// XP 卡（聊天室 hover 卡排版 + nameplate 背景）
// ============================================================================

function XpCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (!inView) return
    const t = window.setInterval(() => {
      setPct((p) => {
        if (p >= 72) {
          window.clearInterval(t)
          return 72
        }
        return p + 2
      })
    }, 32)
    return () => window.clearInterval(t)
  }, [inView])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.025)" }}
    >
      {/* manifest nameplate（gold_dust_trail）背景，站内 hover 卡同款 30% 透明度 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/cosmetics/nameplate-gold_dust_trail-preview.png"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        aria-hidden
      >
        <source src="/images/cosmetics/nameplate-gold_dust_trail.webm" type="video/webm" />
      </video>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />

      <CardLabel>Farm $XP</CardLabel>

      {/* pt-14：给 1.6× 头像框上溢出留位，避免压到左上标签 */}
      <div className="relative z-10 px-6 pb-6 pt-14">
        {/* session-20：头像 ml-5 ——框左溢出 21.6px（72px 的 30%），右移 20px 后框左缘
            与下方进度条左缘（px-6）基本齐平；gap-8 让资料区离开翅膀（视觉间隙 ≈10px） */}
        <div className="flex items-center gap-8">
          <FramedAvatar
            avatar="/images/cosmetics/avatar-crown_degen.webp"
            frame="/images/cosmetics/frame-green_candle_angel.webp"
            size={72}
            className="ml-5"
          />
          <div className="min-w-0 flex-1">
            <div
              className="bg-clip-text text-[17px] font-extrabold text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #fedf00, #14F195, #FAF518)" }}
            >
              MoonFarmer
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
                style={{ borderColor: "rgba(20,241,149,0.4)", background: "rgba(20,241,149,0.15)", color: GREEN }}
              >
                Lv.92
              </span>
              <span
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold text-white/80"
                style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }}
              >
                128,540 XP
              </span>
              <span
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
                style={{ borderColor: "rgba(254,223,0,0.4)", background: "rgba(254,223,0,0.13)", color: GOLD }}
              >
                Chart Whisperer
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Next level</span>
          <span className="text-sm font-bold" style={{ color: GREEN }}>
            {pct}%
          </span>
        </div>
        <div className="mt-2 h-[9px] overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-[width] duration-[1400ms] ease-out"
            style={{
              width: inView ? "72%" : "0%",
              background: "linear-gradient(90deg, #14F195, #27FBE2)",
              boxShadow: "0 0 14px rgba(20,241,149,0.5)",
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[10.5px] text-white/40">
          <span>Every fill earns XP</span>
          <span>
            <b style={{ color: GREEN }}>+320 XP</b> last trade
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Cosmetics 跑马灯
// ============================================================================

function CosmeticsCard() {
  const items = [...COSMETIC_RAIL, ...COSMETIC_RAIL]
  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.025)" }}
    >
      <CardLabel>Cosmetics</CardLabel>

      <div
        className="mt-11 overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
        }}
      >
        {/* pt 给框上溢出（18px）留位；pb 容纳框下溢出 + 稀有度标签；pr = gap 保证 -50% 无缝 */}
        <div
          className="features-marquee gap-[30px] pb-12 pr-[30px] pt-5"
          style={{ "--marq-dur": "26s" } as React.CSSProperties}
        >
          {items.map((it, i) => (
            <div key={`${it.avatar}-${i}`} className="relative h-[60px] w-[60px] shrink-0">
              <img src={it.avatar} alt="" className="h-full w-full rounded-full object-cover" />
              <div aria-hidden className="pointer-events-none absolute" style={{ inset: "-30%" }}>
                <img src={it.frame} alt="" className="h-full w-full object-contain" />
              </div>
              {/* 标签距头像底 26px > 框溢出 18px，不压框 */}
              <span
                className="absolute left-1/2 top-[calc(100%+26px)] -translate-x-1/2 whitespace-nowrap text-[8.5px] font-extrabold uppercase tracking-[0.16em]"
                style={{ color: RARITY_COLOR[it.rarity] }}
              >
                {it.rarity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-5 text-center text-[11px] tracking-[0.08em] text-white/40">
        Frames · nameplates · titles — earned, not bought.
      </div>
    </div>
  )
}

export function GameGrid() {
  // session-19 重组：盲盒卡移居支柱 3，两卡全宽竖排拉长填满原三卡空间
  return (
    <div className="flex flex-col gap-4">
      <XpCard />
      <CosmeticsCard />
    </div>
  )
}
