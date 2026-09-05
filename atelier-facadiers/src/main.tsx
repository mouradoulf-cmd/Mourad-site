import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Preview builds (VITE_STATIC_PREVIEW) are embedded at an arbitrary URL path,
// so BrowserRouter can't match routes against the real location. MemoryRouter
// keeps client-side navigation working there without affecting the real
// production build, which always uses BrowserRouter.
const Router = import.meta.env.VITE_STATIC_PREVIEW ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
