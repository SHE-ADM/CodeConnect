import type { ReactNode } from 'react'
import { Divider } from '@/components/atoms/Divider'

type DividerWithTextProps = {
  children: ReactNode
}

export function DividerWithText({ children }: DividerWithTextProps) {
  return (
    <div className="flex items-center gap-3">
      <Divider className="flex-1" />
      <span className="text-xs text-ink-muted whitespace-nowrap">{children}</span>
      <Divider className="flex-1" />
    </div>
  )
}
