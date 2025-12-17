import Link from "next/link"

function GrayButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block w-full rounded-xl bg-neutral-200 px-4 py-4 text-center font-semibold"
    >
      {children}
    </Link>
  )
}

export default function SettingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-semibold">設定</h1>

      <div className="space-y-4">
        <GrayButton href="/me">プロフィール</GrayButton>
        <GrayButton href="/setting/delete">データ削除</GrayButton>
      </div>

      <div className="pt-4 text-center text-sm text-neutral-500">適時追加</div>

      <div className="pt-10 flex justify-center">
        <div className="h-10 w-10 bg-neutral-200" />
      </div>
    </div>
  )
}
