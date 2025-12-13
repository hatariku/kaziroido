// app/settings/delete/confirm/page.tsx
import Screen from "@/components/Screen"
import BlueButton from "@/components/BlueButton"

export default function DeleteStep2Page() {
  return (
    <Screen>
      <div className="mt-10 text-center">
        <h1 className="text-lg font-semibold">本当に消しますよ？</h1>
      </div>

      <div className="mt-10 space-y-4">
        <BlueButton href="/settings/delete/final" variant="gray">
          消す！
        </BlueButton>
        <BlueButton href="/settings" variant="gray">
          やっぱりやめた
        </BlueButton>
      </div>
    </Screen>
  )
}
