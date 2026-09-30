"use client"

/**
 * hero.tsx — 首页 hero（session-39 落地「C 大字报」左侧文字块，源自 /preview/hero-c 预览）
 *
 * 布局：
 * - 桌面：文字块底部锚定（pb 8vh），浮在 REC 取景框之上（z-30 > frame z-20）；
 *   取景框 / 弹幕双区 / 聊天室 / 背景 / scrim 位置与方案 B（session-31）一致。
 * - 三行右缘对齐同一条线：h1 隐藏测量位 "We Farm Fun|" 的宽 targetW 为轴 ——
 *   kicker 等宽缩放（session-10 机制）、CTA+社证行容器宽 = targetW + justify-between（仅 lg）。
 * - 手机：bottom 锚定 + auto-fit + nowrap 全保留（Fold 外屏 320–360 单行，session-29）。
 * - 社证头像轮播「新成员加入」：固定 4 枚宽窗口 + 12 枚轨道（见 globals.css .avatars-join）。
 */

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { HeroChat } from "@/components/hero/hero-chat"
import { HeroDanmaku } from "@/components/hero/hero-danmaku"
import { HeroLiveFrame } from "@/components/hero/hero-live-frame"
import { HERO_USERS } from "@/lib/hero-data"
import { APP_LIVE, APP_URL, COMING_SOON_LABEL } from "@/lib/site-flags"
import { useComingSoon } from "@/lib/use-coming-soon"

/** 社证轮播名单：原 4 人（0/2/6/7）打头保证首帧与旧版一致，其余 4 人依次"加入"。 */
const AVATAR_ROSTER = [0, 2, 6, 7, 3, 4, 1, 5].map((i) => HERO_USERS[i])

