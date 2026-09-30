"use client"

/**
 * drops-scene.tsx — 支柱 3「Trade more, loot harder」右侧视觉（Trading Drops 收集展）
 *
 * session-19 重组（用户标注稿）：两块结构——
 * 左块 =「战利品陈列」（宝箱主视觉 + Common→Legendary 2×2 稀有度徽章），
 * 右块 = 从支柱 2 原样移植的 LootCard（"?" 黑盒点击开箱交互，组件仍定义在
 * game-grid.tsx，import 复用保证零样式漂移）。
 * 卡片语言对齐 GameGrid（rounded-2xl + border white/12 + 白 2.5% 底 + 左上标签），
 * 主强调色为支柱 3 的青色 #27FBE2。
 */

import { motion, useReducedMotion } from "framer-motion"
import { LootCard } from "@/components/features/game-grid"
import { RARITY_COLOR } from "@/lib/features-data"

const CYAN = "#27FBE2"

// -v2 文件名：session-19 重抠（flood-fill 230 阈值 + 白边腐蚀），并借改名
// 破掉用户浏览器对首版白底文件的缓存（同名覆盖不保证刷新）
const TIERS = [
  { key: "COMMON", img: "/images/drops/rarity-common-v2.webp", note: "The grind" },
  { key: "RARE", img: "/images/drops/rarity-rare-v2.webp", note: "Nice pull" },
  { key: "EPIC", img: "/images/drops/rarity-epic-v2.webp", note: "Chat pops off" },
  { key: "LEGENDARY", img: "/images/drops/rarity-legendary-v2.webp", note: "Screenshot it" },
] as const

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-6 top-4 z-10 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
      {children}
    </span>
  )
}

export function DropsScene() {
  const prefersReduced = useReducedMotion()
  return (
    // 两块结构：左 = 陈列（宝箱 + 2×2 徽章），右 = LootCard（items-stretch 让
    // 盲盒按钮随左列高度拉伸，内容 justify-center 自适居中，min-h 仍是下限）
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        {/* 宝箱主视觉卡：青色径向底光 + 缓慢浮动（reduced-motion 静止） */}
        <div
          className="relative flex flex-col items-center overflow-hidden rounded-2xl border pb-5 pt-10"
          style={{
            borderColor: "rgba(255,255,255,0.12)",
            background: "radial-gradient(ellipse at 50% 38%, rgba(39,251,226,0.10), rgba(255,255,255,0.02) 70%)",
          }}
        >
          <CardLabel>Trading Drops</CardLabel>
          <motion.img
            src="/images/drops/chest-v2.webp"
            alt=""
            className="h-[150px] w-auto md:h-[170px]"
            style={{ filter: "drop-shadow(0 18px 40px rgba(39,251,226,0.22))" }}
            animate={prefersReduced ? undefined : { y: [0, -10, 0] }}
            transition={prefersReduced ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: CYAN }}>
            Every box can hit legendary
          </div>
        </div>

        {/* 稀有度阶梯：2×2 弹幕徽章卡，边框/文字染稀有度色，legendary 带金光 */}
        <div className="grid flex-1 grid-cols-2 gap-4">
          {TIERS.map((t) => {
            const color = RARITY_COLOR[t.key]
            const legendary = t.key === "LEGENDARY"
            return (
              <div
                key={t.key}
                className="flex flex-col items-center justify-center rounded-2xl border px-3 pb-4 pt-4"
                style={{
                  borderColor: `${color}40`,
                  background: "rgba(255,255,255,0.025)",
                  boxShadow: legendary ? "0 0 28px rgba(254,223,0,0.18), inset 0 0 24px rgba(254,223,0,0.06)" : undefined,
                }}
              >
                <img src={t.img} alt="" className="h-[56px] w-[56px] object-contain md:h-[64px] md:w-[64px]" />
                <span
                  className="mt-2.5 text-[10px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color, textShadow: legendary ? "0 0 14px rgba(254,223,0,0.6)" : undefined }}
                >
                  {t.key}
                </span>
                <span className="mt-1 text-[10px] text-white/40">{t.note}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 从支柱 2 原样移植的可点击盲盒（含摇晃/白闪/开箱掉落交互） */}
      <LootCard />
    </div>
  )
}
