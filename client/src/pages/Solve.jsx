import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'
import {
  Play, Send, ChevronRight, CheckCircle2,
  XCircle, Clock, Zap, RotateCcw, BookOpen
} from 'lucide-react'

const STARTER = {
  javascript: '// Yahan apna solution likhein\n\n',
  python:     '# Yahan apna solution likhein\n\n'
}

const statusConfig = {
  Accepted:      { color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800', icon: <CheckCircle2 size={16}/> },
  'Wrong Answer':{ color: 'text-red-400',     bg: 'bg-red-950 border-red-800',         icon: <XCircle size={16}/> },
  'Runtime Error':{ color: 'text-yellow-400', bg: 'bg-yellow-950 border-yellow-800',   icon: <XCircle size={16}/> },
  Pending:       { color: 'text-gray-400',    bg: 'bg-gray-800 border-gray-700',       icon: <Clock size={16}/> },
}

export default function Solve() {
  const { slug }    = useParams()
  const navigate    = useNavigate()

  const [problem,   setProblem]   = useState(null)
  const [code,      setCode]      = useState('')
  const [language,  setLanguage]  = useState('javascript')
  const [tab,       setTab]       = useState('description') // description | submissions
  const [result,    setResult]    = useState(null)
  const [submitting,setSubmitting]= useState(false)
  const [loading,   setLoading]   = useState(true)
  const [history,   setHistory]   = useState([])

  useEffect(() => { fetchProblem() }, [slug])
  useEffect(() => {
    if (problem) setCode(problem.starterCode?.[language] || STARTER[language])
  }, [language, problem])

  const fetchProblem = async () => {
    try {
      const { data } = await axios.get(`/problems/${slug}`)
      setProblem(data.problem)
      setCode(data.problem.starterCode?.javascript || STARTER.javascript)
    } catch {
      toast.error('Problem load nahi hui')
      navigate('/problems')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    if (!problem) return
    try {
      const { data } = await axios.get(`/submissions/${problem._id}`)
      setHistory(data.submissions)
    } catch {}
  }

  const handleTabChange = (t) => {
    setTab(t)
    if (t === 'submissions') fetchHistory()
  }

  const handleSubmit = async () => {
    if (!code.trim()) return toast.error('Pehle code likhein!')
    setSubmitting(true)
    setResult(null)
    try {
      const { data } = await axios.post('/submissions', {
        problemId: problem._id,
        code,
        language
      })
      setResult(data)
      if (data.status === 'Accepted') {
        toast.success(`🎉 Accepted! +${data.xpEarned} XP`)
      } else {
        toast.error(`${data.status} — ${data.passedTests}/${data.totalTests} tests passed`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission fail hui')
    } finally {
      setSubmitting(false)
    }
  }

  const diffColor = {
    Easy: 'text-emerald-400', Medium: 'text-yellow-400', Hard: 'text-red-400'
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-gray-800 bg-gray-900 px-4 py-2.5">
        <div className="max-w-full mx-auto flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-white cursor-pointer" onClick={() => navigate('/problems')}>
            Problems
          </span>
          <ChevronRight size={14} />
          <span className="text-white">{problem?.title}</span>
          <span className={`ml-2 text-xs font-medium ${diffColor[problem?.difficulty]}`}>
            {problem?.difficulty}
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 112px)' }}>

        {/* LEFT — Problem Description */}
        <div className="w-2/5 border-r border-gray-800 flex flex-col overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-800 bg-gray-900">
            {[
              { id: 'description', label: 'Description', icon: <BookOpen size={13}/> },
              { id: 'submissions', label: 'Submissions',  icon: <Clock size={13}/> },
            ].map(t => (
              <button key={t.id} onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors
                  ${tab === t.id
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Description Content */}
          {tab === 'description' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white mb-2">{problem?.title}</h1>
                <div className="flex flex-wrap gap-2">
                  {problem?.tags.map(tag => (
                    <span key={tag}
                      className="text-xs px-2.5 py-1 bg-gray-800 text-gray-400 rounded-lg border border-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {problem?.description}
                </p>
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <h3 className="text-white font-medium">Examples</h3>
                {problem?.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Input</span>
                      <pre className="text-sm text-gray-300 font-mono mt-1">{ex.input}</pre>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Output</span>
                      <pre className="text-sm text-emerald-400 font-mono mt-1">{ex.output}</pre>
                    </div>
                    {ex.explanation && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Explanation</span>
                        <p className="text-sm text-gray-400 mt-1">{ex.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {problem?.constraints?.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-2">Constraints</h3>
                  <ul className="space-y-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <code className="font-mono">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Submissions Tab */}
          {tab === 'submissions' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  Abhi tak koi submission nahi
                </div>
              ) : (
                history.map(sub => {
                  const sc = statusConfig[sub.status]
                  return (
                    <div key={sub._id}
                      className={`border rounded-xl p-4 ${sc.bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-1.5 font-medium text-sm ${sc.color}`}>
                          {sc.icon} {sub.status}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(sub.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>{sub.passedTests}/{sub.totalTests} tests</span>
                        <span>{sub.runtime}ms</span>
                        <span className="capitalize">{sub.language}</span>
                        {sub.xpEarned > 0 && (
                          <span className="text-indigo-400">+{sub.xpEarned} XP</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Editor + Result */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm
                  rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python" disabled>Python (coming soon)</option>
              </select>
              <button
                onClick={() => setCode(problem?.starterCode?.[language] || STARTER[language])}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white
                  bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg transition"
                title="Code reset karo"
              >
                <RotateCcw size={13}/> Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500
                  disabled:opacity-50 text-white text-sm font-medium
                  px-5 py-2 rounded-lg transition-all"
              >
                <Send size={14}/>
                {submitting ? 'Running...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={val => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                padding: { top: 16, bottom: 16 },
                tabSize: 2,
                wordWrap: 'on',
                automaticLayout: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>

          {/* Result Panel */}
          {result && (
            <div className="border-t border-gray-800 bg-gray-900 max-h-64 overflow-y-auto">
              {/* Result Header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b border-gray-800`}>
                <div className={`flex items-center gap-2 font-medium ${statusConfig[result.status]?.color}`}>
                  {statusConfig[result.status]?.icon}
                  {result.status}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={13}/> {result.runtime}ms
                  </span>
                  <span>{result.passedTests}/{result.totalTests} tests passed</span>
                  {result.xpEarned > 0 && (
                    <span className="flex items-center gap-1 text-indigo-400 font-medium">
                      <Zap size={13}/> +{result.xpEarned} XP
                    </span>
                  )}
                </div>
              </div>

              {/* Test Cases Results */}
              <div className="p-4 grid grid-cols-1 gap-2">
                {result.testResults?.map((t, i) => (
                  <div key={i}
                    className={`rounded-xl border px-4 py-3 text-sm
                      ${t.passed
                        ? 'bg-emerald-950 border-emerald-900'
                        : 'bg-red-950 border-red-900'
                      }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium flex items-center gap-1.5
                        ${t.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.passed
                          ? <><CheckCircle2 size={13}/> Test {i+1} Passed</>
                          : <><XCircle size={13}/> Test {i+1} Failed</>
                        }
                      </span>
                      <span className="text-xs text-gray-500">{t.runtime}ms</span>
                    </div>
                    {!t.passed && (
                      <div className="mt-2 space-y-1 font-mono text-xs">
                        <div className="text-gray-400">Input: <span className="text-gray-300">{t.input}</span></div>
                        <div className="text-gray-400">Expected: <span className="text-emerald-400">{t.expected}</span></div>
                        <div className="text-gray-400">Got: <span className="text-red-400">{t.actual}</span></div>
                        {t.error && <div className="text-yellow-400 mt-1">Error: {t.error}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}