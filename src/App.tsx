import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import AuthPage from './pages/AuthPage'
import PlannerPage from './pages/PlannerPage'
import HabitsPage from './pages/HabitsPage'
import FocusPage from './pages/FocusPage'
import WeeklyPage from './pages/WeeklyPage'

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

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="*" element={user ? <ProtectedLayout /> : <Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
