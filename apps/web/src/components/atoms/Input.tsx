import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export function Input({ invalid = false, className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full bg-field border ${invalid ? 'border-red-500' : 'border-field'} rounded-field px-4 py-2 text-sm text-field-ink placeholder:text-field-ink/60 outline-none focus:border-brand transition-colors ${className}`}
    />
  )
}
