"use client"

/**
 * hero-live-frame.tsx — hero 右侧「实时直播取景框」overlay（参照 docs/assets/session-6_*.png）
 *
 * - 四角白色镜头框（L 形，64px 长臂）+ 左上 ● REC + 右上 FPS（57–61 随机跳动，模拟实时帧率）
 * - 框内直播质感（.live-* 见 globals.css）：阈值化稀疏雪花点 + 暗色滚动带 + 偶发信号故障线
 *   （session-8 铁律：框内不允许任何整体提亮/白色遮罩感，避免与框外产生色差）
 * - 入场：四角依次弹入 → REC / FPS 浮现 → 噪点淡入（staggerChildren）
 * - 布局：左缘 27%、与左侧标题保持距离；顶部 clamp(60,8vh,88) 让开 navbar
 * - 纯装饰层：pointer-events-none + aria-hidden；仅桌面渲染（调用处 hidden lg:block），
 *   手机端不显示、布局不受影响
 */

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

const FPS_MIN = 57
const FPS_RANGE = 5 // 57–61
const FPS_TICK_MS = 800

const CORNERS = [
  "left-0 top-0 border-l-4 border-t-4 rounded-tl-md",
  "right-0 top-0 border-r-4 border-t-4 rounded-tr-md",
  "left-0 bottom-0 border-l-4 border-b-4 rounded-bl-md",
  "right-0 bottom-0 border-r-4 border-b-4 rounded-br-md",
] as const

