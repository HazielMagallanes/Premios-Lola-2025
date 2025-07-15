import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './stylesheets/util/reset.css'
import './stylesheets/global.css'
import './stylesheets/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
