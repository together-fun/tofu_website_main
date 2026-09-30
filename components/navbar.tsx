"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { APP_LIVE, APP_URL, COMING_SOON_LABEL } from "@/lib/site-flags"
import { useComingSoon } from "@/lib/use-coming-soon"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLaunchHovered, setIsLaunchHovered] = useState(false)
  const { scrollY } = useScroll()
  // session-20：未上线时点击门控按钮 → 文案切 Coming Soon 1.4s + 震动（手机无 hover 的替代反馈）
  const { comingSoon, trigger, nudgeClass } = useComingSoon()

  const openApp = () => {
    if (APP_LIVE) window.open(APP_URL, "_blank")
    trigger()
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const navLinks: { name: string; href: string; external?: boolean }[] = [
    { name: "Features", href: "#features" },
    { name: "Community", href: "#community" },
    { name: "Docs", href: "https://docs.together.fun/", external: true },
  ]

  return (
    // 全出血透明导航：logo 贴左、链接贴右，与 hero 文字共用 --edge 对齐线（.edge-x）。
    // 顶部无背景条（hero 自带顶部渐变衬底）；滚动后半透明黑 + blur 保证跨区块可读。
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 edge-x",
        isScrolled ? "py-3 bg-black/60 backdrop-blur-xl" : "py-4 lg:py-5 bg-transparent",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="relative z-50 flex shrink-0 items-center gap-2 hover:scale-105 transition-transform"
        >
          <Image
            src="/images/logo-square-green.png"
            alt="Together.fun"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-[10px]"
            sizes="40px"
          />
        </Link>

        {/* Desktop Menu — lg 起显示，较窄窗口即切换为汉堡菜单，避免挤压 Logo */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink min-w-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm font-medium text-white/70 transition-colors"
              style={{
                transitionProperty: "color",
                transitionDuration: "200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#14F195"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"
              }}
            >
              {link.name}
            </Link>
          ))}
          <button
            className={`text-black px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${APP_LIVE ? "" : "cursor-default"} ${nudgeClass}`}
            style={{
              backgroundColor: "#14F195",
              boxShadow: "0 0 20px rgba(20, 241, 149, 0.3)",
              minWidth: "150px",
            }}
            onMouseEnter={(e) => {
              // 触屏 tap 的模拟 mouseenter 会让 hover 文案粘滞，(hover:hover) 守卫只在鼠标设备生效
              if (window.matchMedia("(hover: hover)").matches) setIsLaunchHovered(true)
              e.currentTarget.style.transform = "scale(1.05)"
              e.currentTarget.style.backgroundColor = "#0FD985"
            }}
            onMouseLeave={(e) => {
              setIsLaunchHovered(false)
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.backgroundColor = "#14F195"
            }}
            onClick={openApp}
          >
            {!APP_LIVE && (isLaunchHovered || comingSoon) ? COMING_SOON_LABEL : "Launch App"}
          </button>
        </div>

        {/* Mobile / tablet menu toggle */}
        <button
          type="button"
          className="lg:hidden relative z-50 shrink-0 text-white p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl bg-black/95 border border-white/10 z-40 lg:hidden"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-3 text-lg text-white transition-colors hover:bg-white/5"
                  style={{ transitionDuration: "200ms" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#14F195"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#FFFFFF"
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-6 pt-3 flex flex-col gap-3">
                <button
                  className={`w-full text-black px-6 py-3 rounded-full text-base font-bold transition-transform ${nudgeClass}`}
                  style={{ backgroundColor: "#14F195" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                  onClick={openApp}
                >
                  {/* session-21 统一：平时显示原文案，点击切 Coming Soon 1.4s 回弹（同 hero） */}
                  {!APP_LIVE && comingSoon ? COMING_SOON_LABEL : "Launch App"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
