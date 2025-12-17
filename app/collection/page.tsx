export default function CollectionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-semibold">コレクション</h1>

      <div className="rounded-xl border overflow-hidden">
        <div className="bg-neutral-200 p-10 text-center text-xl font-semibold">
          ASMR
        </div>
        <div className="p-10 text-center text-neutral-500">coming soon...</div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="bg-neutral-200 p-10 text-center text-xl font-semibold">
          西
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4">
            {["1", "2", "3", "4"].map((n) => (
              <button
                key={n}
                className="h-14 rounded-lg bg-neutral-200 text-lg font-semibold"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
