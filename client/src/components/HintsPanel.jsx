import { useState } from 'react'
import { Lightbulb, ChevronDown, ChevronUp, Lock } from 'lucide-react'

export default function HintsPanel({ hints = [] }) {
  const [revealed,  setRevealed]  = useState([])
  const [expanded,  setExpanded]  = useState(false)

  if (!hints || hints.length === 0) return null

  const revealHint = (idx) => {
    if (!revealed.includes(idx)) {
      setRevealed(prev => [...prev, idx])
    }
  }

  return (
    <div className="border-t border-gray-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3
          text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition"
      >
        <span className="flex items-center gap-2">
          <Lightbulb size={14} className="text-yellow-400"/>
          Hints ({hints.length} available)
        </span>
        {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-2">
          {hints.map((hint, idx) => (
            <div key={idx}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {revealed.includes(idx) ? (
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={13} className="text-yellow-400"/>
                    <span className="text-xs text-yellow-400 font-medium">
                      Hint {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{hint}</p>
                </div>
              ) : (
                <button
                  onClick={() => revealHint(idx)}
                  className="w-full flex items-center justify-between px-4 py-3
                    text-sm hover:bg-gray-800 transition"
                >
                  <span className="flex items-center gap-2 text-gray-400">
                    <Lock size={13}/>
                    Hint {idx + 1}
                  </span>
                  <span className="text-xs text-indigo-400 hover:text-indigo-300">
                    Reveal →
                  </span>
                </button>
              )}
            </div>
          ))}
          {revealed.length > 0 && revealed.length < hints.length && (
            <p className="text-xs text-gray-600 text-center pt-1">
              {hints.length - revealed.length} hint(s) remaining
            </p>
          )}
        </div>
      )}
    </div>
  )
}