import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.jsx'
import { Toaster } from './components/ui/sonner.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <BrowserRouter>
    <App />
    <Toaster
        position="top-right"   // default top-right for all toasts
        richColors            // automatic styling for success/error/info
        closeButton           // show close button
      />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
