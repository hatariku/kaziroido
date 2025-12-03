'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      if (!email) {
        throw new Error('メールアドレスを入力してください。')
      }
      if (password.length < 6) {
        throw new Error('パスワードは6文字以上にしてください。')
      }

      if (mode === 'login') {
        // ログイン（メール＋パスワード）
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        router.push('/quiz')
      } else {
        // 新規登録
        if (!username) {
          throw new Error('ユーザー名を入力してください。')
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        const user = data.user
        if (!user) throw new Error('ユーザー作成に失敗しました。')

        // profiles にユーザー名を保存
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: user.id, username })

        if (profileError) throw profileError

        setMessage('登録が完了しました。つづいてログインしてください。')
        setMode('login')
      }
    } catch (err: any) {
      setMessage(err.message ?? 'エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px' }}>
      <h2>ログイン</h2>

      <div style={{ margin: '16px 0' }}>
        <button
          type="button"
          onClick={() => setMode('login')}
          disabled={mode === 'login'}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          disabled={mode === 'signup'}
          style={{ marginLeft: 8 }}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div style={{ marginBottom: 12 }}>
            <label>
              ユーザー名<br />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="例: taro"
                style={{ width: '100%' }}
              />
            </label>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label>
            メールアドレス<br />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="例: 2412xxxxx@ccmailg.meijo-u.ac.jp"
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            パスワード<br />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading
            ? '送信中...'
            : mode === 'login'
            ? 'ログイン'
            : '登録する'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 12, color: 'red' }}>{message}</p>
      )}
    </main>
  )
}
