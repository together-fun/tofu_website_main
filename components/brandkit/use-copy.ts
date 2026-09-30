"use client"

/**
 * use-copy.ts — Brand Kit 色板「点击 HEX 复制」的统一反馈 hook。
 * copy(value, key)：写剪贴板并把 key 标记为 copied 1.6s（同页多个按钮互不干扰）。
 */

import { useEffect, useRef, useState } from "react"

const HOLD_MS = 1600

export function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    []
  )

  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value).catch(() => {})
    setCopiedKey(key)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopiedKey(null), HOLD_MS)
  }

  return { copiedKey, copy }
}
