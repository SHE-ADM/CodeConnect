import type { ReactNode } from 'react'

type LabelProps = {
  htmlFor: string
  children: ReactNode
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-ink mb-1.5"
    >
      {children}
    </label>
  )
}
