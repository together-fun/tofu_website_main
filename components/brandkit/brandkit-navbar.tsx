"use client"

/**
 * brandkit-navbar.tsx — Brand Kit 专用导航（navbar.tsx 的只读变体，不改原组件）。
 * 与 landing navbar 视觉一致（透明起步 / 滚动黑底 blur / 同款 Launch App 门控按钮），
 * 菜单项换成单个 "Back to Landing"。链接只有一个，手机端无需汉堡菜单。
 */

import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { APP_LIVE, APP_URL, COMING_SOON_LABEL } from "@/lib/site-flags"
import { useComingSoon } from "@/lib/use-coming-soon"

export function BrandkitNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLaunchHovered, setIsLaunchHovered] = useState(false)
  const { scrollY } = useScroll()
  const { comingSoon, trigger, nudgeClass } = useComingSoon()

  const openApp = () => {
    if (APP_LIVE) window.open(APP_URL, "_blank")
    trigger()
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 edge-x",
        isScrolled ? "py-3 bg-black/60 backdrop-blur-xl" : "py-4 lg:py-5 bg-transparent"
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

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-[#14F195]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="whitespace-nowrap">Back to Landing</span>
          </Link>
          <button
            type="button"
            className={`text-black px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap sm:min-w-[150px] ${APP_LIVE ? "" : "cursor-default"} ${nudgeClass}`}
            style={{
              backgroundColor: "#14F195",
              boxShadow: "0 0 20px rgba(20, 241, 149, 0.3)",
            }}
            onMouseEnter={(e) => {
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
      </div>
    </motion.nav>
  )
}
