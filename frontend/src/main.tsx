// /src/main.tsx

/**
 * Punto de entrada de la aplicación.
 * Monta el QueryClientProvider, el Toaster de sonner y el
 * router de la aplicación.
 * @module src/main
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { Toaster } from "sonner"
import { App } from './App.tsx'
import { queryClient } from './queries/query-client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
    position='top-right'
    closeButton
    duration={2000}
    richColors
    theme='dark'
    />

    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
