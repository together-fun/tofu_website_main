import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturesSection } from "@/components/features-section"
import { MarketsSection } from "@/components/markets-section"
import { Footer } from "@/components/footer"
import { Season1Section } from "@/components/season1-section"
import { Season2Section } from "@/components/season2-section"
import { CTASection } from "@/components/cta-section"
import { SmoothScroll } from "@/components/scroll/smooth-scroll"
import { HeroCover } from "@/components/scroll/hero-cover"
import { ScrollProgress } from "@/components/scroll/scroll-progress"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      {/* Footer 幕布揭示：内容层 z-10 + 不透明黑底，盖住 sticky bottom-0 的 footer（z-0）；
          滚到底内容层走完，footer 像幕布被揭开。高度零硬编码（footer 自然高度即文档高度的一部分）。 */}
      <div className="relative z-10 bg-black">
        {/* hero 钉住、features 从下方盖上来（覆盖时 hero 缩小 + 变暗，见 hero-cover.tsx）；
            features 内部再做 sticky 标题 + 双支柱轮换（features-section.tsx） */}
        <HeroCover hero={<Hero />}>
          <FeaturesSection />
        </HeroCover>
        <MarketsSection />
        {/* Seasons 合屏 part：Season2 + Season1 双卡紧凑堆叠、垂直居中撑满一屏；
            min-h 不锁上限——Season1 的 Relive 视频区展开后可自然超一屏 */}
        {/* gap/py 收紧到双卡 + 间距 ≈ 896px，900 高视口恰好一屏尽收（更矮屏自然溢出顺滚） */}
        <section className="relative flex min-h-svh flex-col justify-center gap-6 py-10">
          <Season2Section />
          <Season1Section />
        </section>
        <CTASection />
      </div>
      <Footer />
    </main>
  )
}
