import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../src/app/styles/globals.css'
import '../src/app/styles/index.css'
import { BrowserRouter } from 'react-router-dom' // 1. Import cái này

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Bọc App bằng BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)