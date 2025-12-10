// app/lesson/1/[step]/clear/page.tsx
import Screen from "@/components/Screen"
import BlueButton from "@/components/BlueButton"

export default function Lesson1ClearPage({ params }: any) {
  const step = params.step
  const isLast = step === "1-5"
  const nextStepMap: Record<string, string> = {
    "1-1": "1-2",
    "1-2": "1-3",
    "1-3": "1-4",
    "1-4": "1-5",
  }

  return (
    <Screen>
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold">{step} clear!</h1>

        <div className="mt-6 text-sm text-gray-600">
          {isLast ? (
            <>
              <p>lesson1を全てクリアしました</p>
              <p className="mt-1">collectionにゲーム1が追加されました</p>
            </>
          ) : (
            <p>報酬が追加されました</p>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {!isLast && nextStepMap[step] && (
          <BlueButton href={`/lesson/1/${nextStepMap[step]}`}>
            {nextStepMap[step]}に進む
          </BlueButton>
        )}
        <BlueButton href="/lesson/1" variant="gray">
          レッスン選択に戻る
        </BlueButton>
      </div>
    </Screen>
  )
}


  