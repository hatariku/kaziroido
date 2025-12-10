// app/lesson/1/page.tsx
import Screen from "@/components/Screen"
import LessonButton from "@/components/LessonButton"
import BlueButton from "@/components/BlueButton"

export default function Lesson1StepsPage() {
  // 進捗ができるまでは仮で 1-1 のみ解放
  const unlocked = new Set(["1-1"])

  const steps = ["1-1", "1-2", "1-3", "1-4", "1-5"]

  return (
    <Screen>
      <div className="space-y-4">
        {steps.map((s) => (
          <LessonButton
            key={s}
            label={s}
            href={unlocked.has(s) ? `/lesson/1/${s}` : undefined}
            disabled={!unlocked.has(s)}
          />
        ))}

        <p className="pt-2 text-center text-xs text-gray-500">
          最初は1-1のみ解放 / 前をクリアすると次が解放
        </p>
      </div>

      <div className="mt-10">
        <BlueButton href="/lesson" variant="gray">戻る</BlueButton>
      </div>
    </Screen>
  )
}
