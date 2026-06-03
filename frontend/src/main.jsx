// frontend/src/main.jsx
// File pertama yang dijalankan React
// Tugasnya: mount komponen App ke dalam index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)