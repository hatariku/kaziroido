"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type P = { id: number; title: string; problem_type: string; difficulty: number }

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-neutral-700">
      {children}
    </span>
  )
}

export default function QuizListPage() {
  const [problems, setProblems] = useState<P[]>([])
  const [msg, setMsg] = useState<string>("")
  const [q, setQ] = useState("")

  useEffect(() => {
    const run = async () => {
      const { data } = await supabaseBrowser.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        setMsg("ログインしてください（/login）")
        return
      }

      const res = await fetch("/api/problems/list", {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      const json = await res.json()
      if (!res.ok) {
        setMsg(json.error ?? "取得に失敗しました")
        return
      }
      setProblems(json.problems ?? [])
    }
    run()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return problems
    return problems.filter((p) => (p.title ?? "").toLowerCase().includes(s))
  }, [problems, q])

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">問題</h1>
        <p className="mt-1 text-sm text-neutral-500">解きたい問題を選んでください</p>
      </div>

      {msg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {msg}
        </div>
      )}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="検索（例: 第1問）"
        className="w-full rounded-xl border px-4 py-3 text-sm"
      />

      <div className="space-y-3">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/quiz/${p.id}`}
            className="block rounded-2xl border bg-white px-4 py-4 shadow-sm hover:bg-neutral-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-neutral-500">#{p.id}</div>
            </div>


          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border p-4 text-sm text-neutral-500">
            該当する問題がありません
          </div>
        )}
      </div>
    </div>
  )
}
