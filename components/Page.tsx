export default function Page({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-zinc-50">
      <div className="mx-auto w-full max-w-md px-4 py-6">
        {title && <h1 className="mb-4 text-xl font-bold text-zinc-900">{title}</h1>}
        {children}
      </div>
    </div>
  )
}
