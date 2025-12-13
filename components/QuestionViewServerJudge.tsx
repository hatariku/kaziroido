"use client"

import { useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type Props = {
  questionId: number
  lesson: string
  step: string
  title: string
  description: string
  codeImageUrl: string
  choiceImageUrls: string[]
  nextHref?: string
  backHref?: string
}

export default function QuestionViewServerJudge(props: Props) {
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState<any>(null)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    const n = Number(answer)
    if (!Number.isFinite(n) || n < 1) {
      setResult({ correct: false, message: "数字で入力してね" })
      return
    }

    const { data } = await supabaseBrowser.auth.getSession()
    const token = data.session?.access_token
    if (!token) {
      setResult({ correct: false, message: "ログインしてください" })
      return
    }

    setBusy(true)
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: props.questionId,
        lesson: props.lesson,
        step: props.step,
        answerChoice: n,
      }),
    })
    const json = await res.json()
    setResult(json)
    setBusy(false)
  }

  return (
    <div>
      <div className="text-center text-sm text-gray-500">{props.step}</div>

      <p className="mt-3 text-center text-sm leading-relaxed whitespace-pre-line">
        {props.title}
        {"\n"}
        {props.description}
      </p>

      <div className="mt-5 rounded-md bg-gray-200 p-2">
        <img src={props.codeImageUrl} alt="code" className="w-full rounded-md object-contain" />
      </div>

      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold">選択肢</div>
        <div className="space-y-3">
          {props.choiceImageUrls.map((url, i) => (
            <div key={i} className="rounded-md bg-gray-100 p-2">
              <div className="mb-1 text-xs text-gray-500"></div>
              <img src={url} alt={`choice ${i + 1}`} className="w-full rounded object-contain" />
            </div>
          ))}
        </div>
      </div>

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
          onClick={submit}
          disabled={busy}
          className="rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          評価
        </button>
      </div>

      {result && (
        <div className="mt-4">
          {result.correct ? (
            <div className="text-center text-sm font-semibold text-green-600">
              collect!
            </div>
          ) : (
            <div className="rounded-md bg-red-500/90 p-3 text-center text-sm font-semibold text-white">
              filed
            </div>
          )}

          <div className="mt-2 text-center text-sm">{result.message}</div>

          {!result.correct && result.explanation && (
            <div className="mt-4 rounded-md border bg-gray-50 p-3 text-sm">
              <div className="mb-1 font-semibold">解説</div>
              <div className="whitespace-pre-wrap">{result.explanation}</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        {props.backHref ? (
          <a href={props.backHref} className="text-sm text-gray-500 underline">
            戻る
          </a>
        ) : <span />}
        {result?.correct && props.nextHref && (
          <a href={props.nextHref} className="text-sm font-semibold">
            next &gt;
          </a>
        )}
      </div>
    </div>
  )
}
