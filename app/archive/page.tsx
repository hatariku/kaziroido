import Link from "next/link"

function BigButton({
  children,
  href,
  external,
}: {
  children: React.ReactNode
  href?: string
  external?: boolean
}) {
  const base =
    "block w-full rounded-[28px] bg-sky-400 py-6 text-center text-xl font-semibold shadow-sm active:scale-[0.99]"

  // リンク未設定（押せない）
  if (!href) {
    return <div className={base + " opacity-60"}>{children}</div>
  }

  // 外部リンク（GitHub Pagesへ直行）
  if (external) {
    return (
      <a
        className={base}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    )
  }

  // 内部リンク（Next.js内のページへ）
  return (
    <Link className={base} href={href}>
      {children}
    </Link>
  )
}

export default function ArchivePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-semibold">作ったゲームを遊ぶ</h1>

      <div className="space-y-6">
        {/* そのまま外部URLへ飛ばす（確実） */}
        <BigButton
          href="https://yukito1017.github.io/PBL_runfinal/"
          external
        >
          GAME 1
        </BigButton>

        <BigButton
          href="https://otara0720.github.io/Shooting/"
          external
        >
          GAME 2
        </BigButton>

        {/* 未設定は押せないまま */}
        <BigButton>GAME 3</BigButton>
        <BigButton>GAME EX</BigButton>
      </div>

      <p className="text-center text-sm text-neutral-500">
        ボタンを押すとそれぞれのゲームで遊べる
      </p>

      <div className="text-center">
        <Link className="text-sm underline" href="/">
          戻る
        </Link>
      </div>
    </div>
  )
}