export function Hero() {
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLaunchHovered, setIsLaunchHovered] = useState(false)
  // session-20：手机无 hover —— 点击时切 Coming Soon 1.4s + 震动（APP_LIVE 后 trigger 为 no-op）
  const { comingSoon, trigger, nudgeClass } = useComingSoon()
  const fullText = "We Farm Fun"
  const typingSpeed = 150
  const pauseTime = 2000

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayedText === fullText) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, pauseTime)
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false)
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length - 1))
      }, typingSpeed / 2)
    } else {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1))
      }, typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, fullText])

  // 三步 auto-fit（session-29 机制扩展）：
  // 1) h1 定字号：测量位 "We Farm Fun|" 实测渲染宽超容器则按比例缩（inline 直写，SSR 零内联）。
  //    实测真实渲染宽天然吸收系统字体缩放 / fallback 字体宽度差（Fold 外屏换行事故根因）。
  // 2) kicker 等宽：缩放字号至与 targetW 精确等宽（右缘对齐轴第 2 行）
  // 3) 行 3 定宽（仅 lg）：CTA+社证行容器 width = targetW + justify-between → 右端同轴；
  //    手机清除 width（flex-col 自然全宽）。三步同一次同步执行，无中间帧。
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const fitTargetRef = useRef<HTMLSpanElement>(null)
  const subTextRef = useRef<HTMLSpanElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const [subFont, setSubFont] = useState<string>()
  useEffect(() => {
    const fit = () => {
      const h1 = h1Ref.current
      const target = fitTargetRef.current
      const text = subTextRef.current
      if (!h1 || !target) return
      h1.style.fontSize = ""
      const avail = h1.clientWidth
      let targetW = target.getBoundingClientRect().width
      if (avail > 0 && targetW > avail) {
        const cur = Number.parseFloat(getComputedStyle(h1).fontSize)
        // 0.995 余量防亚像素舍入溢出
        h1.style.fontSize = `${((cur * avail * 0.995) / targetW).toFixed(2)}px`
        targetW = target.getBoundingClientRect().width
      }
      const row = rowRef.current
      if (row) {
        if (window.matchMedia("(min-width: 1024px)").matches) {
          row.style.width = `${targetW.toFixed(2)}px`
        } else {
          row.style.removeProperty("width")
        }
      }
      if (!text) return
      const textW = text.getBoundingClientRect().width
      if (!targetW || !textW) return
      const cur = Number.parseFloat(getComputedStyle(text).fontSize)
      const next = cur * (targetW / textW)
      // 0.2px 死区防 resize 抖动循环
      if (Math.abs(next - cur) > 0.2) setSubFont(`${next.toFixed(2)}px`)
    }
    fit()
    document.fonts?.ready.then(fit).catch(() => {})
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [])

  // 鼠标聚光：rAF 节流直接写 CSS 变量，不触发 React 渲染
  const sectionRef = useRef<HTMLElement>(null)
  const rafId = useRef(0)
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = sectionRef.current
    if (!el || rafId.current) return
    const { clientX, clientY } = e
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0
      const rect = el.getBoundingClientRect()
      el.style.setProperty("--mx", `${(((clientX - rect.left) / rect.width) * 100).toFixed(2)}%`)
      el.style.setProperty("--my", `${(((clientY - rect.top) / rect.height) * 100).toFixed(2)}%`)
    })
  }
  useEffect(() => () => cancelAnimationFrame(rafId.current), [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-svh overflow-hidden bg-black"
    >
      {/* 背景图：桌面横幅 / 手机竖幅裁切 */}
      <picture>
        <source media="(min-width: 1024px), (orientation: landscape)" srcSet="/images/hero-bg.webp" />
        <img
          src="/images/hero-bg-mobile.webp"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
          // 垂直锚点偏上：宽屏裁切时优先保住顶部霓虹 TOFU 招牌（手机竖图无垂直裁切，不受影响）
          style={{ objectPosition: "50% 22%" }}
        />
      </picture>

      {/* 压暗 + 鼠标聚光 + 呼吸（.hero-dim 见 globals.css） */}
      <div className="hero-dim absolute inset-0 pointer-events-none" />

      {/* 文字保底 scrim：底部渐黑，左下加强 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 28%, transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            "linear-gradient(100deg, rgba(0,0,0,0.55) 0%, transparent 45%)",
        }}
      />
      {/* 顶部窄条渐变衬 navbar */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}
      />

      {/* 弹幕（桌面双区，方案 B）：上区只铺右半屏（left 46%）+ 左缘渐隐 mask；
          下区从 30% 起横穿画面中下部，z-20 从聊天室（z-30）后面穿过。 */}
      <HeroDanmaku
        lanes={3}
        className="hidden lg:block absolute left-[46%] right-0 top-[12%] h-[16%] z-20 mask-fade-l"
      />
      <HeroDanmaku
        lanes={3}
        spawnInterval={1600}
        className="hidden lg:block absolute left-[30%] right-0 top-[60%] h-[16%] z-20 mask-fade-l"
      />
      {/* 手机：文字在底部（bottom 锚定），弹幕区从顶部铺到标题区上方
          （标题区顶部占位距屏底约 380px，bottom-[400px] 留 ~20px 余量），4 轨按容器高度均分 */}
      <HeroDanmaku
        lanes={4}
        spawnInterval={2000}
        className="lg:hidden absolute left-0 right-0 top-[10%] bottom-[400px] z-20"
      />

      {/* 直播取景框（仅桌面，session-8 复调）：左缘 27%、顶部 clamp(60,8vh,88)；
          右/下贴边 16px，四角镜头框把聊天室一并「框」进直播画面 */}
      <HeroLiveFrame className="hidden lg:block absolute left-[27%] right-[16px] top-[clamp(60px,8vh,88px)] bottom-[16px] z-20" />

      {/* 聊天室：右下（桌面）。高度按 ~6 条消息设定；底距 ≥92px 让开取景框右下折角 */}
      <div className="hidden lg:block absolute right-[var(--edge)] bottom-[clamp(92px,10vh,104px)] z-30 h-[min(52vh,450px)]">
        <HeroChat className="h-full" />
      </div>

      {/* 左侧文字块（C 大字报）：桌面底部锚定（pb 8vh），浮在取景框之上；手机 bottom 锚定 */}
      <div className="relative z-30 edge-x flex min-h-svh flex-col justify-end pb-16 pt-40 lg:pb-[8vh]">
        <div className="max-w-3xl">
          {/* 手机保留徽章等高占位（session-30 删徽章后布局零位移）；桌面底部锚定不需要 */}
          <div aria-hidden className="mb-6 h-[34px] lg:hidden" />

          {/* 大字报标题：桌面 110px / 900 / 字距 -0.035em。
              桌面行高 1.06：0.98 时第二行闪烁 "|" 会顶到 "Together," 的 g 降部。
              手机：clamp 仅作 SSR/无 JS 兜底字号；实际单行保证 = JS auto-fit + whitespace-nowrap */}
          <motion.h1
            ref={h1Ref}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="whitespace-nowrap text-[clamp(2.75rem,14vw,3.4rem)] leading-[1.05] sm:text-6xl lg:text-[6.875rem] lg:leading-[1.06] font-extrabold lg:font-black tracking-tight lg:tracking-[-0.035em] mb-6 lg:mb-5"
          >
            <span className="text-white">Together,</span>
            <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r"
              style={{ backgroundImage: "linear-gradient(to right, #14F195, #27FBE2, #9945FF)" }}
            >
              {displayedText}
              <span className="animate-pulse">|</span>
            </span>
            {/* 隐藏测量位：右缘对齐轴的唯一来源（三行共用 targetW） */}
            <span ref={fitTargetRef} aria-hidden className="invisible absolute whitespace-nowrap">
              We Farm Fun|
            </span>
          </motion.h1>

          {/* kicker：副标题 + tagline 合并句（对齐轴第 2 行，等宽缩放至 targetW） */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-[clamp(0.65rem,3.1vw,1.25rem)] whitespace-nowrap mb-8 lg:mb-7 leading-relaxed"
            style={{ fontSize: subFont }}
          >
            <span ref={subTextRef} className="inline-block whitespace-nowrap">
              <span className="font-semibold" style={{ color: "#14F195" }}>
                Trade with vibes, not charts —{" "}
              </span>
              <span className="text-white/70">crypto as an epic adventure.</span>
            </span>
          </motion.p>

          {/* 行 3：CTA + 社证（对齐轴第 3 行，桌面容器宽 = targetW + justify-between）；
              手机 flex-col（CTA 全宽 + 社证行） */}
          <motion.div
            ref={rowRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <a
              {...(APP_LIVE
                ? { href: APP_URL, target: "_blank", rel: "noopener noreferrer" }
                : { role: "button", "aria-disabled": true })}
              // (hover:hover) 守卫：触屏 tap 会派发模拟 mouseenter，hover 态会粘滞不回弹，
              // 只在真有鼠标的设备上启用 hover 文案切换（触屏走 trigger 的 1.4s 回弹）
              onMouseEnter={() => {
                if (window.matchMedia("(hover: hover)").matches) setIsLaunchHovered(true)
              }}
              onMouseLeave={() => setIsLaunchHovered(false)}
              onClick={trigger}
              className={`group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 w-full lg:w-auto ${APP_LIVE ? "" : "cursor-default"} ${nudgeClass}`}
              style={{
                backgroundColor: "#14F195",
                boxShadow: "0 0 40px rgba(20, 241, 149, 0.45)",
                minWidth: "260px",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                {!APP_LIVE && (isLaunchHovered || comingSoon) ? COMING_SOON_LABEL : "Launch App"}
                {APP_LIVE && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundImage: "linear-gradient(to right, #27FBE2, #14F195)" }}
              />
            </a>
            {/* 社证：头像轮播「新成员加入」——窗口固定 4 枚宽（overflow hidden），轨道每 3.5s
                左移一格（.avatars-join，globals.css），左端渐隐滑出 / 右端淡入；轨道 = 8 人 + 重复前 4 人，
                末步落位与起点相同，循环无跳变。窗口宽固定 → 右侧文案与行 3 右缘对齐轴不受影响。
                手机收窄：头像 28/重叠 8、文案 clamp 字号，320 视口下整行 ≤ 可用宽（Fold 外屏不溢出） */}
            <div className="flex items-center">
              <div className="w-[88px] lg:w-[98px] overflow-hidden shrink-0">
                <div className="avatars-join flex w-max [--slot:20px] lg:[--slot:22px]">
                  {[...AVATAR_ROSTER, ...AVATAR_ROSTER.slice(0, 4)].map((u, i) => (
                    <img
                      // 同一用户在轨道中出现两次（尾部重复），需用位置区分 key
                      key={`${u.name}-${i}`}
                      src={u.avatar}
                      alt=""
                      className="avatar-join-item h-7 w-7 lg:h-8 lg:w-8 shrink-0 rounded-full border-2 border-black object-cover -mr-2 lg:-mr-2.5"
                      // 相位 = 该头像轮到「第 5 位（窗口右缘外待入场）」的时刻：此时隐藏，
                      // 否则重叠部分会在第 4 枚右缘露出一弯月牙（几何固有，非 z-index 可解）
                      style={{ animationDelay: `${(i - 4) * 3.5 - 28}s` }}
                    />
                  ))}
                </div>
              </div>
              <span className="ml-3 lg:ml-5 text-[clamp(0.6rem,3vw,0.8125rem)] lg:text-[13px] text-white/65 whitespace-nowrap">
                Trade together, farm fun together
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
