import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Toaster} from "sonner"
import {App} from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
    position='top-right'
    closeButton
    duration={2000}
    richColors
    theme='dark'
    />

    
    <App />
  </StrictMode>,
)
