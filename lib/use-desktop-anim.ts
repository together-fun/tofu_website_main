"use client"

import { useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * 入场动画 gate（session-19 手机回归根因修复）：
 * whileInView / initial:{opacity:0} 一类入场动画只在「桌面 + 非 reduced-motion」
 * 下挂载。手机端（<lg）一律纯静态完整渲染 —— SSR HTML 不内联 opacity:0，
 * 即使 hydration 慢、JS 失败或 IntersectionObserver 不触发，内容也绝不会被藏。
 *
 * SSR / 首帧恒为 false（先静态、后升级），因此桌面在 hydrate 前同样输出
 * 完整可见的 HTML，入场动画属于渐进增强。
 */
export function useDesktopAnim(): boolean {
  const prefersReduced = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return isDesktop && !prefersReduced
}
