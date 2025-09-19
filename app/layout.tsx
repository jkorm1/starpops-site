import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Star Pops - Premium Popcorn Business Portal",
  description: "KNUST's Premier Popcorn Experience - Investment & Business Portal",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} particle-bg`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <main className="pt-20">{children}</main>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
