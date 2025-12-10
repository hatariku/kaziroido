// components/Screen.tsx
export default function Screen({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[420px] bg-white px-6 py-8">
      {title && (
        <h1 className="mb-6 text-center text-xl font-semibold">{title}</h1>
      )}
      {children}
    </main>
  )
}