const cornerVariants = {
  hidden: { opacity: 0, scale: 1.3 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
}

const hudVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

// 信号中断区间（以「features 覆盖 hero 的进度 = scrollY / 视口高」计）：
// 0.30–0.62 故障闪烁 + NO SIGNAL 演出，0.45–0.62 整框淡出；回滚回 hero 自动恢复（映射双向）。
// 雪花渐强（session-13）：噪点 opacity 随进度 [0 → 0.3 → 0.45] 线性升 [0.25 → 0.5 → 0.8]，
// 「信号越来越差」有连续感；静止时 removeProperty 回落 CSS 基础值 0.25。
// 铁律（用户裁定）：静止（scrollY=0）时不写任何内联样式/类，
// 开屏视觉与滚动特效之前（c8a0330）逐像素一致，只有开始下拉才触发。
const BREAK_START = 0.3
const BREAK_END = 0.62
const FADE_START = 0.45
// 雪花渐强曲线锚点（见上）
const NOISE_BASE = 0.25
const NOISE_MID = 0.5
const NOISE_PEAK = 0.8

export function HeroLiveFrame({ className = "" }: { className?: string }) {
  // FPS 跳动改为 DOM 直写（session-13）：原 setState 方案与断线期直写 "FPS --" 冲突
  //（re-render 会操作已被 textContent 替换的文本节点）。现在整个子树零 React 状态，
  // interval 与 scroll effect 都直写同一节点，用 breakingRef 协调优先级。
  const breakingRef = useRef(false)
  const fpsTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = window.setInterval(() => {
      if (document.hidden || breakingRef.current || !fpsTextRef.current) return
      fpsTextRef.current.textContent = `FPS ${FPS_MIN + Math.floor(Math.random() * FPS_RANGE)}`
    }, FPS_TICK_MS)
    return () => window.clearInterval(t)
  }, [])

  // 滚动驱动的「信号中断」（scroll-upgrade d1 重构版）：
  // - mount 后（useEffect 内）才订阅原生 scroll 事件，rAF 节流后直接写 DOM
  //   （classList / style.opacity），零 setState、零 SSR 内联样式差异
  // - scrollY=0 时移除一切内联样式与类 → 静止 DOM 与 c8a0330 完全一致
  // - hero 被 sticky 钉住不动，覆盖进度 = scrollY / 视口高
  const rootRef = useRef<HTMLDivElement>(null)
  const breakRef = useRef<HTMLDivElement>(null)
  const noiseRef = useRef<HTMLDivElement>(null)
  const noSignalRef = useRef<HTMLDivElement>(null)
  const recDotRef = useRef<HTMLSpanElement>(null)
  const recTextRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const root = rootRef.current
    const layer = breakRef.current
    const noise = noiseRef.current
    const noSignal = noSignalRef.current
    const recDot = recDotRef.current
    const recText = recTextRef.current
    const fpsText = fpsTextRef.current
    if (!root || !layer || !noise || !noSignal || !recDot || !recText || !fpsText) return
    let raf = 0
    let wasBreaking = false
    const apply = () => {
      raf = 0
      const p = window.scrollY / (window.innerHeight || 1)
      const breaking = p > BREAK_START && p < BREAK_END
      layer.classList.toggle("live-signal-break", breaking)

      // 雪花渐强：静止移除内联样式回落 CSS 基础值（保静止态零变化）
      if (p <= 0) {
        noise.style.removeProperty("opacity")
      } else {
        const o =
          p < BREAK_START
            ? NOISE_BASE + (p / BREAK_START) * (NOISE_MID - NOISE_BASE)
            : p < FADE_START
              ? NOISE_MID + ((p - BREAK_START) / (FADE_START - BREAK_START)) * (NOISE_PEAK - NOISE_MID)
              : NOISE_PEAK
        noise.style.opacity = o.toFixed(3)
      }

      // 中央 NO SIGNAL 面板：进入断线区后 0.05 进度内渐显
      if (breaking) {
        noSignal.style.opacity = Math.min((p - BREAK_START) / 0.05, 1).toFixed(3)
      } else {
        noSignal.style.removeProperty("opacity")
      }

      // 断线态左上标签 / FPS ↔ "--"：只在状态翻转时写（避免每帧改文本）。
      // 文字保持 "REC" 不换（session-15 裁定：NO SIGNAL 叙事归中央面板，
      // 左上只表现「录制异常」= 红点熄灭 + 文字闪烁）
      if (breaking !== wasBreaking) {
        wasBreaking = breaking
        breakingRef.current = breaking
        if (breaking) {
          recText.classList.add("live-nosignal-text")
          recDot.classList.add("live-nosignal-dot") // CSS 类覆盖（!important），不碰内联红色
          fpsText.textContent = "FPS --"
        } else {
          recText.classList.remove("live-nosignal-text")
          recDot.classList.remove("live-nosignal-dot")
          fpsText.textContent = `FPS ${FPS_MIN + Math.floor(Math.random() * FPS_RANGE)}`
        }
      }

      if (p <= FADE_START) {
        root.style.removeProperty("opacity")
      } else {
        const fade = Math.min(Math.max((BREAK_END - p) / (BREAK_END - FADE_START), 0), 1)
        root.style.opacity = fade.toFixed(3)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    apply() // 处理刷新后浏览器恢复滚动位置的情况；scrollY=0 时是纯 no-op
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <motion.div
      ref={rootRef}
      aria-hidden
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { delayChildren: 0.9, staggerChildren: 0.1 } } }}
      className={`pointer-events-none ${className}`}
    >
      {/* 中断故障层：滚动进入区间时整层快闪 + 两道青绿故障线（见 globals.css .live-signal-break）。
          类由上方 effect 直接 classList 切换；静止时无类、无样式，纯透明容器 */}
      <div ref={breakRef} className="absolute inset-0">
      {/* 框内直播信号：稀疏雪花点 + 暗色滚动带 + 偶发故障线 + 整体轻微闪烁 */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.1 } } }}
        className="live-flicker absolute inset-1 overflow-hidden"
      >
        <div ref={noiseRef} className="live-noise absolute inset-0" />
        <div className="live-scanband" />
        <div className="live-glitch" />
      </motion.div>

      {/* NO SIGNAL 面板（电视失联风格）：常驻 DOM 但 opacity-0，
          断线区间由 scroll effect 直写 opacity 渐显；静止态零像素差。
          位置上 1/5（pt-[10vh]，session-14）：断线末端 p=0.62 时 features 覆盖层
          已盖到视口 62%，居中摆放会被压住——上移后整个断线区间可见 */}
      <div ref={noSignalRef} className="absolute inset-0 flex items-start justify-center pt-[10vh] opacity-0">
        <div className="flex flex-col items-center gap-2 border border-white/60 bg-black/60 px-8 py-5">
          <span className="live-nosignal-text text-2xl font-bold tracking-[0.32em] text-white">NO SIGNAL</span>
          <span className="font-mono text-[11px] tracking-[0.26em] text-white/55">CH 404 · RECONNECTING…</span>
        </div>
      </div>

      {/* 四角镜头框（64px 长臂） */}
      {CORNERS.map((pos) => (
        <motion.span key={pos} variants={cornerVariants} className={`absolute h-16 w-16 border-white/90 ${pos}`} />
      ))}

      {/* 左上 ● REC（断线时文字保持 REC，仅红点熄灭 + 文字闪烁） */}
      <motion.div variants={hudVariants} className="absolute left-6 top-5 flex items-center gap-2.5">
        <span
          ref={recDotRef}
          className="h-3.5 w-3.5 rounded-full animate-pulse"
          style={{ backgroundColor: "#ff3b30", boxShadow: "0 0 10px rgba(255, 59, 48, 0.8)" }}
        />
        <span ref={recTextRef} className="text-lg font-bold tracking-[0.18em] text-white">
          REC
        </span>
      </motion.div>

      {/* 右上 FPS（范围内随机跳动，tabular-nums 防抖宽；断线时被直写为 "FPS --"） */}
      <motion.div
        ref={fpsTextRef}
        variants={hudVariants}
        className="absolute right-6 top-5 text-lg font-bold tracking-[0.18em] text-white tabular-nums"
      >
        FPS 60
      </motion.div>
      </div>
    </motion.div>
  )
}
