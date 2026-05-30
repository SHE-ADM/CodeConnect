import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const textLink = cva('transition-colors cursor-pointer', {
  variants: {
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    },
    tone: {
      brand: 'text-brand hover:text-brand-hover',
      ink: 'text-ink hover:text-ink',
    },
    underline: {
      true: 'underline',
    },
  },
  defaultVariants: {
    size: 'sm',
    tone: 'brand',
  },
})

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof textLink> & {
    children: ReactNode
  }

export function TextLink({
  size,
  tone,
  underline,
  className,
  children,
  ...props
}: Readonly<TextLinkProps>) {
  return (
    <a {...props} className={cn(textLink({ size, tone, underline }), className)}>
      {children}
    </a>
  )
}
