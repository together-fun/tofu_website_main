"use client"

/**
 * brandkit-content.tsx — Brand Kit 定稿内容（Gallery 卡片画廊风格为基底）。
 * 融合调整（session-22 用户裁定）：
 * - 页首用 Swiss Grid 的处理：左对齐白色大字 "Brand.\nAssets." + 绿点，无 badge；
 * - 04 · Type 两行式：Inter 主字体占主导样张，Silkscreen 次要（仅 logo/宣传物料）；
 * - 其余板块保留 Gallery：辉光气团、玻璃卡、发光下载胶囊、设备 mockup 壁纸。
 */

import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Download, X } from "lucide-react"
import Image from "next/image"
import { type ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  ACCENT_COLORS,
  type BrandColor,
  type BrandWallpaper,
  CORE_COLORS,
  LOGOS,
  RARITY_COLORS,
  SVG_NOTE,
  TYPEFACES,
  WALLPAPERS,
} from "@/components/brandkit/brandkit-data"
import { useCopy } from "@/components/brandkit/use-copy"

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

function Section({
  eyebrow,
  title,
  blurb,
  children,
}: {
  eyebrow: string
  title: string
  blurb?: string
  children: ReactNode
}) {
  return (
    <motion.section {...fadeUp} className="relative">
      <p
        className="text-xs font-bold uppercase tracking-[0.3em]"
        style={{ color: "#14F195" }}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
        {title}
      </h2>
      {blurb && <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/50">{blurb}</p>}
      <div className="mt-8">{children}</div>
    </motion.section>
  )
}

function CopyPill({
  color,
  copiedKey,
  onCopy,
  onDark,
}: {
  color: BrandColor
  copiedKey: string | null
  onCopy: (hex: string, key: string) => void
  /** 深色底上的浅色胶囊（放在玻璃条 / 深色卡上） */
  onDark?: boolean
}) {
  const key = `gal-${color.name}`
  const copied = copiedKey === key
  return (
    <button
      type="button"
      onClick={() => onCopy(color.hex, key)}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-bold transition-all hover:scale-105 ${
        onDark
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-black/25 text-black hover:bg-black/40 hover:text-white"
      }`}
      aria-label={`Copy ${color.hex}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : color.hex.toUpperCase()}
    </button>
  )
}

