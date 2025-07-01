import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ContextProvider from './context/index.tsx'

// Get cookies from the browser
const cookies = document.cookie || null;

createRoot(document.getElementById('root')!).render(
  <ContextProvider cookies={cookies}>
    <App />
  </ContextProvider>
)
