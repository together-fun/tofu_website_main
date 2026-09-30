"use client"

/**
 * smooth-scroll.tsx — Lenis 平滑滚动 provider（scroll-upgrade）
 *
 * - `<ReactLenis root />`：接管 window 滚动（跑在原生 scrollTop 上，
 *   position: sticky / framer-motion useScroll / 锚点 / 无障碍全部照常工作）
 * - 触屏保持原生滚动：syncTouch 默认 false，不动
 * - prefers-reduced-motion: reduce → Lenis 默认 respectReducedMotion: true，
 *   平滑自动禁用（lerp 强制 1，滚动 1:1 跟手），无需手动分支
 * - anchors: true：navbar/footer 的 #features / #community / #season2 锚点
 *   平滑滚到目标（Lenis 默认会拦掉锚点，必须显式开启）
 */

import "lenis/dist/lenis.css"
import { ReactLenis } from "lenis/react"

export function SmoothScroll() {
  return <ReactLenis root options={{ anchors: true }} />
}
