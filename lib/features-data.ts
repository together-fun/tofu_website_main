/**
 * features-data.ts — Features 三支柱区假数据（单一来源）
 *
 * - token logo 为一次性从 R2 token-logo manifest（tofu-web-assets.together.fun/token-logo/）
 *   取回并本地化（public/images/tokens/），与前端项目同源。
 * - 盲盒掉落 / cosmetics 轨道复用 hero 的本地化装扮素材（public/images/cosmetics/）。
 */

export type DropRarity = "LEGENDARY" | "EPIC" | "RARE" | "COMMON"

/** 稀有度色（对齐前端 --rarity-* token：legendary 金 / epic 紫 / rare 绿 / common 灰）。 */
export const RARITY_COLOR: Record<DropRarity, string> = {
  LEGENDARY: "#fedf00",
  EPIC: "#9b48fb",
  RARE: "#14F195",
  COMMON: "#737d88",
}

const C = "/images/cosmetics"
const T = "/images/tokens"

export interface MarketChip {
  ticker: string
  logo: string
  change: string
  up: boolean
}

export const CRYPTO_MARKETS: MarketChip[] = [
  { ticker: "BTC", logo: `${T}/BTC.svg`, change: "+2.41%", up: true },
  { ticker: "ETH", logo: `${T}/ETH.svg`, change: "+1.84%", up: true },
  { ticker: "SOL", logo: `${T}/SOL.svg`, change: "+5.23%", up: true },
  { ticker: "HYPE", logo: `${T}/HYPE.svg`, change: "+9.12%", up: true },
  { ticker: "DOGE", logo: `${T}/DOGE.svg`, change: "-0.72%", up: false },
  { ticker: "FARTCOIN", logo: `${T}/FARTCOIN.svg`, change: "+6.40%", up: true },
  { ticker: "SUI", logo: `${T}/SUI.svg`, change: "+0.94%", up: true },
  { ticker: "XRP", logo: `${T}/XRP.svg`, change: "+1.12%", up: true },
  { ticker: "TRUMP", logo: `${T}/TRUMP.webp`, change: "+4.20%", up: true },
  { ticker: "LINK", logo: `${T}/LINK.svg`, change: "+2.05%", up: true },
  { ticker: "WIF", logo: `${T}/WIF.webp`, change: "-2.10%", up: false },
  { ticker: "AVAX", logo: `${T}/AVAX.svg`, change: "+3.37%", up: true },
  { ticker: "PURR", logo: `${T}/PURR.svg`, change: "+3.30%", up: true },
]

export const STOCK_MARKETS: MarketChip[] = [
  { ticker: "NVDA", logo: `${T}/cash_NVDA.svg`, change: "+3.08%", up: true },
  { ticker: "TSLA", logo: `${T}/cash_TSLA.svg`, change: "-1.22%", up: false },
  { ticker: "AMZN", logo: `${T}/cash_AMZN.svg`, change: "+1.90%", up: true },
  { ticker: "GOOGL", logo: `${T}/cash_GOOGL.svg`, change: "+0.86%", up: true },
  { ticker: "META", logo: `${T}/cash_META.svg`, change: "+1.44%", up: true },
  { ticker: "GOLD", logo: `${T}/cash_GOLD.svg`, change: "+0.34%", up: true },
  { ticker: "SP500", logo: `${T}/cash_USA500.svg`, change: "+0.61%", up: true },
  { ticker: "CRCL", logo: `${T}/flx_CRCL.svg`, change: "+4.70%", up: true },
]

export const PREDICTION_MARKETS: { q: string; yes: string }[] = [
  { q: "BTC above $150K by Dec?", yes: "YES 64%" },
  { q: "Fed cuts rates in Q1?", yes: "YES 41%" },
  { q: "ETH flips $10K this cycle?", yes: "YES 38%" },
  { q: "SOL ETF approved?", yes: "YES 72%" },
  { q: "New ATH this month?", yes: "YES 55%" },
]

/**
 * 盲盒掉落池（点击开盒循环滚出）。
 * 稀有度已与 manifest（tofu-api.together.fun/manifest/products，2026-08-03 实拉）逐个核对写死：
 * golden_sovereign_wings=LEGENDARY / green_candle_angel=EPIC / crowned_tofu_wings=EPIC /
 * four_point_amethyst=RARE / early_bird_gold=RARE / neon_point_green=COMMON
 */
export const LOOT_DROPS: {
  avatar: string
  frame: string
  rarity: DropRarity
  name: string
}[] = [
  {
    avatar: `${C}/avatar-to_the_moon_king.webp`,
    frame: `${C}/frame-golden_sovereign_wings.webp`,
    rarity: "LEGENDARY",
    name: "Golden Sovereign Wings",
  },
  {
    avatar: `${C}/avatar-crown_degen.webp`,
    frame: `${C}/frame-green_candle_angel.webp`,
    rarity: "EPIC",
    name: "Green Candle Angel",
  },
  {
    avatar: `${C}/avatar-ath_king.webp`,
    frame: `${C}/frame-crowned_tofu_wings.webp`,
    rarity: "EPIC",
    name: "Crowned Tofu Wings",
  },
  {
    avatar: `${C}/avatar-wagmi_warrior.webp`,
    frame: `${C}/frame-four_point_amethyst.webp`,
    rarity: "RARE",
    name: "Four-Point Amethyst",
  },
  {
    avatar: `${C}/avatar-banana_king.webp`,
    frame: `${C}/frame-early_bird_gold.webp`,
    rarity: "RARE",
    name: "Early Bird Gold",
  },
]

/** Cosmetics 跑马灯轨道（头像 + 框 + 稀有度标签）。 */
export const COSMETIC_RAIL: {
  avatar: string
  frame: string
  rarity: DropRarity
}[] = [
  { avatar: `${C}/avatar-to_the_moon_king.webp`, frame: `${C}/frame-golden_sovereign_wings.webp`, rarity: "LEGENDARY" },
  { avatar: `${C}/avatar-wagmi_warrior.webp`, frame: `${C}/frame-four_point_amethyst.webp`, rarity: "RARE" },
  { avatar: `${C}/avatar-ath_king.webp`, frame: `${C}/frame-crowned_tofu_wings.webp`, rarity: "EPIC" },
  { avatar: `${C}/avatar-crown_degen.webp`, frame: `${C}/frame-green_candle_angel.webp`, rarity: "EPIC" },
  { avatar: `${C}/avatar-banana_king.webp`, frame: `${C}/frame-early_bird_gold.webp`, rarity: "RARE" },
  { avatar: `${C}/avatar-laser_eyes_lite.webp`, frame: `${C}/frame-neon_point_green.webp`, rarity: "COMMON" },
  { avatar: `${C}/avatar-gold_standard_knight.webp`, frame: `${C}/frame-crowned_tofu_wings.webp`, rarity: "EPIC" },
  { avatar: `${C}/avatar-money_printer.webp`, frame: `${C}/frame-golden_sovereign_wings.webp`, rarity: "LEGENDARY" },
]
