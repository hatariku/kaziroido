import "./globals.css"
import type { Metadata } from "next"
import AppFrame from "@/components/AppFrame"

export const metadata: Metadata = {
  title: "KAZIROID",
  description: "Kaziroido",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-dvh bg-neutral-200 text-neutral-900">
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  )
}
