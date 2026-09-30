"use client"

/**
 * hero-cover.tsx — hero 钉住 + 下方章节「覆盖」过渡（scroll-upgrade b）
 *
 * 结构：
 *   <div relative>                    ← sticky 边界：hero 只在本容器内钉住，
 *     <div sticky top-0 h-svh z-0>       滚过 children（features）后自然释放
 *       <motion.div scale>hero</motion.div>
 *       <motion.div dim 遮罩 />
 *     </div>
 *     <div ref relative z-10>children</div>  ← 从下方盖上来（children 需不透明底）
 *   </div>
 *
 * - 覆盖进度 = children 顶边从视口底(0)滑到视口顶(1)，useScroll target 量的是
 *   非 sticky 的 children 容器（sticky 元素自身 offset 不可靠）
 * - 被盖时 hero 轻微缩小（1 → 0.96）+ 压暗（黑遮罩 0 → 0.6）
 * - 手机（<1024px）保留 sticky 覆盖但去掉 scale 视差（iOS Safari 稳定优先）；
 *   prefers-reduced-motion 下 scale/dim 全部禁用，只剩普通覆盖滚动
 * - z 层级：sticky 层 z-0（有 z-index → 形成 stacking context，内部遮罩不会
 *   漏到 children 之上）、children z-10；navbar fixed z-50 恒在最上
 */

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export function HeroCover({ hero, children }: { hero: React.ReactNode; children: React.ReactNode }) {
  const coverRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ["start end", "start start"],
  })

  const prefersReduced = useReducedMotion()
  // 桌面判定（SSR/首帧为 false → 无 transform，无 hydration mismatch）
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96])
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.6])
  const useParallax = isDesktop && !prefersReduced

  return (
    <div className="relative">
      <div className="sticky top-0 z-0 h-svh overflow-hidden">
        {/* will-change-transform：静止时 framer 输出 transform:none，首滚 scale 变为
            非恒等瞬间才提升合成层 → 全屏 hero 整层栅格化，实测首滚掉一帧 ~100ms。
            预提层后首滚只做合成（实测复验帧间隔恢复正常） */}
        <motion.div
          style={useParallax ? { scale } : undefined}
          className={`h-full ${useParallax ? "will-change-transform" : ""}`}
        >
          {hero}
        </motion.div>
        <motion.div
          aria-hidden
          style={prefersReduced ? undefined : { opacity: dim }}
          className="pointer-events-none absolute inset-0 bg-black opacity-0 will-change-[opacity]"
        />
      </div>
      <div ref={coverRef} className="relative z-10">
        {children}
      </div>
    </div>
  )
}
