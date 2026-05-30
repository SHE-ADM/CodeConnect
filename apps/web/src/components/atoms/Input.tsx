import type { InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const input = cva(
  'w-full bg-field border rounded-field px-4 py-2 text-sm text-field-ink placeholder:text-field-ink/60 outline-none focus:border-brand transition-colors',
  {
    variants: {
      invalid: {
        true: 'border-red-500',
        false: 'border-field',
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
)

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof input>

export function Input({ invalid, className, ...props }: InputProps) {
  return <input {...props} className={cn(input({ invalid }), className)} />
}
