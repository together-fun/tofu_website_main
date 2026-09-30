"use client"

/**
 * brandkit-client.tsx — Brand Kit 页面组装：nav 变体 + 定稿内容 + landing footer。
 * 定稿为单一 Gallery 风格（session-22 用户裁定，三风格 tab 已移除）；
 * footer 沿用 landing 的幕布揭示结构（内容层 relative z-10 bg-black，footer sticky bottom-0 z-0）。
 */

import { BrandkitContent } from "@/components/brandkit/brandkit-content"
import { BrandkitNavbar } from "@/components/brandkit/brandkit-navbar"
import { Footer } from "@/components/footer"

export function BrandkitClient() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandkitNavbar />
      <div className="relative z-10 bg-black pb-24 pt-28 lg:pt-32">
        <BrandkitContent />
      </div>
      <Footer />
    </main>
  )
}
