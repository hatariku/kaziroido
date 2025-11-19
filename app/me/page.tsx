// app/me/page.tsx
'use client'
import AuthGate from '@/app/_components/AuthGate'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Me() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  return (
    <AuthGate>
      <section>
        <h2>マイページ</h2>
        <p>ログイン中: {email ?? '(Googleアカウント)'}</p>
      </section>
    </AuthGate>
  )
}
