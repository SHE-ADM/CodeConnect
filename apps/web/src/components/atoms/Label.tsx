import type { ReactNode } from 'react'

type LabelProps = {
  htmlFor: string
  children: ReactNode
}

export function Label({ htmlFor, children }: Readonly<LabelProps>) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-lg font-normal text-ink mb-1.5"
    >
      {children}
    </label>
  )
}
