// app/_components/AuthGate.tsx
'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const ok = !!data.session
      setAuthed(ok)
      setReady(true)
      if (!ok) {
        window.location.href = '/login'
      }
    })
  }, [])

  if (!ready) return <p>Loading...</p>
  if (!authed) return null
  return <>{children}</>
}
