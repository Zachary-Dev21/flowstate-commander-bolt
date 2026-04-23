import { NavLink } from 'react-router-dom'
import { CalendarDays, Sparkles, Timer, BarChart3, LogOut, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', icon: CalendarDays, label: 'Today' },
  { to: '/habits', icon: Sparkles, label: 'Habits' },
  { to: '/focus', icon: Timer, label: 'Focus' },
  { to: '/weekly', icon: BarChart3, label: 'Weekly' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top nav */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500/20 rounded-lg flex items-center justify-center border border-teal-500/30">
            <Zap className="w-4 h-4 text-teal-400" />
          </div>
          <span className="font-semibold text-slate-100 text-sm tracking-tight">FlowState</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={signOut}
          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
