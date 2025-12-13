// app/settings/delete/final/page.tsx
import Screen from "@/components/Screen"
import BlueButton from "@/components/BlueButton"

export default function DeleteStep3Page() {
  return (
    <Screen>
      <div className="mt-10 text-center">
        <h1 className="text-lg font-semibold">全てのデータを消しますか？</h1>
      </div>

      <div className="mt-10 space-y-4">
        {/* ここは後で本当の削除処理をつなぐ */}
        <BlueButton href="/settings" variant="gray">
          消す
        </BlueButton>
        <BlueButton href="/settings" variant="gray">
          消さない
        </BlueButton>
      </div>
    </Screen>
  )
}
