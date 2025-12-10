// app/archive/page.tsx
import Screen from "@/components/Screen"
import BlueButton from "@/components/BlueButton"

export default function ArchivePage() {
  return (
    <Screen title="作ったゲームを遊ぶ">
      <div className="space-y-6">
        <BlueButton href="/games/1">GAME 1</BlueButton>
        <BlueButton href="/games/2">GAME 2</BlueButton>

        <p className="text-center text-sm text-gray-500">
          ボタンを押すとそれぞれのゲームで遊べる
        </p>

        <BlueButton href="/games/3">GAME 3</BlueButton>
        <BlueButton href="/games/ex">GAME EX</BlueButton>
      </div>
    </Screen>
  )
}
