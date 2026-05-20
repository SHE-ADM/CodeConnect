import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export function Input({ invalid = false, className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full bg-field border ${invalid ? 'border-red-500' : 'border-edge'} rounded-field px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-brand/60 transition-colors ${className}`}
    />
  )
}
