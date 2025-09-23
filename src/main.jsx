import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import AuthProvider from './providers/AuthProvider';

createRoot(document.getElementById('root')).render(
  // StrictMode 임시 비활성화 - 개발 중 중복 호출 방지
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
  // </StrictMode>
)
