import { Link, useLocation } from 'react-router-dom'
import { Calendar, Target, Zap, ClipboardList, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { path: '/', icon: Calendar, label: 'Planner' },
  { path: '/habits', icon: Target, label: 'Habits' },
  { path: '/focus', icon: Zap, label: 'Focus' },
  { path: '/weekly', icon: ClipboardList, label: 'Weekly' }
]

export default function Navbar() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-14">
        <div className="flex items-center gap-2 mr-8">
          <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-tight">FlowState</span>
        </div>
        <div className="flex items-center gap-1 flex-1">
          {NAV.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive ? 'bg-teal-600/20 text-teal-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}>
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </div>
        <button onClick={() => signOut()} className="btn-ghost p-2 text-slate-400" title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  )
}
