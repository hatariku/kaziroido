// app/page.tsx
import Screen from "@/components/Screen"
import TopBar from "@/components/TopBar"
import BlueButton from "@/components/BlueButton"

export default function HomePage() {
  return (
    <Screen>
      <TopBar />

      <div className="mt-8 text-center">
        <h1 className="text-4xl font-black tracking-wide">KAJIROID</h1>
        <p className="mt-2 text-xs text-gray-400">Presents from Nishi</p>
      </div>

      <div className="mt-14 space-y-6">
        <BlueButton href="/lesson">Lesson Start</BlueButton>
        <BlueButton href="/archive">Archive</BlueButton>
        <BlueButton href="/collection">Collection</BlueButton>
      </div>
    </Screen>
  )
}
