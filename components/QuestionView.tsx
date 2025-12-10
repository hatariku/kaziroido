// components/QuestionView.tsx
'use client'

import { useMemo, useState } from "react"

type Props = {
  stepLabel: string
  description: string
  codeImageUrl: string
  choiceImageUrls: string[]
  correctChoice: number // 1-based
  explanation?: string
  nextHref?: string
  backHref?: string
}

export default function QuestionView({
  stepLabel,
  description,
  codeImageUrl,
  choiceImageUrls,
  correctChoice,
  explanation,
  nextHref,
  backHref,
}: Props) {
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState<"idle" | "ok" | "ng">("idle")

  const answerNum = useMemo(() => Number(answer), [answer])

  const check = () => {
    if (!Number.isFinite(answerNum) || answerNum < 1) {
      setResult("ng")
      return
    }
    setResult(answerNum === correctChoice ? "ok" : "ng")
  }

  return (
    <div>
      <div className="text-center text-sm text-gray-500">{stepLabel}</div>

      <p className="mt-3 text-center text-sm leading-relaxed whitespace-pre-line">
        {description}
      </p>

      {/* コード画像 */}
      <div className="mt-5 rounded-md bg-gray-200 p-2">
        <img
          src={codeImageUrl}
          alt="code"
          className="w-full rounded-md object-contain"
        />
      </div>

      {/* 選択肢画像 */}
      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold">選択肢</div>
        <div className="space-y-3">
          {choiceImageUrls.map((url, i) => (
            <div key={i} className="rounded-md bg-gray-100 p-2">
              <div className="mb-1 text-xs text-gray-500"></div>
              <img
                src={url}
                alt={`choice ${i + 1}`}
                className="w-full rounded object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 回答番号入力 */}
      <div className="mt-6 flex items-end gap-3">
        <label className="flex-1">
          <div className="mb-1 text-xs text-gray-500">回答番号</div>
          <input
            type="number"
            min={1}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>
        <button
          onClick={check}
          className="rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold"
        >
          評価
        </button>
      </div>

      {/* 判定 */}
      {result !== "idle" && (
        <div className="mt-4">
          {result === "ok" ? (
            <div className="text-center text-sm font-semibold text-green-600">
              collect!
            </div>
          ) : (
            <div className="rounded-md bg-red-500/90 p-3 text-center text-sm font-semibold text-white">
              filed
            </div>
          )}
        </div>
      )}

      {/* 解説 */}
      {result === "ng" && explanation && (
        <div className="mt-4 rounded-md border bg-gray-50 p-3 text-sm">
          <div className="mb-1 font-semibold">解説</div>
          <div className="whitespace-pre-wrap">{explanation}</div>
        </div>
      )}

      {/* next / back */}
      <div className="mt-6 flex items-center justify-between">
        {backHref ? (
          <a href={backHref} className="text-sm text-gray-500 underline">
            戻る
          </a>
        ) : <span />}

        {result === "ok" && nextHref && (
          <a href={nextHref} className="text-sm font-semibold">
            next &gt;
          </a>
        )}
      </div>
    </div>
  )
}
