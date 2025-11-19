// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kaziroido',
  description: 'Duolingo-style C language trainer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="wrap">
          <h1>Kaziroido</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/quiz">問題</a>
            <a href="/me">マイページ</a>
          </nav>
        </header>
        <main className="wrap">{children}</main>
      </body>
    </html>
  )
}
