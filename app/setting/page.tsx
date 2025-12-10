// app/settings/page.tsx
import Screen from "@/components/Screen"
import BlueButton from "@/components/BlueButton"

export default function SettingsPage() {
  return (
    <Screen title="Settings">
      <div className="space-y-4">
        <BlueButton href="/settings/profile" variant="gray">
          Profile
        </BlueButton>

        <BlueButton href="/settings/delete" variant="gray">
          データ削除
        </BlueButton>

        <div className="pt-4 text-center text-sm text-gray-500">
          適時追加
        </div>
      </div>

      <div className="mt-16">
        <BlueButton href="/" variant="gray">戻る</BlueButton>
      </div>
    </Screen>
  )
}
