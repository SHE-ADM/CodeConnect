import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/index.css'

const rootEl = document.getElementById('app')
if (!rootEl) throw new Error('Root element #app não encontrado.')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
