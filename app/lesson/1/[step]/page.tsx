// app/lesson/1/[step]/page.tsx
import Screen from "@/components/Screen"
import QuestionView from "@/components/QuestionView"

const lesson1Data: Record<
  string,
  {
    description: string
    codeImageUrl: string
    choiceImageUrls: string[]
    correctChoice: number
    explanation?: string
    nextStep?: string
  }
> = {
  "1-1": {
    description:
      "〜の〜な機能を作りたい\n次の空欄に入るプログラムを選んでください",
    codeImageUrl: "/dummy/lesson1/1-1-code.png",
    choiceImageUrls: [
      "/dummy/lesson1/1-1-choice1.png",
      "/dummy/lesson1/1-1-choice2.png",
      "/dummy/lesson1/1-1-choice3.png",
    ],
    correctChoice: 2,
    explanation: "ここに1-1の解説を書く。",
    nextStep: "1-2",
  },
  "1-2": {
    description:
      "次の空欄に入るプログラムを選んでください",
    codeImageUrl: "/dummy/lesson1/1-2-code.png",
    choiceImageUrls: [
      "/dummy/lesson1/1-2-choice1.png",
      "/dummy/lesson1/1-2-choice2.png",
      "/dummy/lesson1/1-2-choice3.png",
    ],
    correctChoice: 1,
    explanation: "ここに1-2の解説を書く。",
    nextStep: "1-3",
  },
  "1-3": {
    description: "次の空欄に入るプログラムを選んでください",
    codeImageUrl: "/dummy/lesson1/1-3-code.png",
    choiceImageUrls: [
      "/dummy/lesson1/1-3-choice1.png",
      "/dummy/lesson1/1-3-choice2.png",
      "/dummy/lesson1/1-3-choice3.png",
    ],
    correctChoice: 3,
    explanation: "ここに1-3の解説を書く。",
    nextStep: "1-4",
  },
  "1-4": {
    description: "次の空欄に入るプログラムを選んでください",
    codeImageUrl: "/dummy/lesson1/1-4-code.png",
    choiceImageUrls: [
      "/dummy/lesson1/1-4-choice1.png",
      "/dummy/lesson1/1-4-choice2.png",
      "/dummy/lesson1/1-4-choice3.png",
    ],
    correctChoice: 2,
    explanation: "ここに1-4の解説を書く。",
    nextStep: "1-5",
  },
  "1-5": {
    description: "次の空欄に入るプログラムを選んでください",
    codeImageUrl: "/dummy/lesson1/1-5-code.png",
    choiceImageUrls: [
      "/dummy/lesson1/1-5-choice1.png",
      "/dummy/lesson1/1-5-choice2.png",
      "/dummy/lesson1/1-5-choice3.png",
    ],
    correctChoice: 1,
    explanation: "ここに1-5の解説を書く。",
  },
}

export default function Lesson1StepPage({
  params,
}: {
  params: { step: string }
}) {
  const step = params.step
  const data = lesson1Data[step]

  if (!data) {
    return (
      <Screen title="Not Found">
        <p className="text-sm text-gray-500">このステップは存在しません。</p>
      </Screen>
    )
  }

  const nextHref =
    step === "1-5"
      ? `/lesson/1/${step}/clear`
      : data.nextStep
      ? `/lesson/1/${data.nextStep}`
      : undefined

  return (
    <Screen>
      <QuestionView
        stepLabel={step}
        description={data.description}
        codeImageUrl={data.codeImageUrl}
        choiceImageUrls={data.choiceImageUrls}
        correctChoice={data.correctChoice}
        explanation={data.explanation}
        nextHref={nextHref}
        backHref="/lesson/1"
      />
    </Screen>
  )
}
