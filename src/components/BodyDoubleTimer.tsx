import { useState, useEffect, useCallback } from 'react'
import { X, Pause, Play, Check } from 'lucide-react'
import { FocusSession } from '../types'

const SOUNDS = [
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'forest', label: 'Forest', emoji: '🌲' },
  { id: 'white', label: 'White Noise', emoji: '🌊' },
  { id: 'none', label: 'Silence', emoji: '🔇' }
]

const AVATARS = ['🧑‍💻', '👩‍🔬', '🧑‍🎨', '👨‍🏫', '🧑‍✈️']

interface Props {
  session: FocusSession
  taskTitle?: string
  onEnd: (completed: boolean) => void
}

export default function BodyDoubleTimer({ session, taskTitle, onEnd }: Props) {
  const totalSeconds = session.planned_minutes * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [isPaused, setIsPaused] = useState(false)
  const [avatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)])
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
  const isComplete = secondsLeft === 0

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft(s => { if (s <= 1) { clearInterval(interval); return 0 } return s - 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused, secondsLeft])

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60), s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [])

  const soundLabel = SOUNDS.find(s => s.id === session.ambient_sound)

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card w-full max-w-md p-8 text-center relative">
        <button onClick={() => onEnd(false)} className="absolute top-4 right-4 btn-ghost p-2">
          <X size={18} />
        </button>
        <div className="mb-6">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2 text-4xl">
            {avatar}
          </div>
          <p className="text-sm text-slate-400">Your body double is here</p>
        </div>
        {taskTitle && <p className="text-lg font-medium text-slate-100 mb-6 px-4">{taskTitle}</p>}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="8" />
            <circle cx="80" cy="80" r="70" fill="none"
              stroke={isComplete ? '#10b981' : '#14b8a6'} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? <Check size={32} className="text-green-400" /> : (
              <><span className="text-3xl font-mono font-bold text-slate-100">{formatTime(secondsLeft)}</span>
              <span className="text-xs text-slate-400 mt-1">remaining</span></>
            )}
          </div>
        </div>
        {soundLabel && (
          <p className="text-sm text-slate-400 mb-4">{soundLabel.emoji} {soundLabel.label}</p>
        )}
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-3">
          {!isComplete && (
            <button onClick={() => setIsPaused(p => !p)} className="btn-ghost flex-1 flex items-center justify-center gap-2">
              {isPaused ? <><Play size={16} />Resume</> : <><Pause size={16} />Pause</>}
            </button>
          )}
          <button onClick={() => onEnd(isComplete || progress > 80)}
            className={`flex-1 flex items-center justify-center gap-2 ${isComplete ? 'btn-primary' : 'btn-ghost'}`}>
            <Check size={16} />{isComplete ? 'Complete!' : 'End Session'}
          </button>
        </div>
      </div>
    </div>
  )
}
