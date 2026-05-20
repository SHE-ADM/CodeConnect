import type { ReactNode } from 'react'
import { ChainDecorations } from '@/components/atoms/ChainDecorations'

type AuthLayoutProps = {
  banner: ReactNode
  form: ReactNode
}

export function AuthLayout({ banner, form }: AuthLayoutProps) {
  return (
    <div className="relative min-h-svh w-full flex items-center justify-center bg-page p-4 overflow-x-hidden">
      <ChainDecorations />
      <div className="relative z-10 w-full max-w-4xl bg-card rounded-card shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="h-52 md:h-auto">
          {banner}
        </div>
        <div className="flex flex-col justify-center px-8 py-10">
          {form}
        </div>
      </div>
    </div>
  )
}
