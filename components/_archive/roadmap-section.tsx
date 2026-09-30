"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import { Dices, Rocket, Users, CircleDollarSign } from "lucide-react"

const roadmapAccent = {
  purple: {
    subtitle: "#9945FF",
    badgeBg: "rgba(153, 69, 255, 0.2)",
    badgeBorder: "rgba(153, 69, 255, 0.3)",
    dot: "#9945FF",
  },
  green: {
    subtitle: "#14F195",
    badgeBg: "rgba(20, 241, 149, 0.2)",
    badgeBorder: "rgba(20, 241, 149, 0.3)",
    dot: "#14F195",
  },
  pink: {
    subtitle: "#F357E2",
    badgeBg: "rgba(243, 87, 226, 0.2)",
    badgeBorder: "rgba(243, 87, 226, 0.3)",
    dot: "#F357E2",
  },
  cyan: {
    subtitle: "#27FBE2",
    badgeBg: "rgba(39, 251, 226, 0.2)",
    badgeBorder: "rgba(39, 251, 226, 0.3)",
    dot: "#27FBE2",
  },
} as const

const phases = [
  {
    accent: "purple" as const,
    phase: "Q2 2026",
    title: "The Pre-Launch Game",
    subtitle: "A Fun Factory For All",
    description:
      "A satirical, transparent simulation of the memecoin market. 9 themed rooms compete each round. Support your the token and farm $XP, unlock NFTs, and secure your share of the $TOFU airdrop.",
    icon: <Dices className="w-12 h-12" style={{ color: "#9945FF" }} />,
    gradient: "linear-gradient(135deg, rgba(153, 69, 255, 0.2), rgba(243, 87, 226, 0.2))",
    status: "Rugpad Royale",
    features: ["Provably fair VRF", "$XP Farming", "Exclusive NFT Drops", "Level System"],
  },
  {
    accent: "green" as const,
    phase: "Q3 2026",
    title: "The Main Platform",
    subtitle: "Where Vibes Meet Trading",
    description:
      "The full gamified social trading experience. Gamepad trading interface, live streams from influencers, and Together Moments that turn FOMO into a feature.",
    icon: <Rocket className="w-12 h-12" style={{ color: "#14F195" }} />,
    gradient: "linear-gradient(135deg, rgba(20, 241, 149, 0.2), rgba(39, 251, 226, 0.2))",
    status: "TOFU Arcade ",
    features: ["Tofu Arcade", "Pilot Partner Missions", "Tokenized Contributor Program", "Creator Economy"],
  },
  {
    accent: "pink" as const,
    phase: "Q4 2026",
    title: "The Pre-Token Economy",
    subtitle: "$TOFU, Your Alpha is Served",
    description:
      "Transform your engagement into value. Community distribution and liquidity mining. Unify user identity between RugPad Royale and The Arcade. Integrate Game-Fi and Trade-Fi experiences. Develop dedicated mobile app.",
    icon: <CircleDollarSign className="w-12 h-12" style={{ color: "#F357E2" }} />,
    gradient: "linear-gradient(135deg, rgba(243, 87, 226, 0.2), rgba(153, 69, 255, 0.2))",
    status: "$TOFU",
    features: ["Pre-TGE mode: ON", "Unified Progression Layer", "Airdrop Allocation", "Mobile App"],
  },
  {
    accent: "cyan" as const,
    phase: "Future",
    title: "The Community Layer",
    subtitle: "Farm Fun Together",
    description:
      "Together.fun becomes the default fun layer for crypto trading. Your wins, losses, and legendary moments become community lore. The vibe is the new value.",
    icon: <Users className="w-12 h-12" style={{ color: "#27FBE2" }} />,
    gradient: "linear-gradient(135deg, rgba(39, 251, 226, 0.2), rgba(20, 241, 149, 0.2))",
    status: "Vision",
    features: ["Extend Token Ecosystem", "DAO Governance", "Trading Competition"],
  },
]

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[150px] pointer-events-none"
        style={{ backgroundColor: "rgba(20, 241, 149, 0.05)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full glass mb-6"
          >
            <span className="text-sm uppercase tracking-wider" style={{ color: "#9945FF" }}>
              Our Journey
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl mb-6 font-display"
          >
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r"
              style={{ backgroundImage: "linear-gradient(to right, #9945FF, #F357E2, #14F195)" }}
            >
              The Roadmap
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            From mini-game to mainstream. Here's how we're building the future of social trading.
          </motion.p>
        </div>

        <div className="space-y-8">
          {phases.map((phase, index) => {
            const colors = roadmapAccent[phase.accent]
            return (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard className="p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-3 p-8 md:p-12 relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ backgroundImage: phase.gradient }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all group-hover:scale-110 duration-300">
                          {phase.icon}
                        </div>
                        <span
                          className="text-xs px-3 py-1 rounded-full border"
                          style={{
                            backgroundColor: colors.badgeBg,
                            color: colors.subtitle,
                            borderColor: colors.badgeBorder,
                          }}
                        >
                          {phase.status}
                        </span>
                      </div>
                      <span className="text-sm text-white/50 mb-2 block uppercase tracking-wider">{phase.phase}</span>
                      <h3 className="text-3xl md:text-4xl mb-2 group-hover:translate-x-2 transition-transform duration-500 font-display text-white">
                        {phase.title}
                      </h3>
                      <p className="text-lg mb-4" style={{ color: colors.subtitle }}>
                        {phase.subtitle}
                      </p>
                      <p className="text-white/70 mb-6 leading-relaxed">{phase.description}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 p-8 md:p-12 bg-white/5 flex flex-col justify-center">
                    <h4 className="text-sm text-white/50 mb-4 uppercase tracking-wider">Key Features</h4>
                    <ul className="space-y-3">
                      {phase.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/80">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: colors.dot }}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
