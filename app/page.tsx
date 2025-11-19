// app/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { fetchFirstProblemId } from '@/lib/problems'

export default function Home() {
  const [firstId, setFirstId] = useState<number | null>(null)

  useEffect(() => {
    fetchFirstProblemId().then(setFirstId)
  }, [])

  return (
    <section>
      <h2>ゲーム選択</h2>
      <p>C言語でミニゲームを作るコースです。</p>
      {firstId && (
        <a className="btn" href={`/quiz/${firstId}`}>
          はじめる
        </a>
      )}
    </section>
  )
}