function DownloadPill({
  href,
  label,
  solid,
}: {
  href: string
  label: string
  solid?: boolean
}) {
  return (
    <a
      href={href}
      download
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all hover:scale-105 ${
        solid ? "text-black" : "border border-white/20 text-white hover:border-white/50"
      }`}
      style={
        solid
          ? { backgroundColor: "#14F195", boxShadow: "0 0 20px rgba(20,241,149,0.35)" }
          : undefined
      }
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </a>
  )
}

/** 壁纸 lightbox：全屏遮罩 + 居中大图（Esc / 点遮罩 / 右上 X 关闭，内置下载） */
function WallpaperLightbox({
  wallpaper,
  onClose,
}: {
  wallpaper: BrandWallpaper | null
  onClose: () => void
}) {
  // Esc 关闭 + 打开期间锁 body 滚动
  useEffect(() => {
    if (!wallpaper) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [wallpaper, onClose])

  // portal 挂 body：逃出内容层 z-10 的层叠上下文，确保盖过 fixed navbar（z-50）
  if (typeof document === "undefined") return null
  return createPortal(
    <AnimatePresence>
      {wallpaper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={wallpaper.name}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex max-h-full flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={wallpaper.file}
              alt={wallpaper.name}
              width={wallpaper.width}
              height={wallpaper.height}
              className={`h-auto w-auto rounded-2xl object-contain ${
                wallpaper.device === "mobile"
                  ? "max-h-[80vh] max-w-[92vw]"
                  : "max-h-[80vh] max-w-[94vw]"
              }`}
              style={{ boxShadow: "0 0 80px rgba(20,241,149,0.18)" }}
              sizes="94vw"
            />
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <p className="text-sm font-bold text-white">
                {wallpaper.name}
                <span className="ml-2 font-mono text-xs font-normal text-white/45">
                  {wallpaper.size}
                </span>
              </p>
              <DownloadPill href={wallpaper.file} label="Download" solid />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function BrandkitContent() {
  const { copiedKey, copy } = useCopy()
  const [lightbox, setLightbox] = useState<BrandWallpaper | null>(null)

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 lg:overflow-visible lg:px-10">
      {/* 品牌色辉光气团（纯装饰） */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #14F195, transparent)" }}
      />
      <div
        className="pointer-events-none absolute right-[-10rem] top-[38rem] h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #9945FF, transparent)" }}
      />
      <div
        className="pointer-events-none absolute left-[-12rem] top-[90rem] h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #27FBE2, transparent)" }}
      />

      {/* 页首：Swiss 式左对齐大字 + 绿点（无 badge、无渐变居中标题） */}
      <motion.header {...fadeUp} className="relative pb-16 pt-6 lg:pb-24">
        <h1 className="text-[clamp(3.25rem,11vw,8rem)] font-extrabold leading-[0.95] tracking-tighter text-white">
          Brand
          <span style={{ color: "#14F195" }}>.</span>
          <br />
          Assets
          <span style={{ color: "#14F195" }}>.</span>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-white/55">
          Colors, logos, type and wallpapers — tap any HEX to copy, hit download to grab the
          files.
        </p>
      </motion.header>

      <div className="relative flex flex-col gap-20 lg:gap-28">
        {/* 主色 — 整卡沉浸 */}
        <Section
          eyebrow="01 · Core"
          title="Two colors. One vibe."
          blurb="TOFU Green on Void Black is the whole identity — everything else is seasoning."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CORE_COLORS.map((c) => (
              <div
                key={c.name}
                className="group relative h-72 overflow-hidden rounded-3xl transition-transform duration-300 hover:scale-[1.015] lg:h-96"
                style={{
                  backgroundColor: c.hex,
                  boxShadow: c.darkText
                    ? `0 0 80px ${c.hex}33`
                    : "inset 0 0 0 1px rgba(255,255,255,0.12)",
                }}
              >
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <div>
                    <p
                      className="text-2xl font-extrabold tracking-tight"
                      style={{ color: c.darkText ? "#030303" : "#FFFFFF" }}
                    >
                      {c.name}
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: c.darkText ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.45)" }}
                    >
                      {c.source}
                    </p>
                  </div>
                  <CopyPill color={c} copiedKey={copiedKey} onCopy={copy} onDark={!c.darkText} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 辅助色 — 色块卡组 */}
        <Section
          eyebrow="02 · Accents"
          title="The supporting cast"
          blurb="Gradient partners, chat-level flexes and the one red that means business."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
            {ACCENT_COLORS.map((c) => (
              <div
                key={c.name}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.03] hover:border-white/25"
              >
                <button
                  type="button"
                  onClick={() => copy(c.hex, `gal-${c.name}`)}
                  className="block h-28 w-full cursor-pointer lg:h-32"
                  style={{ backgroundColor: c.hex }}
                  aria-label={`Copy ${c.hex}`}
                />
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-white">{c.name}</p>
                  <button
                    type="button"
                    onClick={() => copy(c.hex, `gal-${c.name}`)}
                    className="mt-1 font-mono text-xs text-white/45 transition-colors hover:text-[#14F195]"
                  >
                    {copiedKey === `gal-${c.name}` ? "Copied ✓" : c.hex.toUpperCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 稀有度 — 辉光卡 */}
        <Section
          eyebrow="03 · Rarity"
          title="Common to Legendary"
          blurb="The four-tier scale behind Trading Drops, danmaku styles and cosmetics."
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {RARITY_COLORS.map((c) => {
              const key = `gal-r-${c.name}`
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => copy(c.hex, key)}
                  className="glass group rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.03]"
                  style={{ boxShadow: `0 12px 48px ${c.hex}22` }}
                >
                  <span
                    className="block h-14 w-14 rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: c.hex, boxShadow: `0 0 32px ${c.hex}66` }}
                  />
                  <span
                    className="mt-4 block text-base font-extrabold uppercase tracking-wider"
                    style={{ color: c.hex }}
                  >
                    {c.name}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-white/45">
                    {copiedKey === key ? "Copied ✓" : c.hex.toUpperCase()}
                  </span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* 字体 — Swiss 两行式：Inter 主导，Silkscreen 次要（仅 logo/宣传物料） */}
        <Section
          eyebrow="04 · Type"
          title="Inter up front, pixels for the logo"
          blurb="Inter carries the entire platform. Silkscreen survives only in the logo and promo art."
        >
          <div className="flex flex-col gap-14">
            {TYPEFACES.map((t) => (
              <div key={t.name}>
                {/* 两行样张字号拉平（session-22 复调）：层级只靠徽章/注释/透明度区分 */}
                <p
                  className={`${t.className} break-words text-[clamp(2rem,6vw,4.5rem)] leading-tight ${
                    t.primary ? "font-semibold text-white" : "text-white/75"
                  }`}
                >
                  {t.specimen}
                </p>
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t border-white/10 pt-3">
                  <p className="flex items-baseline gap-2.5 text-sm font-bold text-white">
                    {t.name}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        t.primary ? "text-black" : "border border-white/20 text-white/60"
                      }`}
                      style={t.primary ? { backgroundColor: "#14F195" } : undefined}
                    >
                      {t.role}
                    </span>
                  </p>
                  <p className="text-xs text-white/40">{t.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Logo — 下载卡 */}
        <Section
          eyebrow="05 · Logo"
          title="The mark"
          blurb={`PNG for drop-in use, SVG container for tooling. ${SVG_NOTE}.`}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="glass group flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div
                  className="flex h-48 items-center justify-center px-8"
                  style={
                    logo.field === "green"
                      ? { backgroundColor: "#14F195" }
                      : { backgroundColor: "#030303" }
                  }
                >
                  <Image
                    src={logo.png}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                    className={
                      logo.width === logo.height
                        ? "h-24 w-auto transition-transform duration-300 group-hover:scale-105"
                        : "h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                    }
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm font-bold text-white">{logo.name}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {logo.note} · {logo.width} × {logo.height}
                  </p>
                  <div className="mt-4 flex gap-2 pt-1">
                    <DownloadPill href={logo.png} label="PNG" solid />
                    <DownloadPill href={logo.svg} label="SVG" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 壁纸 — 设备卡 */}
        <Section
          eyebrow="06 · Wallpapers"
          title="Squad Night, on every screen"
          blurb="The hero illustration, cropped and mastered for desktop and phone."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {WALLPAPERS.map((w) => (
              <div
                key={w.name}
                className="glass flex flex-col rounded-3xl p-6 transition-all duration-300 hover:scale-[1.01] lg:p-8"
              >
                <div className="flex flex-1 items-center justify-center">
                  {/* 点击 mockup 弹出 lightbox 放大查看 */}
                  {w.device === "desktop" ? (
                    <button
                      type="button"
                      onClick={() => setLightbox(w)}
                      className="w-full cursor-zoom-in"
                      aria-label={`Preview ${w.name}`}
                    >
                      {/* 显示器 mockup：深色边框屏幕 + 支架 */}
                      <span
                        className="block rounded-xl border border-white/15 bg-[#030303] p-2"
                        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
                      >
                        <Image
                          src={w.file}
                          alt={w.name}
                          width={w.width}
                          height={w.height}
                          className="aspect-video w-full rounded-lg object-cover"
                        />
                      </span>
                      <span className="mx-auto block h-6 w-16 bg-gradient-to-b from-white/15 to-transparent [clip-path:polygon(20%_0,80%_0,100%_100%,0_100%)]" />
                      <span className="mx-auto block h-1.5 w-28 rounded-full bg-white/15" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLightbox(w)}
                      className="relative w-48 cursor-zoom-in rounded-[2.25rem] border border-white/15 bg-[#030303] p-2 lg:w-56"
                      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
                      aria-label={`Preview ${w.name}`}
                    >
                      {/* 手机 mockup：圆角机身 + 灵动岛 */}
                      <Image
                        src={w.file}
                        alt={w.name}
                        width={w.width}
                        height={w.height}
                        className="aspect-[1170/2532] w-full rounded-[1.75rem] object-cover"
                      />
                      <span className="absolute left-1/2 top-4 h-4 w-16 -translate-x-1/2 rounded-full bg-black/80" />
                    </button>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-sm font-bold text-white">{w.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-white/40">{w.size}</p>
                  </div>
                  <DownloadPill href={w.file} label="Download" solid />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <WallpaperLightbox wallpaper={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
