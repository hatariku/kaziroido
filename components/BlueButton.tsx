// components/BlueButton.tsx
import Link from "next/link"

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: "solid" | "outline" | "gray"
  disabled?: boolean
  className?: string
}

export default function BlueButton({
  children,
  href,
  onClick,
  variant = "solid",
  disabled,
  className = "",
}: Props) {
  const base =
    "w-full rounded-3xl py-5 text-center text-lg font-semibold transition active:scale-[0.99]"

  const solid = "bg-sky-400 text-black hover:bg-sky-300"
  const outline = "border-2 border-sky-400 text-black hover:bg-sky-50"
  const gray = "bg-gray-200 text-black hover:bg-gray-100"

  const cls = `${base} ${
    variant === "solid" ? solid : variant === "outline" ? outline : gray
  } ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`

  if (href) return <Link className={cls} href={href}>{children}</Link>

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
