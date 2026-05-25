import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type AuthPage = 'login' | 'cadastro'

type NavigationValue = Readonly<{
  page: AuthPage
  navigate: (page: AuthPage) => void
}>

const NavigationContext = createContext<NavigationValue | null>(null)

export function NavigationProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [page, setPage] = useState<AuthPage>('login')
  const value = useMemo<NavigationValue>(() => ({ page, navigate: setPage }), [page])
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationValue {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation must be used inside NavigationProvider')
  }
  return ctx
}
