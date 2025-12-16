import Link from "next/link"

function BigButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="block w-full rounded-[28px] bg-sky-400 py-6 text-center text-xl font-semibold shadow-sm active:scale-[0.99]"
    >
      {children}
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="mt-10 text-5xl font-black tracking-wide">KAJIROID</h1>
      <p className="mt-2 text-sm text-neutral-500">Presents from Nishi</p>

      <div className="mx-auto mt-12 w-full max-w-[320px] space-y-6">
        <BigButton href="/quiz">問題</BigButton>
        <BigButton href="/archive">Archive</BigButton>
        <BigButton href="/collection">Collection</BigButton>
      </div>
    </div>
  )
}
