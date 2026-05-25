import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Size = 'sm' | 'lg'
type Tone = 'brand' | 'ink'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  underline?: boolean
  size?: Size
  tone?: Tone
  children: ReactNode
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm',
  lg: 'text-lg',
}

const toneClasses: Record<Tone, string> = {
  brand: 'text-brand hover:text-brand-hover',
  ink: 'text-ink hover:text-ink',
}

export function TextLink({
  underline = false,
  size = 'sm',
  tone = 'brand',
  className = '',
  children,
  ...props
}: Readonly<TextLinkProps>) {
  return (
    <a
      {...props}
      className={`${sizeClasses[size]} ${toneClasses[tone]} transition-colors cursor-pointer ${underline ? 'underline' : ''} ${className}`}
    >
      {children}
    </a>
  )
}
