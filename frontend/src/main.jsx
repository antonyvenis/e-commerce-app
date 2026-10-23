import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './api.js'            // installs the JWT interceptors before anything calls the API
import './index.css'
import App from './App.jsx'
import './theme.css'         // loaded after App.css so the theme layer wins
import { CartProvider } from './pages/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
