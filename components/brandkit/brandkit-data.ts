/**
 * brandkit-data.ts — Brand Kit 页面唯一数据源（色板 / logo / 壁纸 / 字体）。
 *
 * 色值全部取自仓库真实使用处，不编造：
 * - #14F195 / #030303：品牌绿与品牌黑（navbar / hero CTA / footer 硬编码 + 项目规范）
 * - #9945FF / #27FBE2 / #F357E2 / #FAF518：hero 标题渐变与聊天等级色（lib/hero-data.ts）
 * - #FD2A37：globals.css `.dark` 的 --destructive-foreground oklch(0.64 0.24 25) 换算
 * - 稀有度四色：lib/features-data.ts RARITY_COLOR / components/cta-roster-bg.tsx RARITY_BAR
 */

export interface BrandColor {
  name: string
  hex: string
  /** 取值出处（展示在卡片上的 token/来源说明） */
  source: string
  /** 亮色 swatch 上文字用黑色 */
  darkText?: boolean
}

export const CORE_COLORS: BrandColor[] = [
  {
    name: "TOFU Green",
    hex: "#14F195",
    source: "Primary brand — CTA, links, live badge",
    darkText: true,
  },
  {
    name: "Void Black",
    hex: "#030303",
    source: "Brand black — page canvas, icon glyphs",
  },
]

export const ACCENT_COLORS: BrandColor[] = [
  { name: "Aurora Purple", hex: "#9945FF", source: "Hero gradient / Season 1", darkText: false },
  { name: "Signal Cyan", hex: "#27FBE2", source: "Hero gradient / glitch lines", darkText: true },
  { name: "Pulse Magenta", hex: "#F357E2", source: "Chat level 50+ username", darkText: true },
  { name: "Volt Yellow", hex: "#FAF518", source: "Chat level 70+ username", darkText: true },
  { name: "Alert Red", hex: "#FD2A37", source: "--destructive-foreground (.dark)", darkText: false },
]

export const RARITY_COLORS: BrandColor[] = [
  { name: "Common", hex: "#737D88", source: "RARITY_COLOR.COMMON", darkText: false },
  { name: "Rare", hex: "#14F195", source: "RARITY_COLOR.RARE", darkText: true },
  { name: "Epic", hex: "#9B48FB", source: "RARITY_COLOR.EPIC", darkText: false },
  { name: "Legendary", hex: "#FEDF00", source: "RARITY_COLOR.LEGENDARY", darkText: true },
]

export interface BrandLogo {
  name: string
  note: string
  png: string
  svg: string
  width: number
  height: number
  /** 预览底色：黑底（绿 logo）或品牌绿底（黑 logo） */
  field: "black" | "green"
}

export const LOGOS: BrandLogo[] = [
  {
    name: "App Icon",
    note: "Square mark · glyphs on TOFU Green",
    png: "/brandkit/tofu-logo-mark-green.png",
    svg: "/brandkit/tofu-logo-mark-green.svg",
    width: 909,
    height: 909,
    field: "black",
  },
  {
    name: "Wordmark — Green",
    note: "Bordered lockup · for dark surfaces",
    png: "/brandkit/tofu-logo-wordmark-green.png",
    svg: "/brandkit/tofu-logo-wordmark-green.svg",
    width: 1639,
    height: 590,
    field: "black",
  },
  {
    name: "Wordmark — Black",
    note: "Borderless lockup · for green / light surfaces",
    png: "/brandkit/tofu-logo-wordmark-black.png",
    svg: "/brandkit/tofu-logo-wordmark-black.svg",
    width: 2036,
    height: 432,
    field: "green",
  },
]

/** 无矢量源：SVG 为内嵌原生分辨率位图的容器格式（备注展示在页面上，避免误导） */
export const SVG_NOTE = "SVG wraps the native-res raster (no vector source yet)"

export interface BrandWallpaper {
  name: string
  device: "desktop" | "mobile"
  size: string
  file: string
  width: number
  height: number
}

export const WALLPAPERS: BrandWallpaper[] = [
  {
    name: "Squad Night — Desktop",
    device: "desktop",
    size: "2560 × 1440",
    file: "/brandkit/tofu-wallpaper-desktop-2560x1440.png",
    width: 2560,
    height: 1440,
  },
  {
    name: "Squad Night — Mobile",
    device: "mobile",
    size: "1170 × 2532",
    file: "/brandkit/tofu-wallpaper-mobile-1170x2532.png",
    width: 1170,
    height: 2532,
  },
]

export interface BrandTypeface {
  name: string
  role: string
  note: string
  className: string
  specimen: string
  /** 主字体：样张占主导尺寸 */
  primary?: boolean
}

/** Inter 为全站主字体（交易平台正文/UI）；Silkscreen 仅限 logo 与宣传物料（headline 已弃用） */
export const TYPEFACES: BrandTypeface[] = [
  {
    name: "Inter",
    role: "Primary",
    note: "UI, product & body copy across the platform",
    className: "font-sans",
    specimen: "Trade with vibes, not charts.",
    primary: true,
  },
  {
    name: "Silkscreen",
    role: "Display",
    note: "Logo & promo use only — retired from headlines",
    className: "font-display",
    specimen: "TOGETHER WE FARM FUN",
  },
]
