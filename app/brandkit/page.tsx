import type { Metadata } from "next"
import { BrandkitClient } from "@/components/brandkit/brandkit-client"

export const metadata: Metadata = {
  title: "Brand Kit | Together.fun",
  description:
    "Official TOFU brand assets — colors, logos, typography and wallpapers for Together.fun.",
}

export default function BrandkitPage() {
  return <BrandkitClient />
}
