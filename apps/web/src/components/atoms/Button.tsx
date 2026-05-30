import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const button = cva(
  'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-button transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-brand hover:bg-brand-hover text-on-brand font-semibold',
        ghost: 'text-ink hover:bg-field',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    children: ReactNode
  }

export function Button({
  variant,
  fullWidth,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={cn(button({ variant, fullWidth }), className)}
    >
      {children}
    </button>
  )
}
