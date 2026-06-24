import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import { CheckCircle2, Circle, Search, Tag } from 'lucide-react'

const difficultyConfig = {
  Easy:   { color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800' },
  Medium: { color: 'text-yellow-400',  bg: 'bg-yellow-950 border-yellow-800'  },
  Hard:   { color: 'text-red-400',     bg: 'bg-red-950 border-red-800'        },
}

export default function Problems() {
  const [problems, setProblems]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [difficulty, setDifficulty]   = useState('')

  useEffect(() => {
    fetchProblems()
  }, [difficulty])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const params = {}
      if (difficulty) params.difficulty = difficulty
      const { data } = await axios.get('/problems', { params })
      setProblems(data.problems)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total:  problems.length,
    solved: problems.filter(p => p.isSolved).length,
    easy:   problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard:   problems.filter(p => p.difficulty === 'Hard').length,
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Problems</h1>
          <p className="text-gray-400">
            {stats.solved} / {stats.total} solved
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Easy',   count: stats.easy,   color: 'text-emerald-400', border: 'border-emerald-900' },
            { label: 'Medium', count: stats.medium, color: 'text-yellow-400',  border: 'border-yellow-900'  },
            { label: 'Hard',   count: stats.hard,   color: 'text-red-400',     border: 'border-red-900'     },
          ].map(({ label, count, color, border }) => (
            <div key={label}
              className={`bg-gray-900 border ${border} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-gray-400 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Problem search karein..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl
                pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm
                focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div className="flex gap-2">
            {['', 'Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                  ${difficulty === d
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
              >
                {d || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Koi problem nahi mili</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider"># Title</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tags</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((problem, idx) => {
                  const diff = difficultyConfig[problem.difficulty]
                  return (
                    <tr key={problem._id}
                      className="hover:bg-gray-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        {problem.isSolved
                          ? <CheckCircle2 size={18} className="text-emerald-400" />
                          : <Circle size={18} className="text-gray-600" />
                        }
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/problems/${problem.slug}`}
                          className="text-white hover:text-indigo-400 transition-colors font-medium"
                        >
                          {idx + 1}. {problem.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${diff.bg} ${diff.color}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.slice(0, 2).map(tag => (
                            <span key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-md border border-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-indigo-400 text-sm font-medium">+{problem.xpReward}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}