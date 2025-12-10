// components/LessonButton.tsx
import BlueButton from "./BlueButton"

export default function LessonButton({
  label,
  href,
  disabled,
}: {
  label: string
  href?: string
  disabled?: boolean
}) {
  return (
    <BlueButton href={href} disabled={disabled}>
      {label}
    </BlueButton>
  )
}
