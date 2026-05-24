import { useState } from 'react'
import { Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = mode === 'signin' ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">FlowState Commander</h1>
          <p className="text-slate-400 mt-1 text-sm">ADHD-friendly planning, your way</p>
        </div>
        <div className="card p-6">
          <div className="flex bg-slate-900 rounded-lg p-1 mb-6">
            {(['signin', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all
                  ${mode === m ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input w-full" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input w-full" placeholder="••••••••" required minLength={6} />
            </div>
            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
