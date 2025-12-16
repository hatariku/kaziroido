import Link from "next/link"

function BigButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[28px] bg-sky-400 py-6 text-center text-xl font-semibold shadow-sm">
      {children}
    </div>
  )
}

export default function ArchivePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-semibold">作ったゲームを遊ぶ</h1>

      <div className="space-y-6">
        <BigButton>GAME 1</BigButton>
        <BigButton>GAME 2</BigButton>
        <BigButton>GAME 3</BigButton>
        <BigButton>GAME EX</BigButton>
      </div>

      <p className="text-center text-sm text-neutral-500">
        ボタンを押すとそれぞれのゲームで遊べる（あとでリンク差し替え）
      </p>

      <div className="text-center">
        <Link className="text-sm underline" href="/">
          戻る
        </Link>
      </div>
    </div>
  )
}
