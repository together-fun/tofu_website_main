import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: "https://together.fun", lastModified, priority: 1.0 },
    { url: "https://together.fun/brandkit", lastModified, priority: 0.5 },
  ]
}
