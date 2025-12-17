"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type NavItem = { href: string; label: string }

const NAV: NavItem[] = [
  { href: "/", label: "ホーム" },
  { href: "/quiz", label: "問題" },
  { href: "/archive", label: "ゲーム" },
  { href: "/collection", label: "コレクション" },
  { href: "/me", label: "マイページ" },
  { href: "/setting", label: "設定" },
]

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // ESCで閉じる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  const logout = async () => {
    await supabaseBrowser.auth.signOut()
    setOpen(false)
    location.href = "/login"
  }

  return (
    <div className="min-h-dvh flex justify-center">
      {/* “スマホ画面”枠：PCだと中央にスマホっぽく表示。スマホは横幅いっぱい */}
      <div className="w-full max-w-[420px] min-h-dvh bg-white shadow-sm">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
          <div className="h-14 px-4 flex items-center justify-between">
            {/* 左：ハンバーガー */}
            <button
              onClick={() => setOpen(true)}
              aria-label="menu"
              className="h-10 w-10 rounded-md border flex items-center justify-center"
            >
              <span className="text-lg leading-none">≡</span>
            </button>

            {/* 中央：ロゴ（常に真ん中に見えるように） */}
            <Link href="/" className="font-semibold tracking-wide">
              KAZIROID
            </Link>

            {/* 右：ダミー（中央寄せ崩れ防止） */}
            <div className="h-10 w-10" />
          </div>
        </header>

        {/* Drawer */}
        {open && (
          <div className="fixed inset-0 z-40">
            <button
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
              aria-label="close"
            />
            <aside className="absolute left-0 top-0 h-full w-[78%] max-w-[320px] bg-white shadow-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">MENU</div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-md border"
                  aria-label="close"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block rounded-lg px-3 py-3 text-sm",
                      isActive(item.href)
                        ? "bg-sky-100 font-semibold"
                        : "hover:bg-neutral-100",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 border-t pt-4">
                <button
                  onClick={logout}
                  className="w-full rounded-xl border px-3 py-3 text-sm hover:bg-neutral-100"
                >
                  ログアウト
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
