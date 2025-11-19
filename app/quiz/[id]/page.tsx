// app/quiz/[id]/page.tsx
'use client'
import AuthGate from '@/app/_components/AuthGate'
import { useEffect, useState } from 'react'
import { fetchProblemById, fetchNextProblemId } from '@/lib/problems'
import { upsertProgress } from '@/lib/progress'

export default function Quiz({ params }: { params: { id: string } }) {
  const pid = Number(params.id)
  const [q, setQ] = useState<any>(null)
  const [choice, setChoice] = useState<number | null>(null)
  const [result, setResult] = useState<'idle' | 'ok' | 'ng'>('idle')
  const [nextId, setNextId] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      setQ(await fetchProblemById(pid))
      setNextId(await fetchNextProblemId(pid))
      setChoice(null)
      setResult('idle')
    })()
  }, [pid])

  async function submit() {
    if (choice == null || !q) return
    const ok = choice === q.answer_index // ★MVP: クライアント側採点
    await upsertProgress(q.id, ok)
    setResult(ok ? 'ok' : 'ng')
  }

  if (!q) return <p>Loading...</p>

  return (
    <AuthGate>
      <section>
        <h2>
          #{q.id} {q.title}
        </h2>
        {q.image_url && (
          <img src={q.image_url} alt="question" style={{ maxWidth: '100%' }} />
        )}
        <pre className="code">{q.body}</pre>
        <div className="choices">
          {q.choices.map((c: string, i: number) => (
            <button
              key={i}
              className={`choice ${choice === i ? 'selected' : ''}`}
              onClick={() => setChoice(i)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="actions">
          <button className="btn" onClick={submit}>
            答える
          </button>
          {result === 'ok' && <span className="ok">正解！</span>}
          {result === 'ng' && <span className="ng">不正解…</span>}
        </div>
        <hr />
        <nav className="pager">
          <a href="/quiz">一覧へ</a>
          {nextId && (
            <a className="btn" href={`/quiz/${nextId}`}>
              次の問題 →
            </a>
          )}
        </nav>
      </section>
    </AuthGate>
  )
}
