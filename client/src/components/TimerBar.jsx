import { useState, useEffect, useRef } from 'react'
import { Clock, Play, Pause, RotateCcw } from 'lucide-react'

export default function TimerBar() {
  const [seconds,  setSeconds]  = useState(0)
  const [running,  setRunning]  = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const format = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const isWarning = seconds > 1800  // 30 min
  const isDanger  = seconds > 3600  // 1 hour

  return (
    <div className="flex items-center gap-2 bg-gray-800 border border-gray-700
      rounded-lg px-3 py-1.5">
      <Clock size={13} className={
        isDanger  ? 'text-red-400' :
        isWarning ? 'text-yellow-400' : 'text-gray-400'
      }/>
      <span className={`font-mono text-sm font-medium
        ${isDanger  ? 'text-red-400' :
          isWarning ? 'text-yellow-400' : 'text-white'}`}>
        {format(seconds)}
      </span>
      <div className="flex items-center gap-1 ml-1">
        <button
          onClick={() => setRunning(!running)}
          className="text-gray-400 hover:text-white transition"
          title={running ? 'Pause' : 'Start'}
        >
          {running
            ? <Pause size={12}/>
            : <Play size={12}/>
          }
        </button>
        <button
          onClick={() => { setSeconds(0); setRunning(false) }}
          className="text-gray-400 hover:text-white transition"
          title="Reset"
        >
          <RotateCcw size={12}/>
        </button>
      </div>
    </div>
  )
}