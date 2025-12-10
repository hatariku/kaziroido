// app/collection/page.tsx
import Screen from "@/components/Screen"
import BlueButton from "@/components/BlueButton"

export default function CollectionPage() {
  return (
    <Screen title="Collection">
      <div className="space-y-8">
        {/* ASMR (coming soon) */}
        <div className="rounded-md border">
          <div className="bg-gray-200 p-6 text-center text-lg font-semibold">
            ASMR
          </div>
          <div className="p-6 text-center text-sm text-gray-500">
            coming soon...
          </div>
        </div>

        {/* 西 collection */}
        <div className="rounded-md border">
          <div className="bg-gray-200 p-6 text-center text-lg font-semibold">
            西
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex aspect-square items-center justify-center rounded-md bg-gray-200 text-lg font-semibold"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <BlueButton href="/" variant="gray">戻る</BlueButton>
      </div>
    </Screen>
  )
}
