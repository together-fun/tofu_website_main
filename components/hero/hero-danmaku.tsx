"use client"

/**
 * hero-danmaku.tsx — CSS/DOM 弹幕（胶囊 + 头像 + 消息）
 *
 * 视觉 1:1 对齐前端 danmaku-worker `bakeCardSprite`：
 * 高 = 头像D+6、圆角 H/2、底 rgba(20,23,27,0.42)、头像 2px 彩环、@name 用 personColor、
 * 间距 左4/头像-名8/名-文8/右14。运动基准 9000ms ±10% linear（站内 SCROLL_DURATION_MS=7500，
 * 落地页有意放慢一档，阅读更从容）。
 * （胶囊样式类 `.danmaku-pill` 定义在 globals.css。）
 */

import { useEffect, useRef, useState } from "react"
import { DANMAKU_MESSAGES, DANMAKU_RARITY, HERO_USERS } from "@/lib/hero-data"

const BASE_DURATION = 9000
const DURATION_JITTER = 0.1
/** 同轨最小生成间隔（节奏控制；防叠靠下面的几何闸，不靠它）。 */
const LANE_COOLDOWN = 3600
/** 几何闸：同轨上一条胶囊右缘须让开容器右缘至少这么多像素，才允许生成下一条。 */
const LANE_CLEAR_GAP = 32

interface Pill {
  id: number
  lane: number
  user: number
  text: string
  duration: number
}

interface HeroDanmakuProps {
  lanes: number
  /** 生成间隔基准 ms（±30% 抖动）。 */
  spawnInterval?: number
  /** 单条飞行时长基准 ms（±10% 抖动）。窄容器（如 features 终端）可传更大值放慢。 */
  baseDuration?: number
  className?: string
}

export function HeroDanmaku({
  lanes,
  spawnInterval = 1300,
  baseDuration = BASE_DURATION,
  className = "",
}: HeroDanmakuProps) {
  const [pills, setPills] = useState<Pill[]>([])
  const nextId = useRef(0)
  const nextMsg = useRef(0)
  const laneFreeAt = useRef<number[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  /** 每轨最新一条胶囊的 DOM（几何闸用；动画结束移除后 rect 归零 = 自然视为已让开）。 */
  const laneLastEl = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let timer: ReturnType<typeof setTimeout> | undefined
    const spawn = () => {
      // 防叠根治（第二次复发后立规）：时钟节流挡不住主线程 stall——初载/大图解码时
      // CSS 动画会在首个可用帧同时启动，先后生成的胶囊永久叠在一起。唯一可靠判据是
      // **真实渲染位置**：同轨上一条（getBoundingClientRect 含动画 transform）没让开
      // 容器右缘 + LANE_CLEAR_GAP 就不生成。未来任何改动不得移除此几何闸。
      const cont = containerRef.current
      const contRect = cont?.getBoundingClientRect()
      if (!document.hidden && contRect && contRect.width > 0) {
        const now = Date.now()
        const free: number[] = []
        for (let l = 0; l < lanes; l++) {
          if ((laneFreeAt.current[l] ?? 0) > now) continue
          const last = laneLastEl.current.get(l)
          if (last && last.getBoundingClientRect().right >= contRect.right - LANE_CLEAR_GAP) continue
          free.push(l)
        }
        if (free.length > 0) {
          const lane = free[Math.floor(Math.random() * free.length)]
          laneFreeAt.current[lane] = now + LANE_COOLDOWN
          const msg = DANMAKU_MESSAGES[nextMsg.current % DANMAKU_MESSAGES.length]
          nextMsg.current++
          const duration = Math.round(baseDuration * (1 - DURATION_JITTER + Math.random() * DURATION_JITTER * 2))
          setPills((prev) => [...prev, { id: nextId.current++, lane, user: msg.user, text: msg.text, duration }])
        }
      }
      timer = setTimeout(spawn, spawnInterval * (0.7 + Math.random() * 0.6))
    }
    // 首批拥挤根因：初载期主线程繁忙（hydration/图片解码），先入队胶囊的 CSS 动画
    // 会在首个可用帧同时启动而永久叠在一起。等 window load 后再稳定 600ms 才开始生成。
    let cancelled = false
    const start = () => {
      if (cancelled) return
      timer = setTimeout(spawn, 600)
    }
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener("load", start)
      if (timer) clearTimeout(timer)
    }
  }, [lanes, spawnInterval, baseDuration])

  return (
    <div ref={containerRef} className={`overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {pills.map((pill) => {
        const user = HERO_USERS[pill.user]
        const r = DANMAKU_RARITY[user.rarity]
        // 头像直径 = round(fontSize × 1.25)，胶囊高 = D + 6（worker 同款推导）
        const d = Math.round(r.fontSize * 1.25)
        const h = d + 6
        // 轨道按容器高度均分（第 lane 轨中心 = (lane+0.5)/lanes）：
        // 小容器（~128px/3 轨）与旧 42px 固定行高几乎等价，大容器（手机 hero）则均匀铺满。
        const laneCenter = ((pill.lane + 0.5) * 100) / lanes
        return (
          <div
            key={pill.id}
            ref={(el) => {
              if (el) laneLastEl.current.set(pill.lane, el)
            }}
            className="danmaku-pill"
            style={{
              top: `calc(${laneCenter.toFixed(3)}% - ${h / 2}px)`,
              height: h,
              fontSize: r.fontSize,
              fontWeight: r.fontWeight,
              animationDuration: `${pill.duration}ms`,
            }}
            onAnimationEnd={() => setPills((prev) => prev.filter((p) => p.id !== pill.id))}
          >
            <img
              src={user.avatar}
              alt=""
              className="rounded-full object-cover shrink-0 box-border"
              style={{ width: d, height: d, border: `2px solid ${r.personColor}` }}
            />
            <span style={{ color: r.personColor, marginLeft: 8 }}>@{user.name.toLowerCase()}</span>
            <span style={{ color: r.color, marginLeft: 8 }}>{pill.text}</span>
          </div>
        )
      })}
    </div>
  )
}
