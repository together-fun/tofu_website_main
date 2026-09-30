"use client"

import React from "react"

import { AnimatePresence, motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useDesktopAnim } from "@/lib/use-desktop-anim"
import { landingVideo } from "@/lib/web-assets-cdn"

export function Season1Section() {
  // 入场动画仅桌面挂载（session-19 手机回归修复：手机 SSR 即完整可见）
  const anim = useDesktopAnim()
  const [howOpen, setHowOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (activeVideo && modalVideoRef.current) {
      modalVideoRef.current.muted = false
      modalVideoRef.current.volume = 1
      modalVideoRef.current.play().catch(() => {})
    }
  }, [activeVideo])

  return (
    // 已并入 seasons 合屏 part（app/page.tsx 的父 section 撑满一屏、双卡紧凑堆叠），
    // 本组件渲染 Season 1 卡 + Relive 展开区（展开后合屏自然超一屏，交互保留）
    <section id="gameplay" className="relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-8">
          <motion.div
            // lg-anim：手机可见性硬保证（globals.css §硬保证）
            className="lg-anim"
            {...(anim
              ? {
                  initial: { opacity: 0, y: -40 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.8 },
                }
              : {})}
          >
            <div
              className="relative overflow-hidden rounded-none md:rounded-3xl p-6 border-0 md:border md:bg-black/30 -mx-6 md:mx-0"
              style={{ borderColor: "rgba(153, 69, 255, 0.2)" }}
            >
              {/* Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                style={{ zIndex: 0 }}
              >
                <source src={landingVideo("nameplate-effect-6.webm")} type="video/webm" />
              </video>
              
              {/* 文字内容区域 */}
              <div className="relative z-10">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{ 
                    background: "linear-gradient(135deg, rgba(153, 69, 255, 0.2) 0%, rgba(20, 241, 149, 0.15) 100%)",
                    border: "1px solid rgba(153, 69, 255, 0.3)"
                  }}
                >
                  <span className="text-sm uppercase tracking-wider font-medium" style={{ color: "#9945FF" }}>
                    Season 1
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                    Legacy
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl mb-4 font-display">
                  <span className="text-white">Simple.</span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent bg-gradient-to-r"
                    style={{ backgroundImage: "linear-gradient(to right, #9945FF, #27FBE2)" }}
                  >
                    Engaging.
                  </span>
                  <br />
                  <span className="text-white">Reward-driven.</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-3 md:max-w-[50%] hidden md:block">
                  An interactive entry point into the Together.fun ecosystem — where communities compete, outcomes unfold, and everyone plays for progress and rewards.
                </p>
              </div>

              {/* 手机端：调整为 标题 -> 图片 -> 文字 -> 按钮 */}
              <div className="md:hidden relative mt-6 flex flex-col">
                {/* 图片 */}
                <div className="relative w-full h-64">
                  <Image src="/images/gameboy_purple.webp" alt="Gameboy" fill className="object-contain object-center" />
                </div>

                {/* 文字描述 */}
                <p className="text-lg text-white/70 leading-relaxed my-4">
                  An interactive entry point into the Together.fun ecosystem — where communities compete, outcomes unfold, and everyone plays for progress and rewards.
                </p>

                {/* 按钮：赛季已结束，回顾按钮就地展开四个玩法视频 */}
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => setHowOpen((v) => !v)}
                    aria-expanded={howOpen}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-full font-bold hover:scale-105 transition-all"
                    style={{
                      backgroundColor: "#9945FF",
                      boxShadow: "0 0 30px rgba(153, 69, 255, 0.3)",
                      minWidth: "200px",
                    }}
                  >
                    <span className="whitespace-nowrap">Relive Season 1</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${howOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* 大屏端：按钮在文字下方 */}
              <div className="hidden md:flex flex-row gap-4 relative z-10 mt-4">
                <button
                  type="button"
                  onClick={() => setHowOpen((v) => !v)}
                  aria-expanded={howOpen}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full font-bold hover:scale-105 transition-all"
                  style={{
                    backgroundColor: "#9945FF",
                    boxShadow: "0 0 30px rgba(153, 69, 255, 0.3)",
                    minWidth: "200px",
                  }}
                >
                  <span className="whitespace-nowrap">Relive Season 1</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${howOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* 大屏端：图片绝对定位在右侧 */}
              <div className="hidden md:block absolute bottom-0 right-0 w-1/2 h-full pointer-events-none">
                <Image
                  src="/images/gameboy_purple.webp"
                  alt="Gameboy"
                  width={400}
                  height={600}
                  className="absolute bottom-0 right-0 object-contain object-right-bottom"
                  style={{ maxHeight: "100%" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Season 1 回顾 — 由卡内 Relive Season 1 按钮展开的四个玩法视频 */}
          <AnimatePresence initial={false}>
            {howOpen && (
              <motion.div
                key="how-it-works"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="overflow-hidden -mt-4"
              >
                <p className="pt-6 pb-6 text-center text-sm text-white/50">How Season 1 was played — in four steps</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                { src: landingVideo("pick-your-project.webm"), label: "Pick Your Project", step: "01" },
                { src: landingVideo("back-your-conviction.webm"), label: "Back Your Conviction", step: "02" },
                { src: landingVideo("the-on-chain-verdict.webm"), label: "The On-Chain Verdict", step: "03" },
                { src: landingVideo("winner-takes-all.webm"), label: "Winner Takes All", step: "04" },
              ].map((video, index) => (
                <motion.div
                  key={index}
                  // lg-anim：无条件 whileInView 是手机复发同款风险，硬保证兜底
                  className="lg-anim"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                >
                  <GlassCard
                    className="!p-0 !rounded-2xl group overflow-hidden hover:scale-[1.03] transition-all cursor-pointer"
                    hoverEffect={false}
                  >
                    <div
                      className="relative aspect-square overflow-hidden"
                      onClick={() => setActiveVideo(video.src)}
                    >
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      >
                        <source src={video.src} type="video/webm" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "rgba(153, 69, 255, 0.8)" }}
                        >
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-widest text-white"
                          style={{
                            backgroundColor: "rgba(153, 69, 255, 0.6)",
                            border: "1px solid rgba(153, 69, 255, 0.4)",
                          }}
                        >
                          Step {video.step}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-bold text-sm md:text-base leading-tight">{video.label}</h4>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Modal */}
          {activeVideo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
              onClick={() => setActiveVideo(null)}
            >
              <button
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div
                className="w-full max-w-4xl rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "0 0 60px rgba(153, 69, 255, 0.3)",
                  border: "1px solid rgba(153, 69, 255, 0.3)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  key={activeVideo}
                  ref={modalVideoRef}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="w-full aspect-video object-contain bg-black"
                >
                  <source src={activeVideo} type="video/webm" />
                </video>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
