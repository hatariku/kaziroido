// app/quiz/page.tsx
'use client'
import AuthGate from '@/app/_components/AuthGate'
import { useEffect, useState } from 'react'
import { fetchProblemsBrief, fetchFirstProblemId } from '@/lib/problems'
import { getProgressMap } from '@/lib/progress'

type Brief = { id: number; title: string }

export default function QuizIndex() {
  const [list, setList] = useState<Brief[]>([])
  const [nextId, setNextId] = useState<number | null>(null)
  const [progress, setProgress] = useState<Record<number, boolean>>({})

  useEffect(() => {
    (async () => {
      const [brief, first, prog] = await Promise.all([
        fetchProblemsBrief(),
        fetchFirstProblemId(),
        getProgressMap(),
      ])
      setList(brief)
      setProgress(prog)
      const firstUncleared = brief.find(b => !prog[b.id])?.id ?? first
      setNextId(firstUncleared)
    })()
  }, [])

  return (
    <AuthGate>
      <section>
        <h2>コース進捗</h2>
        {nextId && (
          <a className="btn" href={`/quiz/${nextId}`}>
            続きから
          </a>
        )}
        <ul className="list">
          {list.map(x => (
            <li key={x.id}>
              <a href={`/quiz/${x.id}`}>
                #{x.id} {x.title} {progress[x.id] ? '✅' : ''}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </AuthGate>
  )
}
