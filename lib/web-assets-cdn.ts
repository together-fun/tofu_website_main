/**
 * web-assets-cdn.ts — 落地页 R2 前端静态资源 CDN（单一来源）
 *
 * Bucket: tofu-web-assets @ https://tofu-web-assets.together.fun
 * 旧域 tofu-assets.together.fun 已废弃，业务代码禁止再引用。
 */

export const WEB_ASSETS_CDN = "https://tofu-web-assets.together.fun"

/** 落地页 Season 区块 webm 视频（R2 key: LandingPage/video/{filename}）。 */
export function landingVideo(filename: string): string {
  return `${WEB_ASSETS_CDN}/LandingPage/video/${filename}`
}
