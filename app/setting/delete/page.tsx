// app/settings/delete/page.tsx
import Screen from "@/components/Screen"
import BlueButton from "@/components/BlueButton"

export default function DeleteStep1Page() {
  return (
    <Screen>
      <div className="mt-10 text-center">
        <h1 className="text-lg font-semibold">こうかいしませんね？</h1>
      </div>

      <div className="mt-10 space-y-4">
        <BlueButton href="/settings" variant="gray">
          そんなに言うなら消さない
        </BlueButton>
        <BlueButton href="/settings/delete/confirm" variant="gray">
          それでも消す
        </BlueButton>
      </div>
    </Screen>
  )
}
