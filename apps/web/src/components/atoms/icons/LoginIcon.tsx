type Props = { className?: string }

export function LoginIcon({ className = '' }: Readonly<Props>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M11 7l-1.41 1.41L12.17 11H4v2h8.17l-2.58 2.59L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
    </svg>
  )
}
