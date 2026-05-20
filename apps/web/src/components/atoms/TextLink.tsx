import type { AnchorHTMLAttributes, ReactNode } from 'react'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  underline?: boolean
  children: ReactNode
}

export function TextLink({
  underline = false,
  className = '',
  children,
  ...props
}: TextLinkProps) {
  return (
    <a
      {...props}
      className={`text-sm text-brand hover:text-brand-hover transition-colors cursor-pointer ${underline ? 'underline' : ''} ${className}`}
    >
      {children}
    </a>
  )
}
