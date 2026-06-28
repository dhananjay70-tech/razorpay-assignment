import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './theme/ThemeProvider'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#6366f1', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
