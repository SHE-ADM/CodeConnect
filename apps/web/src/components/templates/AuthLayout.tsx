import type { ReactNode } from 'react'
import { ChainDecorations } from '@/components/atoms/ChainDecorations'

type AuthLayoutProps = {
  banner: ReactNode
  form: ReactNode
}

export function AuthLayout({ banner, form }: Readonly<AuthLayoutProps>) {
  return (
    <div className="relative min-h-svh w-full flex items-center justify-center bg-page p-4 overflow-x-hidden">
      <ChainDecorations />
      <main className="relative z-10 w-full max-w-5xl bg-card border border-card-border rounded-card shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2 md:gap-6 md:px-20 md:py-14">
        <div className="h-52 md:h-auto md:overflow-hidden md:rounded-card">
          {banner}
        </div>
        <div className="flex flex-col justify-center px-8 py-10 md:px-0 md:py-0">
          {form}
        </div>
      </main>
    </div>
  )
}
