// app/login/page.tsx
'use client'
import { supabase } from '@/lib/supabase'

export default function Login() {
  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <section style={{ maxWidth: 420, margin: '48px auto' }}>
      <h2>ログイン</h2>
      <p>学習を開始するにはGoogleでログインしてください。</p>
      <button className="btn" onClick={signInGoogle}>
        Googleでログイン
      </button>
    </section>
  )
}
