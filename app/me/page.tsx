'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Profile = {
  username: string
}

export default function MePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        router.push('/login')
        return
      }

      setEmail(user.email ?? null)

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle()

      if (!error && data) {
        setProfile({ username: data.username })
      }

      setLoading(false)
    })()
  }, [router])

  if (loading) return <p>読み込み中...</p>
  if (!email) return <p>ログインしていません。</p>

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px' }}>
      <h2>マイページ</h2>
      {profile && <p>ユーザー名: {profile.username}</p>}
      <p>メールアドレス: {email}</p>

      <button
        style={{ marginTop: 16 }}
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
      >
        ログアウト
      </button>
    </main>
  )
}
