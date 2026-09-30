/**
 * site-flags.ts — 站点上线开关总控（单一来源）
 *
 * 当前状态：已上线（2026-09-30，app.together.fun DNS 就绪后翻正）。
 * APP_LIVE=true 生效形态：
 * - Navbar / Hero / brandkit「Launch App」按钮：新标签页跳转 APP_URL
 * - Season 2 区块：徽章显示「Live」、两个「Start Trading」跳转 APP_URL
 * - Footer「Trade」链接：可点，新标签页跳转 APP_URL
 * - Hero / Features 聊天卡输入框与 Send：点击打开 App
 * - Coming Soon 点击反馈（use-coming-soon）：no-op
 *
 * 回滚：改回 false 即回到「Coming Soon 预告模式」（按钮不跳转、点击/hover
 * 显示 COMING_SOON_LABEL、footer Trade 灰置）。
 *
 * 除本文件外，任何组件不得再自行定义 APP_URL 或散写上线判断。
 */

export const APP_LIVE = true

export const APP_URL = "https://app.together.fun"

export const COMING_SOON_LABEL = "Coming Soon"
