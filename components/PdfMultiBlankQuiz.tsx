"use client"

import { useMemo, useState } from "react"

type Props = {
  title: string
  problemPdfUrl: string | null
  choicesImageUrl: string | null
  maxNumber: number
  blankLabels: string[] // ["A","B",...]
  onSubmit: (answers: Record<string, number>) => Promise<any>
}

export default function PdfMultiBlankQuiz({
  title,
  problemPdfUrl,
  choicesImageUrl,
  maxNumber,
  blankLabels,
  onSubmit,
}: Props) {
  const labels = useMemo(
    () => [...blankLabels].sort((a, b) => a.localeCompare(b)),
    [blankLabels]
  )

  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(labels.map((l) => [l, ""]))
  )
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<any>(null)

  const submit = async () => {
    const parsed: Record<string, number> = {}
    for (const l of labels) {
      const n = Number(answers[l])
      if (!Number.isFinite(n) || n < 1 || n > maxNumber) {
        setResult({ ok: false, message: `空欄${l}は 1〜${maxNumber} で入力してね` })
        return
      }
      parsed[l] = n
    }

    setBusy(true)
    const r = await onSubmit(parsed)
    setResult(r)
    setBusy(false)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-center text-xl font-semibold">{title}</h1>

      {problemPdfUrl ? (
        <div className="rounded-md border">
          <iframe
            src={problemPdfUrl}
            className="h-[70vh] w-full rounded-md"
            title="problem pdf"
          />
        </div>
      ) : (
        <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-600">
          PDF URLが未設定です
        </div>
      )}

      {choicesImageUrl ? (
        <div className="rounded-md bg-gray-100 p-2">
          <img src={choicesImageUrl} alt="choices" className="w-full rounded-md" />
        </div>
      ) : (
        <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-600">
          choices画像URLが未設定です
        </div>
      )}

      <div className="rounded-md border p-3">
        <div className="mb-2 text-sm font-semibold">回答（1〜{maxNumber}）</div>

        <div className="grid grid-cols-3 gap-3">
          {labels.map((l) => (
            <label key={l} className="block">
              <div className="mb-1 text-xs text-gray-500">空欄 {l}</div>
              <input
                inputMode="numeric"
                type="number"
                min={1}
                max={maxNumber}
                value={answers[l] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [l]: e.target.value }))
                }
                className="w-full rounded-md border px-3 py-2"
              />
            </label>
          ))}
        </div>

        <button
          onClick={submit}
          disabled={busy}
          className="mt-4 w-full rounded-3xl bg-sky-400 py-4 text-lg font-semibold disabled:opacity-50"
        >
          {busy ? "採点中..." : "評価"}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          {result.ok ? (
            <div className="text-center text-sm font-semibold text-green-600">
              collect!
            </div>
          ) : (
            <div className="rounded-md bg-red-500/90 p-3 text-center text-sm font-semibold text-white">
              filed
            </div>
          )}

          {Array.isArray(result.perBlank) && (
            <div className="rounded-md border p-3 text-sm">
              <div className="mb-2 font-semibold">結果</div>
              <div className="space-y-1">
                {result.perBlank.map((x: any) => (
                  <div key={x.label} className="flex items-center justify-between">
                    <span>
                      {x.label}: {x.your ?? "-"}
                    </span>
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
    </div>
  )
}
