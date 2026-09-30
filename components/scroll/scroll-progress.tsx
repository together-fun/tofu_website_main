"use client"

/**
 * scroll-progress.tsx — 顶部滚动进度条（scroll-upgrade d3）
 *
 * fixed top 2px 细条，品牌绿 #14F195，scaleX 由 useScroll().scrollYProgress 驱动
 * （transform-only，零重排）。z-[60] 盖过 navbar（z-50）；手机同样显示。
 *
 * mount gate：SSR 与客户端首次渲染都返回 null，挂载后才渲染 motion.div。
 * 原因：motion value 驱动的 style 在 SSR/客户端首帧可能产出不同内联样式，
 * 曾触发 Next 16 hydration mismatch（客户端多出本组件的 div）。进度条在
 * scrollY=0 时本来就不可见（scaleX 0），晚一帧渲染无视觉差异。
 */

import { motion, useScroll } from "framer-motion"
import { useEffect, useState } from "react"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{
        scaleX: scrollYProgress,
        backgroundColor: "#14F195",
        boxShadow: "0 0 8px rgba(20, 241, 149, 0.6)",
      }}
    />
  )
}
