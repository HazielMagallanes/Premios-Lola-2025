import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './stylesheets/util/reset.css';
import './stylesheets/global.css';
import './stylesheets/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
