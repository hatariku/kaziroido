"use client"

import { use } from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase/browser"

function proxy(url?: string | null) {
  if (!url) return ""
  return `/api/proxy-image?url=${encodeURIComponent(url)}`
}

type Status = "init" | "loading" | "ready" | "failed" | "no-token" | "bad-id"

export default function QuizOnePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const problemId = Number(id)

  const [status, setStatus] = useState<Status>("init")
  const [error, setError] = useState("")
  const [problem, setProblem] = useState<any>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)

  const maxNumber = problem?.max_number ?? 60
  const sortedLabels = useMemo(() => [...labels].sort(), [labels])

  useEffect(() => {
    const run = async () => {
      setStatus("loading")
      setError("")
      setResult(null)

      if (!Number.isFinite(problemId)) {
        setError("URLのIDが数字じゃないです")
        setStatus("bad-id")
        return
      }

      const { data } = await supabaseBrowser.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        setError("ログインしてません。/login でログインしてから開いてください。")
        setStatus("no-token")
        return
      }

      const res = await fetch("/api/problems/get", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: problemId }),
        cache: "no-store",
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "問題取得に失敗しました")
        setStatus("failed")
        return
      }

      const p = json.problem
      setProblem(p)

      // 返り値ゆれ吸収（どれかに入ってればOK）
      const lbls: string[] =
        (json.blankLabels as string[]) ??
        (json.blank_labels as string[]) ??
        (p?.blank_labels as string[]) ??
        []

      setLabels(lbls)
      setAnswers(Object.fromEntries(lbls.map((l) => [l, ""])))
      setStatus("ready")
    }

    run()
  }, [problemId])

  const submit = async () => {
    setResult(null)
    setError("")

    const { data } = await supabaseBrowser.auth.getSession()
    const token = data.session?.access_token
    if (!token) {
      setError("ログインしてません。/login でログインしてください。")
      return
    }

    const parsed: Record<string, number> = {}
    for (const l of sortedLabels) {
      const n = Number(answers[l])
      if (!Number.isFinite(n) || n < 1 || n > maxNumber) {
        setError(`空欄${l}は 1〜${maxNumber} の数字で入力してね`)
        return
      }
      parsed[l] = n
    }

    const res = await fetch("/api/problems/submit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ problemId, answers: parsed }),
    })
    const json = await res.json()
    setResult(json)
  }

  const pdfSrc = proxy(problem?.problem_pdf_url)
  const pngSrc = proxy(problem?.choices_image_url)

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 space-y-5">
      {/* タイトル */}
      <div className="text-center space-y-1">
        <div className="text-xs text-neutral-500">status: {status}</div>
        <h1 className="text-2xl font-semibold">{problem?.title ?? "問題"}</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!problem ? (
        <div className="rounded-xl border p-4 text-sm text-neutral-500">読み込み中...</div>
      ) : (
        <>
          {/* PDF */}
          <section className="rounded-2xl border overflow-hidden bg-white shadow-sm">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="font-semibold">問題</div>
              {problem.problem_pdf_url && (
                <a
                  className="text-sm underline text-neutral-700"
                  href={pdfSrc}
                  target="_blank"
                  rel="noreferrer"
                >
                  別タブで開く
                </a>
              )}
            </div>

            {problem.problem_pdf_url ? (
              <iframe
                key={pdfSrc}
                src={pdfSrc}
                className="h-[70vh] w-full bg-white"
                title="problem pdf"
              />
            ) : (
              <div className="p-4 text-sm text-neutral-600">problem_pdf_url が空です</div>
            )}
          </section>

          {/* choices PNG */}
          <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b">
              <div className="font-semibold">選択肢</div>
            </div>

            <div className="p-3">
              {problem.choices_image_url ? (
                <>
                  <img
                    key={pngSrc}
                    src={pngSrc}
                    alt="choices"
                    className="w-full rounded-xl border bg-white"
                    loading="eager"
                    decoding="async"
                    onError={() => {
                      setError("選択肢PNGの読み込みに失敗しました（proxy-image を確認してね）")
                    }}
                  />
                  <a
                    className="mt-2 block text-center text-sm underline text-neutral-700"
                    href={pngSrc}
                    target="_blank"
                    rel="noreferrer"
                  >
                    画像を別タブで開く
                  </a>
                </>
              ) : (
                <div className="p-3 text-sm text-neutral-600">choices_image_url が空です</div>
              )}
            </div>
          </section>

          {/* 入力欄 */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="px-4 py-3 border-b">
              <div className="font-semibold">解答（1〜{maxNumber}）</div>
              <div className="text-xs text-neutral-500">空欄の番号を入力して「評価」</div>
            </div>

            <div className="p-4">
              {sortedLabels.length === 0 ? (
                <div className="text-sm text-neutral-600">
                  空欄が0件です（problem_blanks にデータが入ってない可能性）
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {sortedLabels.map((l) => (
                    <label key={l} className="space-y-1">
                      <div className="text-xs text-neutral-500">空欄 {l}</div>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min={1}
                        max={maxNumber}
                        value={answers[l] ?? ""}
                        onChange={(e) =>
                          setAnswers((p) => ({ ...p, [l]: e.target.value }))
                        }
                        className="w-full rounded-xl border px-3 py-2 text-base"
                      />
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={submit}
                className="mt-5 w-full rounded-[28px] bg-sky-400 py-5 text-lg font-semibold shadow-sm active:scale-[0.99]"
              >
                評価
              </button>

              <div className="mt-3 text-center">
                <Link className="text-sm underline text-neutral-700" href="/quiz">
                  問題一覧に戻る
                </Link>
              </div>
            </div>
          </section>

          {/* 結果 */}
          {result && (
            <section className="space-y-3">
              {result.ok ? (
                <div className="rounded-2xl border bg-emerald-50 p-4 text-center font-semibold text-emerald-700">
                  collect!
                </div>
              ) : (
                <div className="rounded-2xl bg-red-500/90 p-4 text-center font-semibold text-white">
                  filed
                </div>
              )}

              {Array.isArray(result.perBlank) && (
                <div className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
                  <div className="mb-2 font-semibold">結果</div>
                  <div className="space-y-1">
                    {result.perBlank.map((x: any) => (
                      <div key={x.label} className="flex justify-between">
                        <span>
                          {x.label}: {x.your ?? "-"}
                        </span>
                        <span className={x.correct ? "text-emerald-700" : "text-red-600"}>
                          {x.correct ? "OK" : `NG（正:${x.correctNumber}）`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!result.ok && result.explanation && (
                <div className="rounded-2xl border bg-neutral-50 p-4 text-sm">
                  <div className="mb-1 font-semibold">解説</div>
                  <div className="whitespace-pre-wrap">{result.explanation}</div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}
