"use client"

/**
 * social-scene.tsx — 支柱 1「Trade inside the crowd」右侧视觉
 *
 * 真实 TOFU 交易界面截图（trading-interface.webp，1837x1006）+ 复用 hero 的
 * 弹幕（HeroDanmaku）与聊天室（HeroChat，1:1 复刻站内 chatroom 规格），
 * 聊天卡悬挂在终端右下角。
 */

import { HeroChat } from "@/components/hero/hero-chat"
import { HeroDanmaku } from "@/components/hero/hero-danmaku"

export function SocialScene() {
  return (
    <div className="relative">
      {/* 终端截图（桌面端轻微 3D 倾斜；聊天卡不参与倾斜） */}
      <div className="lg:[transform:perspective(1600px)_rotateY(-5deg)_rotateX(1.5deg)]">
        <div
          className="relative overflow-hidden rounded-2xl border bg-[#07090b]"
          style={{
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 70px rgba(20,241,149,0.07)",
          }}
        >
          {/* 手机端裁切左侧 K 线区（截图整幅缩到 <400px 宽会糊成一团），md+ 按原比例整幅显示 */}
          <img
            src="/images/trading-interface.webp"
            alt="TOFU trading interface — BTC chart with orderbook"
            className="block h-[260px] w-full object-cover object-left-top md:h-auto"
          />
          {/* baseDuration 放慢一档：终端容器窄，同速会显得飞太快 */}
          <HeroDanmaku
            lanes={3}
            spawnInterval={2000}
            baseDuration={14000}
            className="absolute inset-x-0 top-1 z-10 h-[128px]"
          />
        </div>
      </div>

      {/* 聊天卡：复用 hero 聊天室（约 3 行消息 + 输入行），悬挂终端右下。
          手机全宽与上方终端图对齐（旧 max-w-[360px] 在宽手机上比图窄，session-12 移除）；
          md+ 恢复 absolute 悬挂时用 md:max-w 限宽 */}
      <div className="relative z-20 mt-5 w-full rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.65)] md:absolute md:-bottom-14 md:-right-4 md:mt-0 md:max-w-[360px]">
        <HeroChat className="!w-full h-[236px]" />
      </div>
    </div>
  )
}
