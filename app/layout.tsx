import type React from "react"
import type { Metadata } from "next"
import { Inter, Silkscreen } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://together.fun"),
  title: "Together.fun | The Gamified Trading Revolution",
  description: "Together, We Farm Fun. The future of crypto trading meets gaming.",
  icons: {
    icon: "/images/logo-square-green.png",
    shortcut: "/images/logo-square-green.png",
    apple: "/images/logo-square-green.png",
  },
  openGraph: {
    type: "website",
    url: "https://together.fun",
    siteName: "Together.fun",
    title: "Together.fun | The Gamified Trading Revolution",
    description: "Together, We Farm Fun. The future of crypto trading meets gaming.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Together.fun" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Together.fun | The Gamified Trading Revolution",
    description: "Together, We Farm Fun. The future of crypto trading meets gaming.",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-black font-sans antialiased", inter.variable, silkscreen.variable)}>
        {children}
      </body>
    </html>
  )
}
