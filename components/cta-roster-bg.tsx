"use client"

/**
 * cta-roster-bg.tsx — CTA 卡片背景：盲盒「选人」动画（无结算，永续循环）
 *
 * 视觉语言参考前端交易平台 lootbox-open-overlay.tsx / lib/blindbox/roster.ts：
 * - 格子：rounded-xl + border white/10 + 深色底 + 底部 3px 稀有度条（头像 cover / 头像框 contain）
 * - 四角括号光标（绿色 + 辉光 + 圆外角）
 * - 运动模型 = 「扫描停留」（v2.3 定稿）：慢滑 450ms 到位 → 到位后才点亮命中格 →
 *   停留 ~1.4s ± 0.6s → 再滑向下一格。此前的盲盒「先快后慢轮盘」在背景语境下
 *   70% 时间悬在格间（看着没对准 + 跳跃），已裁定弃用，勿改回。
 * 全程 ref + DOM 直写（不触发 React 重渲染）；素材复用 hero 已本地化的头像 + 头像框。
 * 顶层叠中心压暗 veil 保证前景文字可读。
 */

import { useEffect, useRef } from "react"
import { HERO_USERS, type Rarity } from "@/lib/hero-data"

const COLS = 8
const ROWS = 6
const TILE = 132
const GAP = 12
const STAGE_W = COLS * TILE + (COLS - 1) * GAP
const STAGE_H = ROWS * TILE + (ROWS - 1) * GAP

/** 稀有度底条色（对齐参考项目 --rarity-* token）。 */
const RARITY_BAR: Record<string, string> = {
  common: "#737d88",
  rare: "#14f195",
  epic: "#9b48fb",
  legendary: "#fedf00",
}

/** 素材池：8 头像 + 6 头像框（复用 hero 已本地化图片，减少同图重复率）。 */
interface RosterTile {
  src: string
  rarity: Rarity
  kind: "avatar" | "frame"
}
const TILE_POOL: RosterTile[] = [
  ...HERO_USERS.map((u): RosterTile => ({ src: u.avatar, rarity: u.rarity, kind: "avatar" })),
  ...HERO_USERS.filter((u) => u.frame).map(
    (u): RosterTile => ({ src: u.frame as string, rarity: u.rarity, kind: "frame" })
  ),
]

/** 扫描节奏：滑移时长（与光标 CSS transition 同值）+ 到位后的停留基准/抖动。 */
const GLIDE_MS = 450
const DWELL_BASE_MS = 1400
const DWELL_JITTER_MS = 600

export function CtaRosterBg() {
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancelled = false
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timers.push(id)
    }

    const setLook = (el: HTMLDivElement | null, hot: boolean) => {
      if (!el) return
      el.style.transform = hot ? "scale(1.08)" : ""
      el.style.borderColor = hot ? "rgba(20, 241, 149, 0.9)" : ""
      el.style.zIndex = hot ? "2" : ""
      el.style.boxShadow = hot ? "0 0 26px rgba(20, 241, 149, 0.45)" : ""
    }

    const moveCursorTo = (idx: number) => {
      const cursor = cursorRef.current
      if (!cursor) return
      const col = idx % COLS
      const row = Math.floor(idx / COLS)
      cursor.style.left = `${col * (TILE + GAP) - 8}px`
      cursor.style.top = `${row * (TILE + GAP) - 8}px`
      cursor.style.opacity = "1"
    }

    // 只在内圈跳动（边缘格可能被卡片裁切）
    const pickIdx = (prev: number): number => {
      let idx: number
      do {
        const col = 1 + Math.floor(Math.random() * (COLS - 2))
        const row = 1 + Math.floor(Math.random() * (ROWS - 2))
        idx = row * COLS + col
      } while (idx === prev)
      return idx
    }

    let prev = -1
    const step = () => {
      if (document.hidden) {
        later(step, 800)
        return
      }
      const idx = pickIdx(prev)
      prev = idx
      // 起步先熄灭旧高亮，光标滑行；到位后才点亮命中格（避免高亮与光标错位）
      for (const t of tileRefs.current) setLook(t, false)
      moveCursorTo(idx)
      later(() => setLook(tileRefs.current[idx], true), GLIDE_MS)
      later(step, GLIDE_MS + DWELL_BASE_MS + Math.random() * DWELL_JITTER_MS)
    }
    later(step, 400)

    return () => {
      cancelled = true
      for (const id of timers) clearTimeout(id)
    }
  }, [])

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 头像/头像框网格舞台：居中、超出裁切 */}
      {/* 手机 opacity-55（窄卡只露中间几列，叠暗后需更亮才可辨），md+ 恢复 40 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-55 md:opacity-40"
        style={{ width: STAGE_W, height: STAGE_H }}
      >
        <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, ${TILE}px)`, gap: GAP }}>
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            // 步长 5 与池长 14 互质 + 行偏移：相邻格必不同图，重复间隔拉满
            const tile = TILE_POOL[(i * 5 + Math.floor(i / COLS) * 3) % TILE_POOL.length]
            return (
              <div
                key={i}
                ref={(el) => {
                  tileRefs.current[i] = el
                }}
                className="relative overflow-hidden rounded-xl border border-white/10 transition-[transform,border-color,box-shadow] duration-200"
                style={{ width: TILE, height: TILE, backgroundColor: "rgba(10, 12, 15, 0.85)" }}
              >
                <img
                  src={tile.src}
                  alt=""
                  loading="lazy"
                  className={
                    tile.kind === "avatar" ? "h-full w-full object-cover" : "h-full w-full object-contain p-3"
                  }
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[3px] opacity-85"
                  style={{ backgroundColor: RARITY_BAR[tile.rarity] }}
                />
              </div>
            )
          })}
        </div>

        {/* 四角括号光标（DOM 直写 left/top） */}
        <div
          ref={cursorRef}
          className="absolute z-[5] opacity-0 transition-[left,top] duration-[450ms] ease-in-out"
          style={{ width: TILE + 16, height: TILE + 16 }}
        >
          {(["lt", "rt", "lb", "rb"] as const).map((pos) => (
            <i
              key={pos}
              className="absolute"
              style={{
                width: 30,
                height: 30,
                borderWidth: 3,
                borderStyle: "solid",
                borderColor: "#14F195",
                filter: "drop-shadow(0 0 6px rgba(20, 241, 149, 0.9))",
                left: pos.startsWith("l") ? -2 : undefined,
                right: pos.startsWith("r") ? -2 : undefined,
                top: pos.endsWith("t") ? -2 : undefined,
                bottom: pos.endsWith("b") ? -2 : undefined,
                borderRightColor: pos.startsWith("l") ? "transparent" : undefined,
                borderLeftColor: pos.startsWith("r") ? "transparent" : undefined,
                borderBottomColor: pos.endsWith("t") ? "transparent" : undefined,
                borderTopColor: pos.endsWith("b") ? "transparent" : undefined,
                borderTopLeftRadius: pos === "lt" ? 12 : undefined,
                borderTopRightRadius: pos === "rt" ? 12 : undefined,
                borderBottomLeftRadius: pos === "lb" ? 12 : undefined,
                borderBottomRightRadius: pos === "rb" ? 12 : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* 中心压暗 veil：保证标题/按钮可读，边缘留出头像细节。
          手机浅一档（旧 0.82/0.55/0.25 + 0.42 全域叠暗把背景压到全黑，session-12 用户反馈）*/}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.12) 100%)",
        }}
      />
      {/* 手机卡片无 glass 底，补一层轻量全域压暗保证正文可读（md 起移除） */}
      <div className="absolute inset-0 md:hidden" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
    </div>
  )
}
