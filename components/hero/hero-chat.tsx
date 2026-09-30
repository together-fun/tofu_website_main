"use client"

/**
 * hero-chat.tsx — Hero 右上角聊天室（1:1 复刻前端交易平台 chatroom）
 *
 * 对齐 D:\TOFU_website\apps\web\components\chatroom.tsx 的实测规格：
 * - 面板 360px、内边距 8px、列表全出血（-mx-2）、行距 space-y-1
 * - 消息行 `py-2 pl-3.5 pr-2 gap-3`；头像 32px + 框 inset:-30%（1.6×）
 * - 等级徽章 18px PNG + 数字（paddingLeft 8% / paddingRight 54%）
 * - 名字 text-sm font-medium 按等级着色；时间 text-xs #94a0ae；正文 text-sm #f3f5f8
 * - Global 行：左 2px 金 accent + rgba(254,223,0,0.12) 底（globalchat legendary 基线）
 * - 输入区：h-9 输入框 + 36px 绿色实心 Send（placeholder 为宣传语）
 * 外壳为磨砂浮窗档（对齐其设计语言 §6.5 surface-glass：card 色 + blur16 saturate180）。
 * 有意简化（落地页语境）：不渲染 tab 行 / 模式行 / 外框线 / 输入区分隔线，聚焦消息流本身。
 */

import { Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { CHAT_MESSAGES, getLevelNameStyle, getTierImageId, HERO_USERS } from "@/lib/hero-data"
import { APP_LIVE, APP_URL } from "@/lib/site-flags"

const INITIAL_COUNT = 8
const APPEND_INTERVAL = 2800
const MAX_ROWS = 30

interface ChatRow {
  id: number
  user: number
  text: string
  global?: boolean
  time: string
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

function LevelBadge({ level }: { level: number }) {
  return (
    <div className="relative inline-flex flex-none" style={{ height: 18, minWidth: "max-content" }}>
      <img
        src={`/images/cosmetics/chatlevel-${getTierImageId(level)}.png`}
        alt={`Level ${level}`}
        style={{ height: 18, width: "auto", display: "block", flexShrink: 0 }}
      />
      <span
        className="absolute inset-0 flex items-center justify-center text-white font-bold text-[10px]"
        style={{ paddingLeft: "8%", paddingRight: "54%" }}
      >
        {level}
      </span>
    </div>
  )
}

function AvatarWithFrame({ userIdx }: { userIdx: number }) {
  const user = HERO_USERS[userIdx]
  return (
    <div className="relative h-8 w-8 flex-shrink-0 rounded-full">
      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
      {user.frame && (
        <div aria-hidden className="pointer-events-none absolute" style={{ inset: "-30%" }}>
          <img src={user.frame} alt="" className="h-full w-full object-contain" />
        </div>
      )}
    </div>
  )
}

function ChatMessageRow({ row }: { row: ChatRow }) {
  const user = HERO_USERS[row.user]
  const name = getLevelNameStyle(user.level)
  return (
    <div
      className={`flex py-2 pr-2 gap-3 ${row.global ? "pl-3" : "pl-3.5"}`}
      style={
        row.global
          ? { borderLeft: "2px solid #fedf00", background: "rgba(254, 223, 0, 0.12)" }
          : undefined
      }
    >
      <AvatarWithFrame userIdx={row.user} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <LevelBadge level={user.level} />
          <span
            className={`min-w-0 truncate text-sm font-medium ${name.className}`}
            style={name.style}
          >
            {user.name}
          </span>
          <span className="shrink-0 text-xs text-[#94a0ae]">{row.time}</span>
        </div>
        <p className="text-sm break-words text-[#f3f5f8]">
          {row.global && (
            <span
              className="inline-flex items-center rounded-md border px-1.5 py-0.5 mr-2 text-[10px] font-medium align-middle"
              style={{
                backgroundColor: "rgba(20, 241, 149, 0.2)",
                color: "#14f195",
                borderColor: "rgba(20, 241, 149, 0.5)",
              }}
            >
              Global
            </span>
          )}
          {row.text}
        </p>
      </div>
    </div>
  )
}

export function HeroChat({ className = "" }: { className?: string }) {
  const [rows, setRows] = useState<ChatRow[]>([])
  const nextMsg = useRef(INITIAL_COUNT)
  const nextId = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const now = Date.now()
    setRows(
      CHAT_MESSAGES.slice(0, INITIAL_COUNT).map((m, i) => ({
        id: nextId.current++,
        user: m.user,
        text: m.text,
        global: m.global,
        time: formatTime(new Date(now - (INITIAL_COUNT - i) * 47000)),
      }))
    )
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return
      const m = CHAT_MESSAGES[nextMsg.current % CHAT_MESSAGES.length]
      nextMsg.current++
      setRows((prev) => {
        const next = [
          ...prev,
          { id: nextId.current++, user: m.user, text: m.text, global: m.global, time: formatTime(new Date()) },
        ]
        return next.length > MAX_ROWS ? next.slice(next.length - MAX_ROWS) : next
      })
    }, APPEND_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [rows])

  // 未上线：输入框 / Send 点击不跳 App（APP_LIVE=true 恢复）
  const openApp = () => {
    if (APP_LIVE) window.open(APP_URL, "_blank")
  }

  return (
    <aside
      className={`flex flex-col w-[360px] rounded-xl p-2 overflow-hidden ${className}`}
      style={{
        background: "rgba(29, 33, 37, 0.45)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      {/* 消息列表 — 全出血 + 行距 4px，贴底滚动 */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto space-y-1 -mx-2 scrollbar-hide">
        {rows.map((row) => (
          <ChatMessageRow key={row.id} row={row} />
        ))}
      </div>

      {/* 输入区 — 输入框/Send（点击即打开 App；无分隔线） */}
      <div className="shrink-0 px-0.5 pt-1.5 pb-0.5 mt-1 -mx-1">
        <div className="flex items-center gap-2 px-0.5 pb-0.5">
          <input
            readOnly
            placeholder="Together, We Farm Fun."
            onClick={openApp}
            className={`flex-1 h-9 min-w-0 rounded-md border bg-transparent px-3 text-sm text-[#f3f5f8] placeholder:text-[#94a0ae] outline-none ${APP_LIVE ? "cursor-pointer" : "cursor-default"}`}
            style={{ borderColor: "#292e34" }}
          />
          <button
            type="button"
            onClick={openApp}
            aria-label="Open Together.fun app"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-opacity hover:opacity-90 ${APP_LIVE ? "" : "cursor-default"}`}
            style={{ backgroundColor: "#14f195", color: "#14171b" }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
