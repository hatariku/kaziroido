// components/TopBar.tsx
import Link from "next/link"

export default function TopBar() {
  return (
    <div className="mb-10 flex items-center justify-between">
      <Link
        href="/settings"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border"
        aria-label="menu"
      >
        <span className="text-lg">≡</span>
      </Link>
      <div className="text-xs text-gray-400"> </div>
    </div>
  )
}
