import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Brain, Zap, Clock, MemoryStick, CheckCircle2,
  AlertTriangle, Info, ChevronDown, ChevronUp,
  Lightbulb, Code2, Star
} from 'lucide-react'

const severityConfig = {
  error:      { color: 'text-red-400',    bg: 'bg-red-950 border-red-900',      icon: <AlertTriangle size={13}/> },
  warning:    { color: 'text-yellow-400', bg: 'bg-yellow-950 border-yellow-900', icon: <AlertTriangle size={13}/> },
  suggestion: { color: 'text-blue-400',   bg: 'bg-blue-950 border-blue-900',     icon: <Info size={13}/> },
}

const verdictConfig = {
  'Good Solution':       { color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800' },
  'Needs Improvement':   { color: 'text-yellow-400',  bg: 'bg-yellow-950 border-yellow-800'  },
  'Incorrect Approach':  { color: 'text-red-400',     bg: 'bg-red-950 border-red-800'        },
  'Review unavailable':  { color: 'text-gray-400',    bg: 'bg-gray-800 border-gray-700'      },
}

export default function AIReviewPanel({ problemId, code, language }) {
  const [review,      setReview]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [showCode,    setShowCode]    = useState(false)

  const handleReview = async () => {
    if (!code.trim()) return toast.error('Write some code first!')
    setLoading(true)
    setReview(null)
    try {
      const { data } = await axios.post('/review', { problemId, code, language })
      setReview(data.review)
      toast.success('AI Review ready!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed')
    } finally {
      setLoading(false)
    }
  }

  const verdict = verdictConfig[review?.verdict] || verdictConfig['Review unavailable']

  return (
    <div className="border-t border-gray-800">

      {/* Trigger Button */}
      {!review && !loading && (
        <div className="p-4">
          <button
            onClick={handleReview}
            className="w-full flex items-center justify-center gap-2 bg-violet-600
              hover:bg-violet-500 text-white font-medium py-2.5 rounded-xl
              transition-all duration-200 text-sm"
          >
            <Brain size={16} />
            Get AI Code Review
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="p-8 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent
              rounded-full animate-spin" />
            <Brain size={16} className="text-violet-400 absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-400 text-sm">AI is analyzing your code...</p>
          <p className="text-gray-600 text-xs">Checking complexity, bugs, and best practices</p>
        </div>
      )}

      {/* Review Result */}
      {review && (
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">

          {/* Header — Verdict + Score */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${verdict.bg}`}>
            <div>
              <p className="text-xs text-gray-400 mb-1">AI Verdict</p>
              <p className={`font-semibold ${verdict.color}`}>{review.verdict}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Score</p>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-lg">{review.score}</span>
                <span className="text-gray-500 text-sm">/100</span>
              </div>
            </div>
          </div>

          {/* Complexity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock size={13} className="text-indigo-400" />
                <span className="text-xs text-gray-400 font-medium">Time Complexity</span>
              </div>
              <p className="text-white text-sm font-mono">{review.timeComplexity}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <MemoryStick size={13} className="text-purple-400" />
                <span className="text-xs text-gray-400 font-medium">Space Complexity</span>
              </div>
              <p className="text-white text-sm font-mono">{review.spaceComplexity}</p>
            </div>
          </div>

          {/* Strengths */}
          {review.strengths?.length > 0 && (
            <div className="bg-emerald-950 border border-emerald-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Strengths</span>
              </div>
              <ul className="space-y-1.5">
                {review.strengths.map((s, i) => (
                  <li key={i} className="text-emerald-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {review.issues?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Issues Found
              </p>
              {review.issues.map((issue, i) => {
                const sc = severityConfig[issue.severity] || severityConfig.suggestion
                return (
                  <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border text-sm ${sc.bg}`}>
                    <span className={`mt-0.5 flex-shrink-0 ${sc.color}`}>{sc.icon}</span>
                    <div>
                      {issue.line && (
                        <span className="text-xs text-gray-500 mr-2">Line {issue.line}</span>
                      )}
                      <span className={sc.color}>{issue.message}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Optimized Approach */}
          {review.optimizedApproach && (
            <div className="bg-indigo-950 border border-indigo-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-indigo-400" />
                <span className="text-indigo-400 text-sm font-medium">Optimal Approach</span>
              </div>
              <p className="text-indigo-200 text-sm leading-relaxed">
                {review.optimizedApproach}
              </p>

              {/* Optimized Code Toggle */}
              {review.optimizedCode && (
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="flex items-center gap-1.5 mt-3 text-xs text-indigo-400
                    hover:text-indigo-300 transition-colors"
                >
                  <Code2 size={12} />
                  {showCode ? 'Hide' : 'Show'} optimized code
                  {showCode ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>
              )}

              {showCode && review.optimizedCode && (
                <pre className="mt-3 bg-gray-950 rounded-lg p-3 text-xs text-gray-300
                  font-mono overflow-x-auto border border-indigo-900">
                  {review.optimizedCode}
                </pre>
              )}
            </div>
          )}

          {/* Tips */}
          {review.tips?.length > 0 && (
            <div className="bg-amber-950 border border-amber-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={14} className="text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">Pro Tips</span>
              </div>
              <ul className="space-y-1.5">
                {review.tips.map((tip, i) => (
                  <li key={i} className="text-amber-200 text-sm flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Review Again */}
          <button
            onClick={handleReview}
            className="w-full flex items-center justify-center gap-2 bg-gray-800
              hover:bg-gray-700 text-gray-300 text-sm py-2.5 rounded-xl
              border border-gray-700 transition-all"
          >
            <Brain size={14} /> Review Again
          </button>

        </div>
      )}
    </div>
  )
}