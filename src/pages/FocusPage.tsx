import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Timer, Play, Pause, X, AlertTriangle, Check, Music, Volume2, VolumeX } from 'lucide-react'
import { useFocusSessions } from '../hooks/useFocusSessions'
import type { Task } from '../types'

const AMBIENT_SOUNDS = [
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'forest', label: 'Forest', emoji: '🌲' },
  { id: 'cafe', label: 'Cafe', emoji: '☕' },
  { id: 'white', label: 'White noise', emoji: '〰️' },
  { id: 'none', label: 'Silent', emoji: '🔇' },
]

const DURATIONS = [15, 25, 45, 60]

type Phase = 'setup' | 'running' | 'paused' | 'complete' | 'distracted'

export default function FocusPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const task = (location.state as { task?: Task })?.task ?? null

  const { startSession, endSession } = useFocusSessions()

  const [phase, setPhase] = useState<Phase>('setup')
  const [duration, setDuration] = useState(25)
  const [sound, setSound] = useState('rain')
  const [muted, setMuted] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [distractionCount, setDistractionCount] = useState(0)
  const [recoveryBuffer, setRecoveryBuffer] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = () => { if (intervalRef.current) clearInterval(intervalRef.current) }

  useEffect(() => () => clear(), [])

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds)
    clear()
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clear()
          setPhase('complete')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleStart = async () => {
    const session = await startSession(task?.id ?? null, duration, sound)
    if (session) setSessionId(session.id)
    setPhase('running')
    startTimer(duration * 60)
  }

  const handlePause = () => {
    clear()
    setPhase('paused')
  }

  const handleResume = () => {
    setPhase('running')
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clear()
          setPhase('complete')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleDistracted = () => {
    clear()
    setDistractionCount((c) => c + 1)
    setPhase('distracted')
    // 5-minute recovery buffer
    setRecoveryBuffer(5 * 60)
    intervalRef.current = setInterval(() => {
      setRecoveryBuffer((prev) => {
        if (prev <= 1) {
          clear()
          setPhase('paused')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleComplete = async () => {
    clear()
    if (sessionId) await endSession(sessionId, true)
    setPhase('complete')
  }

  const handleEnd = async () => {
    clear()
    if (sessionId) await endSession(sessionId, false)
    navigate('/')
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const progress = phase === 'running' || phase === 'paused' ? 1 - timeLeft / (duration * 60) : 0
  const circumference = 2 * Math.PI * 88

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-2">Session complete!</h2>
          <p className="text-slate-400 text-sm mb-2">{duration} minutes of focused work.</p>
          {distractionCount > 0 && (
            <p className="text-xs text-slate-500 mb-6">{distractionCount} distraction{distractionCount > 1 ? 's' : ''} handled with grace.</p>
          )}
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => { setPhase('setup'); setDistractionCount(0) }} className="btn-ghost">Another session</button>
            <button onClick={() => navigate('/')} className="btn-primary">Back to today</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {phase === 'setup' && (
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-teal-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Timer className="w-7 h-7 text-teal-400" />
            </div>
            <h1 className="text-xl font-semibold text-slate-100">Body Double</h1>
            <p className="text-slate-400 text-sm mt-1">I'm here with you. Let's focus together.</p>
          </div>

          {task && (
            <div className="card px-4 py-3 mb-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
              <p className="text-sm text-slate-200 truncate">{task.title}</p>
            </div>
          )}

          <div className="card p-5 mb-4">
            <p className="text-xs text-slate-400 mb-3 font-medium">Duration</p>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    duration === d ? 'bg-teal-500 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 mb-3 font-medium flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              Ambient Sound
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {AMBIENT_SOUNDS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSound(s.id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-all ${
                    sound === s.id ? 'bg-teal-500/20 border border-teal-500/40 text-teal-400' : 'text-slate-500 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <span className="text-base">{s.emoji}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleStart} className="btn-primary w-full py-3 text-base font-semibold">
            Start Session
          </button>
        </div>
      )}

      {(phase === 'running' || phase === 'paused') && (
        <div className="w-full max-w-sm animate-fade-in">
          {/* Avatar — calming presence */}
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                  cx="100" cy="100" r="88"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-mono font-semibold text-slate-100">{formatTime(timeLeft)}</span>
                <span className="text-xs text-slate-400 mt-0.5">{phase === 'paused' ? 'paused' : 'left'}</span>
              </div>
            </div>

            {/* Breathing avatar */}
            <div className={`w-14 h-14 mx-auto rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl ${phase === 'running' ? 'animate-breathe' : ''}`}>
              🧘
            </div>
            <p className="text-xs text-slate-500 mt-2">{phase === 'running' ? "I'm working alongside you" : 'Take your time'}</p>
          </div>

          {task && (
            <div className="card px-4 py-2.5 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <p className="text-sm text-slate-300 truncate">{task.title}</p>
            </div>
          )}

          <div className="flex gap-2 mb-3">
            <button
              onClick={phase === 'running' ? handlePause : handleResume}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              {phase === 'running' ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
            </button>
            <button
              onClick={() => setMuted(!muted)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDistracted}
              className="flex-1 flex items-center justify-center gap-1.5 text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 py-2 rounded-xl text-sm transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Distracted
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 flex items-center justify-center gap-1.5 text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 py-2 rounded-xl text-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Done early
            </button>
            <button
              onClick={handleEnd}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              title="End session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {distractionCount > 0 && (
            <p className="text-center text-xs text-slate-500 mt-3">
              {distractionCount} distraction{distractionCount > 1 ? 's' : ''} — that's okay, you're still here
            </p>
          )}
        </div>
      )}

      {phase === 'distracted' && (
        <div className="w-full max-w-sm text-center animate-fade-in">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Recovery buffer</h2>
          <p className="text-slate-400 text-sm mb-1">5 minutes to reset. No judgment.</p>
          <p className="text-4xl font-mono font-semibold text-amber-400 mb-4">{formatTime(recoveryBuffer)}</p>
          <p className="text-xs text-slate-500">Breathe. You'll be back in the flow soon.</p>
        </div>
      )}
    </div>
  )
}
