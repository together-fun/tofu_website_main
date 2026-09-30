"use client"

/**
 * use-coming-soon.ts — APP_LIVE 门控按钮的统一点击反馈（session-20）
 *
 * 手机无 hover，用户永远看不到 hover 版 "Coming Soon"。统一改为：点击门控
 * 按钮时文案切成 COMING_SOON_LABEL 保持 1.4s 后自动回弹，并配一次轻微震动
 * （globals.css 的 .coming-soon-nudge）。桌面 hover 行为由各组件自留，点击
 * 同样触发本反馈（无害）。
 *
 * APP_LIVE=true 时 trigger 是 no-op —— 跳转 App 的逻辑仍归各组件（hero 是
 * <a href>、navbar/season2 是 window.open），本 hook 只管未上线反馈。
 */

import { useEffect, useRef, useState } from "react"
import { APP_LIVE } from "@/lib/site-flags"

const HOLD_MS = 1400

export function useComingSoon() {
  const [comingSoon, setComingSoon] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    []
  )

  const trigger = () => {
    if (APP_LIVE) return
    setComingSoon(true)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setComingSoon(false), HOLD_MS)
  }

  /** 震动动画类：active 时挂上，回弹时移除（动画本身 0.36s 播一次即停） */
  const nudgeClass = comingSoon ? "coming-soon-nudge" : ""

  return { comingSoon, trigger, nudgeClass }
}
