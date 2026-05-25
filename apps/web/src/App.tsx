import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext'
import LoginPage from '@/pages/LoginPage'
import CadastroPage from '@/pages/CadastroPage'

function Router() {
  const { page } = useNavigation()
  return page === 'cadastro' ? <CadastroPage /> : <LoginPage />
}

export default function App() {
  return (
    <NavigationProvider>
      <Router />
    </NavigationProvider>
  )
}
