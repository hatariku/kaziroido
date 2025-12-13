"use client"

import { use } from "react"
import { useEffect, useMemo, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/browser"

export default function QuizOnePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)        // ★ここ
  const problemId = Number(id)      // これでOK
  const [status, setStatus] = useState<string>("init")
  const [error, setError] = useState<string>("")
  const [problem, setProblem] = useState<any>(null)
  const [labels, setLabels] = useState<string[]>([])

  // 入力欄
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const maxNumber = problem?.max_number ?? 60

  // 採点結果
  const [result, setResult] = useState<any>(null)
  const sortedLabels = useMemo(() => [...labels].sort(), [labels])

  useEffect(() => {
    const run = async () => {
      setStatus("loading")
      setError("")
      setResult(null)

      // 1) ログイン確認
      const { data } = await supabaseBrowser.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        setError("ログインしてません。/login でログインしてから開いてください。")
        setStatus("no-token")
        return
      }

      // 2) 問題取得
      const res = await fetch("/api/problems/get", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: problemId }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "問題取得に失敗しました")
        setStatus("failed")
        return
      }

      setProblem(json.problem)
      const lbls = (json.blankLabels ?? []) as string[]
      setLabels(lbls)

      // 入力初期化
      const init = Object.fromEntries(lbls.map((l) => [l, ""]))
      setAnswers(init)

      setStatus("ready")
    }

    if (Number.isFinite(problemId)) run()
    else {
      setError("URLのIDが数字じゃないです")
      setStatus("bad-id")
    }
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

    // 数値化（未入力チェック）
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

  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-4">
      <div className="text-xs text-gray-500">status: {status}</div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!problem ? (
        <div className="text-sm text-gray-500">読み込み中...</div>
      ) : (
        <>
          <h1 className="text-center text-xl font-semibold">{problem.title}</h1>

          {/* PDF */}
          <div className="rounded-md border overflow-hidden">
            {problem.problem_pdf_url ? (
              <>
                <iframe
                  src={problem.problem_pdf_url}
                  className="h-[70vh] w-full"
                  title="problem pdf"
                />
                <a
                  className="block p-2 text-sm underline text-center"
                  href={problem.problem_pdf_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  PDFを別タブで開く
                </a>
              </>
            ) : (
              <div className="p-3 text-sm text-gray-600">problem_pdf_url が空です</div>
            )}
          </div>

          {/* choices PNG */}
          <div className="rounded-md bg-gray-100 p-2">
            {problem.choices_image_url ? (
              <img
                src={problem.choices_image_url}
                alt="choices"
                className="w-full rounded-md"
              />
            ) : (
              <div className="p-3 text-sm text-gray-600">choices_image_url が空です</div>
            )}
          </div>

          {/* 入力欄 */}
          <div className="rounded-md border p-3">
            <div className="mb-2 text-sm font-semibold">
              解答（1〜{maxNumber}）
            </div>

            {sortedLabels.length === 0 ? (
              <div className="text-sm text-gray-600">
                空欄が0件です（problem_blanks にデータが入ってない可能性）
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {sortedLabels.map((l) => (
                  <label key={l}>
                    <div className="mb-1 text-xs text-gray-500">空欄 {l}</div>
                    <input
                      type="number"
                      min={1}
                      max={maxNumber}
                      value={answers[l] ?? ""}
                      onChange={(e) =>
                        setAnswers((p) => ({ ...p, [l]: e.target.value }))
                      }
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={submit}
              className="mt-4 w-full rounded-3xl bg-sky-400 py-4 text-lg font-semibold"
            >
              評価
            </button>
          </div>

          {/* 結果 */}
          {result && (
            <div className="space-y-3">
              {result.ok ? (
                <div className="text-center font-semibold text-green-600">collect!</div>
              ) : (
                <div className="rounded-md bg-red-500/90 p-3 text-center font-semibold text-white">
                  filed
                </div>
              )}

              {Array.isArray(result.perBlank) && (
                <div className="rounded-md border p-3 text-sm">
                  <div className="mb-2 font-semibold">結果</div>
                  <div className="space-y-1">
                    {result.perBlank.map((x: any) => (
                      <div key={x.label} className="flex justify-between">
                        <span>{x.label}: {x.your ?? "-"}</span>
                        <span className={x.correct ? "text-green-600" : "text-red-600"}>
                          {x.correct ? "OK" : `NG（正:${x.correctNumber}）`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!result.ok && result.explanation && (
                <div className="rounded-md border bg-gray-50 p-3 text-sm">
                  <div className="mb-1 font-semibold">解説</div>
                  <div className="whitespace-pre-wrap">{result.explanation}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
