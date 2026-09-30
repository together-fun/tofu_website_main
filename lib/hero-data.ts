/**
 * hero-data.ts — Hero 聊天室 / 弹幕假数据（单一来源）
 *
 * 装扮素材为一次性从 https://tofu-api.together.fun/manifest/products 取回并本地化
 * （public/images/cosmetics/）。等级 → 徽章图 / 名字颜色映射 1:1 对齐前端项目
 * `lib/chat-level/tiers.ts` + `name-style.ts`。
 */

import type { CSSProperties } from "react"

export type Rarity = "common" | "rare" | "epic" | "legendary"

export interface HeroUser {
  name: string
  level: number
  avatar: string
  /** 头像框（absolute inset:-30% 叠加，视觉 1.6×）。可空。 */
  frame?: string
  rarity: Rarity
}

const C = "/images/cosmetics"

export const HERO_USERS: HeroUser[] = [
  {
    name: "CryptoKing",
    level: 78,
    avatar: `${C}/avatar-to_the_moon_king.webp`,
    frame: `${C}/frame-golden_sovereign_wings.webp`,
    rarity: "legendary",
  },
  {
    name: "AlphaWhale",
    level: 64,
    avatar: `${C}/avatar-ath_king.webp`,
    frame: `${C}/frame-crowned_tofu_wings.webp`,
    rarity: "epic",
  },
  {
    name: "PixelRonin",
    level: 41,
    avatar: `${C}/avatar-wagmi_warrior.webp`,
    frame: `${C}/frame-four_point_amethyst.webp`,
    rarity: "rare",
  },
  {
    name: "MoonFarmer",
    level: 92,
    avatar: `${C}/avatar-crown_degen.webp`,
    frame: `${C}/frame-green_candle_angel.webp`,
    rarity: "legendary",
  },
  {
    name: "DipHunter",
    level: 27,
    avatar: `${C}/avatar-banana_king.webp`,
    frame: `${C}/frame-early_bird_gold.webp`,
    rarity: "rare",
  },
  {
    name: "GasGoblin",
    level: 12,
    avatar: `${C}/avatar-laser_eyes_lite.webp`,
    frame: `${C}/frame-neon_point_green.webp`,
    rarity: "common",
  },
  {
    name: "PrintooorX",
    level: 55,
    avatar: `${C}/avatar-money_printer.webp`,
    rarity: "epic",
  },
  {
    name: "SerKnight",
    level: 70,
    avatar: `${C}/avatar-gold_standard_knight.webp`,
    frame: `${C}/frame-crowned_tofu_wings.webp`,
    rarity: "epic",
  },
]

/** 聊天消息池（顺序循环播放；global=世界聊天样式行）。 */
export const CHAT_MESSAGES: { user: number; text: string; global?: boolean }[] = [
  { user: 0, text: "Just closed another 12x. Who's still holding $TOFU? 🔥💎" },
  { user: 1, text: "Accumulating on every dip. Patience always wins. 🐋" },
  { user: 2, text: "LOOL" },
  { user: 3, text: "GOGOGOGO 🚀🚀🚀" },
  { user: 4, text: "wen moon ser 👀" },
  { user: 5, text: "gas is free when the vibes are high" },
  { user: 6, text: "money printer goes brrrrr", global: true },
  { user: 7, text: "this chart is pure art ngl 📈" },
  { user: 2, text: "nice chart 👀" },
  { user: 0, text: "Bullish 📈" },
  { user: 4, text: "farming XP all night, no sleep szn" },
  { user: 1, text: "size matters. the order book feels me." },
  { user: 3, text: "LFG! 🚀" },
  { user: 6, text: "who else aped the together moment?" },
  { user: 5, text: "paper hands left the chat" },
  { user: 7, text: "WAGMI. see you all at ATH 🏆" },
]

/** 弹幕消息池（胶囊：@name + 正文）。 */
export const DANMAKU_MESSAGES: { user: number; text: string }[] = [
  { user: 2, text: "nice chart 👀" },
  { user: 0, text: "Bullish 📈" },
  { user: 3, text: "LFG! 🚀" },
  { user: 4, text: "wen moon? 🌕" },
  { user: 1, text: "whale spotted 🐋" },
  { user: 5, text: "gm gm gm" },
  { user: 6, text: "printer goes brr" },
  { user: 7, text: "up only ☝️" },
  { user: 0, text: "12x and counting 🔥" },
  { user: 3, text: "GOGOGOGO" },
  { user: 2, text: "LOOL" },
  { user: 1, text: "buy the dip" },
]

// ============================================================================
// 等级 → 徽章 / 名字颜色（1:1 对齐前端 tiers.ts / name-style.ts）
// ============================================================================

/** 12 档 imageId 区间（minLevel 升序），同前端 CHAT_LEVEL_TIERS。 */
const TIER_BOUNDS: { imageId: number; min: number }[] = [
  { imageId: 0, min: 1 },
  { imageId: 1, min: 2 },
  { imageId: 2, min: 10 },
  { imageId: 3, min: 20 },
  { imageId: 4, min: 30 },
  { imageId: 5, min: 40 },
  { imageId: 6, min: 50 },
  { imageId: 7, min: 60 },
  { imageId: 8, min: 70 },
  { imageId: 9, min: 80 },
  { imageId: 10, min: 90 },
  { imageId: 11, min: 99 },
]

export function getTierImageId(level: number): number {
  let id = 0
  for (const t of TIER_BOUNDS) if (level >= t.min) id = t.imageId
  return id
}

/** 名字着色：Lv10-29 绿 / 30-49 紫 / 50-69 品红 / 70-89 金 / 90+ 品牌渐变（同前端 CLASS_HEX + BRAND_GRADIENT）。 */
export function getLevelNameStyle(level: number): { className: string; style?: CSSProperties } {
  if (level >= 90)
    return {
      className: "bg-clip-text text-transparent",
      style: { backgroundImage: "linear-gradient(90deg, #fedf00, #14F195, #FAF518)" },
    }
  if (level >= 70) return { className: "", style: { color: "#FAF518" } }
  if (level >= 50) return { className: "", style: { color: "#F357E2" } }
  if (level >= 30) return { className: "", style: { color: "#9945FF" } }
  if (level >= 10) return { className: "", style: { color: "#14F195" } }
  return { className: "" }
}

/** 弹幕稀有度视觉基线（对齐 lib/danmaku/rarity.ts；字号为 hero 场景等比缩一档）。 */
export const DANMAKU_RARITY: Record<
  Rarity,
  { fontSize: number; fontWeight: number; color: string; personColor: string }
> = {
  common: { fontSize: 16, fontWeight: 400, color: "#ffffff", personColor: "#14F195" },
  rare: { fontSize: 16, fontWeight: 400, color: "#14f195", personColor: "#14F195" },
  epic: { fontSize: 18, fontWeight: 600, color: "#9b48fb", personColor: "#9b48fb" },
  legendary: { fontSize: 20, fontWeight: 800, color: "#fedf00", personColor: "#fedf00" },
}
