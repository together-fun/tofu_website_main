"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { CtaRosterBg } from "@/components/cta-roster-bg"

// tagline 渐显区间（轨道 progress）：轨道 150svh，sticky 屏 100svh → 可滚 50svh。
// 0.4~0.65 = 额外下滑 ~20svh 出现、~32.5svh 完全显出，之后 ~17.5svh 停留再释放
// 进 footer 幕布揭示——三段节奏 = CTA 主体 → $TOFU Cooks 卡 → footer
//（session-15 复调：闪光扫过版被裁掉，回到渐显 + 短停留）
const TAG_IN = [0.4, 0.65] as const

export function CTASection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })

  const prefersReduced = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  // 主卡入场动画仍走 anim gate（session-19：手机 SSR 零 opacity:0）+ .lg-anim
  // CSS guard 兜底 resize 残留；tagline 的滚动渐显已拆双 DOM 分支
  //（session-22 结构性根治，同 features-section）——桌面 resize 到手机产生的
  // inline 残留只存在于 hidden lg:block 分支，手机分支纯静态永远可见。
  const anim = isDesktop && !prefersReduced

  const tagOpacity = useTransform(scrollYProgress, [...TAG_IN], [0, 1])
  const tagY = useTransform(scrollYProgress, [...TAG_IN], [28, 0])

  return (
    // 桌面：150svh 轨道 + section sticky 钉一屏，多出的 50svh 驱动 tagline 分段揭示；
    // 手机：轨道无高度，section 保持 min-h-svh 普通流（footer 幕布揭示起点不变）
    <div ref={trackRef} className="relative lg:h-[150svh]">
    <section
      id="community"
      className="min-h-svh flex flex-col justify-center py-14 md:py-24 relative overflow-hidden lg:sticky lg:top-0 lg:h-svh"
    >
      {/* 光斑尺寸跟随区块（inset-0 + 椭圆渐变），淡出必在区块内完成，不会被裁出边缘 */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(20, 241, 149, 0.08), transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          {...(anim
            ? {
                initial: { opacity: 0, scale: 0.95 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true },
                transition: { duration: 0.8 },
              }
            : {})}
          // lg-anim：手机可见性硬保证（globals.css §硬保证）
          className="lg-anim max-w-6xl mx-auto"
        >
          {/* 终章放大档（scroll-part 重构 d）：卡加宽 (5xl→6xl)、p-16→p-20，标题/文案/按钮各升一档 */}
          <div className="md:glass rounded-none md:rounded-3xl p-6 py-16 md:p-20 text-center relative overflow-hidden group bg-transparent md:bg-[rgba(255,255,255,0.05)] border-0 md:border md:border-white/10">
            {/* 盲盒「选人」头像网格背景（含中心压暗 veil） */}
            <CtaRosterBg />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(20, 241, 149, 0), rgba(20, 241, 149, 0.12), rgba(20, 241, 149, 0))",
              }}
            />

            <div className="relative z-10">
              <motion.h2
                {...(anim
                  ? {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true },
                      transition: { delay: 0.1 },
                    }
                  : {})}
                className="lg-anim text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl mb-8"
              >
                <span className="text-white">Ready to</span>
                <br />
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{ backgroundImage: "linear-gradient(to right, #14F195, #27FBE2, #9945FF)" }}
                >
                  {/* 前置 nbsp 配平右侧问号宽度，视觉居中（session-8） */}
                  {"\u00A0"}Farm Fun?
                </span>
              </motion.h2>

              <motion.p
                {...(anim
                  ? {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true },
                      transition: { delay: 0.2 },
                    }
                  : {})}
                className="lg-anim text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Farm $XP and trade together.
                <br />
                The future of social trading starts here.
              </motion.p>

              <motion.div
                {...(anim
                  ? {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true },
                      transition: { delay: 0.3 },
                    }
                  : {})}
                className="lg-anim flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <a
                  href="https://x.com/togetherdotfun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-10 py-5 text-black rounded-full font-bold text-lg md:text-xl transition-all relative overflow-hidden"
                  style={{
                    backgroundColor: "#14F195",
                    boxShadow: "0 0 50px rgba(20, 241, 149, 0.5)",
                    minWidth: "260px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                    Follow X
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: "linear-gradient(to right, #27FBE2, #14F195)" }}
                  />
                </a>
                <a
                  href="https://t.me/togetherfun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 glass rounded-full font-bold text-lg md:text-xl transition-all border-2"
                  style={{ borderColor: "rgba(20, 241, 149, 0.3)", minWidth: "260px" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)"
                    e.currentTarget.style.borderColor = "rgba(20, 241, 149, 0.6)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                    e.currentTarget.style.borderColor = "rgba(20, 241, 149, 0.3)"
                  }}
                >
                  Join Telegram
                </a>
              </motion.div>

              <motion.div
                {...(anim
                  ? {
                      initial: { opacity: 0 },
                      whileInView: { opacity: 1 },
                      viewport: { once: true },
                      transition: { delay: 0.4 },
                    }
                  : {})}
                className="lg-anim mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm md:text-base text-white/50"
              >
                {["Social Trading", "Chat & Danmaku", "XP Farming"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "#14F195", boxShadow: "0 0 8px #14F195" }}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Tagline（session-22 双 DOM 分支）：
            手机 <lg = 纯静态文档流，SSR 即可见、零 motion（resize 残留免疫）；
            桌面 lg+ = 轨道进度驱动渐显（滚过 CTA 主体后出现），motion style
            无条件挂——本分支 <lg 时 display:none，inline 残留不可能影响手机 */}
        <div className="lg:hidden text-center mt-10 md:mt-16">
          {/* 口号保留像素字体（session-8 复调：Inter 版回退） */}
          <p className="text-2xl md:text-4xl font-display text-white/30">$TOFU Cooks All Tokens</p>
        </div>
        <motion.div
          style={{ opacity: tagOpacity, willChange: "transform, opacity", ...(prefersReduced ? {} : { y: tagY }) }}
          className="hidden lg:block text-center mt-16"
        >
          <p className="text-4xl font-display text-white/30">$TOFU Cooks All Tokens</p>
        </motion.div>
      </div>
    </section>
    </div>
  )
}
