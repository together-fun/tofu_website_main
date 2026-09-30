"use client"

import React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { useDesktopAnim } from "@/lib/use-desktop-anim"
import { landingVideo } from "@/lib/web-assets-cdn"
import { APP_LIVE, APP_URL, COMING_SOON_LABEL } from "@/lib/site-flags"
import { useComingSoon } from "@/lib/use-coming-soon"

export function Season2Section() {
  // 入场动画仅桌面挂载（session-19 手机回归修复：手机 SSR 即完整可见）
  const anim = useDesktopAnim()
  // session-21 统一：门控按钮平时显示 Start Trading，点击切 Coming Soon 1.4s 回弹 + 震动（同 hero）
  const { comingSoon, trigger, nudgeClass } = useComingSoon()
  // 背景光斑已移除（曾被 overflow-hidden 裁出色带）
  return (
    // 已并入 seasons 合屏 part（app/page.tsx 的父 section 撑满一屏、双卡紧凑堆叠），
    // 本组件只渲染 Season 2 卡本体；桌面字号/间距比独立满屏版收紧一档
    <section id="season2" className="relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-8">
          <motion.div
            {...(anim
              ? {
                  initial: { opacity: 0, y: -40 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.8 },
                }
              : {})}
            // lg-anim：手机可见性硬保证（globals.css §硬保证）
            className="lg-anim"
          >
            <div
              className="relative overflow-hidden rounded-none md:rounded-3xl p-6 border-0 md:border md:bg-black/30 -mx-6 md:mx-0"
              style={{ borderColor: "rgba(20, 241, 149, 0.2)" }}
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
                <source src={landingVideo("nameplate-effect-3.webm")} type="video/webm" />
              </video>
              
              <div className="relative z-10">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{ 
                    background: "linear-gradient(135deg, rgba(20, 241, 149, 0.2) 0%, rgba(153, 69, 255, 0.15) 100%)",
                    border: "1px solid rgba(20, 241, 149, 0.3)"
                  }}
                >
                  <span className="text-sm uppercase tracking-wider font-medium" style={{ color: "#14F195" }}>
                    Season 2
                  </span>
                  <span className="text-white/30">|</span>
                  <span 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "#14F195", boxShadow: "0 0 8px #14F195" }}
                  />
                  <span 
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#14F195" }}
                  >
                    {APP_LIVE ? "Live" : COMING_SOON_LABEL}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl mb-4 font-display">
                  <span className="text-white">Play.</span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent bg-gradient-to-r"
                    style={{ backgroundImage: "linear-gradient(to right, #14F195, #27FBE2)" }}
                  >
                    Trade.
                  </span>
                  <br />
                  <span className="text-white">Together.</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-3 md:max-w-[50%] hidden md:block">
                  A platform where the community is the alpha, execution is a game, and your portfolio tells your story.
                </p>
              </div>

              {/* 手机端：调整为 标题 -> 图片 -> 文字 -> 按钮 */}
              <div className="md:hidden relative mt-6 flex flex-col">
                {/* 图片 */}
                <div className="relative w-full h-64">
                  <Image src="/images/arcade.webp" alt="Arcade" fill className="object-contain object-center" />
                </div>

                {/* 文字描述 */}
                <p className="text-lg text-white/70 leading-relaxed my-4">
                  A platform where the community is the alpha, execution is a game, and your portfolio tells your story.
                </p>

                {/* 按钮 */}
                <div className="flex flex-col gap-4">
                  <button
                    className={`px-8 py-4 text-black rounded-full font-bold transition-all ${APP_LIVE ? "hover:scale-105" : "cursor-default"} ${nudgeClass}`}
                    style={{
                      backgroundColor: "#14F195",
                      boxShadow: "0 0 30px rgba(20, 241, 149, 0.3)",
                      minWidth: "200px",
                    }}
                    onClick={() => {
                      if (APP_LIVE) window.open(APP_URL, "_blank")
                      trigger()
                    }}
                  >
                    <span className="whitespace-nowrap">{!APP_LIVE && comingSoon ? COMING_SOON_LABEL : "Start Trading"}</span>
                  </button>
                  <button
                    type="button"
                    className="px-8 py-4 glass rounded-full font-semibold hover:bg-white/10 transition-all border text-white"
                    style={{ borderColor: "rgba(20, 241, 149, 0.2)", minWidth: "200px" }}
                    onClick={() => window.open("https://docs.together.fun/", "_blank")}
                  >
                    <span className="whitespace-nowrap">Learn More</span>
                  </button>
                </div>
              </div>

              <div className="hidden md:flex flex-row gap-4 relative z-10 mt-4">
                <button
                  className={`px-8 py-3.5 text-black rounded-full font-bold transition-all ${APP_LIVE ? "hover:scale-105" : "cursor-default"} ${nudgeClass}`}
                  style={{
                    backgroundColor: "#14F195",
                    boxShadow: "0 0 30px rgba(20, 241, 149, 0.3)",
                    minWidth: "200px",
                  }}
                  onClick={() => {
                    if (APP_LIVE) window.open(APP_URL, "_blank")
                    trigger()
                  }}
                >
                  <span className="whitespace-nowrap">{!APP_LIVE && comingSoon ? COMING_SOON_LABEL : "Start Trading"}</span>
                </button>
                <button
                  type="button"
                  className="px-8 py-3.5 glass rounded-full font-semibold hover:bg-white/10 transition-all border text-white"
                  style={{ borderColor: "rgba(20, 241, 149, 0.2)", minWidth: "200px" }}
                  onClick={() => window.open("https://docs.together.fun/", "_blank")}
                >
                  <span className="whitespace-nowrap">Learn More</span>
                </button>
              </div>

              <div className="hidden md:block absolute bottom-0 right-0 w-1/2 h-full pointer-events-none">
                <Image
                  src="/images/arcade.webp"
                  alt="Arcade"
                  width={400}
                  height={600}
                  className="absolute bottom-0 right-0 object-contain object-right-bottom"
                  style={{ maxHeight: "100%" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
