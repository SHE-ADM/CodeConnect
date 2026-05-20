type DividerProps = {
  className?: string
}

export function Divider({ className = '' }: DividerProps) {
  return <div className={`h-px bg-edge ${className}`} aria-hidden="true" />
}
