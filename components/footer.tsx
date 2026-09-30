"use client"

import Link from "next/link"
import { Twitter, Send } from "lucide-react"
import Image from "next/image"
import { APP_LIVE, APP_URL } from "@/lib/site-flags"

export function Footer() {
  return (
    // sticky bottom-0 z-0：整页滚动期间钉在视口底部、被上方 z-10 内容层盖住，
    // 滚到底被「揭开」（幕布效果）。sticky 方案高度自适应，footer 响应式高度变化无需硬编码。
    <footer className="sticky bottom-0 z-0 pt-8 pb-0 overflow-hidden" style={{ backgroundColor: "#14F195" }}>
      <div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{
          backgroundImage: "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.2), transparent)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-20">
          {/* Left section - narrower */}
          <div className="lg:max-w-sm">
            <p className="text-black/70 leading-relaxed text-base mb-6 font-bold">
              Together, we farm fun.
            </p>
            <p className="text-xs text-black/50">&copy; 2026 Together.fun. All rights reserved.</p>
          </div>

          {/* Right section - menus aligned to the right（session-22 三分组：Products / Resources / Community） */}
          <div className="flex flex-wrap gap-x-12 gap-y-10 sm:gap-x-16 lg:gap-x-24">
            <div className="flex flex-col items-start text-left">
              <h4 className="font-bold mb-6 text-black">Products</h4>
              <ul className="m-0 list-none space-y-4 p-0 text-black/70 text-sm">
                <li>
                  {APP_LIVE ? (
                    // session-30 上线前置：Products 组的 Trade = App 入口，直跳 APP_URL（原 #season2 页内锚点）
                    <Link
                      href={APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      style={{ transitionDuration: "200ms" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(0, 0, 0, 1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(0, 0, 0, 0.7)"
                      }}
                    >
                      Trade
                    </Link>
                  ) : (
                    // 未上线：灰置、无链接、普通光标（APP_LIVE=true 恢复可点）
                    <span className="text-black/35">Trade</span>
                  )}
                </li>
                <li>
                  <Link
                    href="https://bridge.together.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                    style={{ transitionDuration: "200ms" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "rgba(0, 0, 0, 1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(0, 0, 0, 0.7)"
                    }}
                  >
                    Bridge
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-start text-left">
              <h4 className="font-bold mb-6 text-black">Resources</h4>
              <ul className="m-0 list-none space-y-4 p-0 text-black/70 text-sm">
                {[
                  { name: "Docs", href: "https://docs.together.fun/", external: true },
                  { name: "Brand Kit", href: "/brandkit", external: false },
                  { name: "Decks", href: "https://decks.together.fun", external: true },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="transition-colors"
                      style={{ transitionDuration: "200ms" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(0, 0, 0, 1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(0, 0, 0, 0.7)"
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start text-left">
              <h4 className="font-bold mb-6 text-black">Community</h4>
              <ul className="m-0 list-none space-y-4 p-0 text-black/70 text-sm">
                {[
                  { name: "Twitter", icon: Twitter, href: "https://x.com/togetherdotfun" },
                  { name: "Telegram", icon: Send, href: "https://t.me/togetherfun" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-colors"
                      style={{ transitionDuration: "200ms" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(0, 0, 0, 1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(0, 0, 0, 0.7)"
                      }}
                    >
                      <link.icon className="w-4 h-4" /> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/logo-tofu-bk-noborder.png"
            alt="TOFU Logo"
            width={1200}
            height={200}
            className="w-full h-auto"
          />
        </div>
      </div>
    </footer>
  )
}
