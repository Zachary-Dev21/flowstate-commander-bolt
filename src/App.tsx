import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Component, ReactNode } from 'react'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import AuthPage from './pages/AuthPage'
import PlannerPage from './pages/PlannerPage'
import HabitsPage from './pages/HabitsPage'
import FocusPage from './pages/FocusPage'
import WeeklyPage from './pages/WeeklyPage'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(err: Error) { return { error: err.message } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#0f172a', color: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: 400, textAlign: 'center' }}>
            <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>{this.state.error}</p>
            <button onClick={() => window.location.reload()}
              style={{ background: '#0d9488', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function ProtectedLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<PlannerPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/weekly" element={<WeeklyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #14b8a6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="*" element={user ? <ProtectedLayout /> : <Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}


export default App