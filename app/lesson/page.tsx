// app/lesson/page.tsx
import Screen from "@/components/Screen"
import LessonButton from "@/components/LessonButton"
import BlueButton from "@/components/BlueButton"

export default function LessonSelectPage() {
  // 進捗連動は後で。今は仮
  const exUnlocked = false

  return (
    <Screen>
      <div className="space-y-4">
        <LessonButton label="Lesson 1" href="/lesson/1" />
        <LessonButton label="Lesson 2" href="/lesson/2" />
        <LessonButton label="Lesson 3" href="/lesson/3" />

        <LessonButton
          label="Extra Lesson"
          href={exUnlocked ? "/lesson/ex" : undefined}
          disabled={!exUnlocked}
        />

        <p className="pt-3 text-center text-xs text-gray-500">
          レッスン1〜3までクリアした時にEXを解放
        </p>
      </div>

      <div className="mt-10">
        <BlueButton href="/" variant="gray">戻る</BlueButton>
      </div>
    </Screen>
  )
}
