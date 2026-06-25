import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import { CheckCircle2, Circle, Search, Building2, TrendingUp } from 'lucide-react'

const diffConfig = {
  Easy:   { color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800' },
  Medium: { color: 'text-yellow-400',  bg: 'bg-yellow-950 border-yellow-800'  },
  Hard:   { color: 'text-red-400',     bg: 'bg-red-950 border-red-800'        },
}

const COMPANIES = ['All', 'Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Goldman Sachs', 'Bloomberg']
const TAGS      = ['All', 'Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Binary Search', 'Stack', 'Two Pointers']

export default function Problems() {
  const [problems,   setProblems]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [company,    setCompany]    = useState('All')
  const [tag,        setTag]        = useState('All')

  useEffect(() => { fetchProblems() }, [difficulty])

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

  const filtered = problems.filter(p => {
    const matchSearch  = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCompany = company === 'All' || p.company?.includes(company)
    const matchTag     = tag === 'All' || p.tags?.includes(tag)
    return matchSearch && matchCompany && matchTag
  })

  const stats = {
    total:       problems.length,
    solved:      problems.filter(p => p.isSolved).length,
    easy:        problems.filter(p => p.difficulty === 'Easy').length,
    medium:      problems.filter(p => p.difficulty === 'Medium').length,
    hard:        problems.filter(p => p.difficulty === 'Hard').length,
    solvedEasy:  problems.filter(p => p.isSolved && p.difficulty === 'Easy').length,
    solvedMed:   problems.filter(p => p.isSolved && p.difficulty === 'Medium').length,
    solvedHard:  problems.filter(p => p.isSolved && p.difficulty === 'Hard').length,
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Problems</h1>
          <p className="text-gray-400">{stats.solved} / {stats.total} solved</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Easy',   solved: stats.solvedEasy, total: stats.easy,   c: diffConfig.Easy   },
            { label: 'Medium', solved: stats.solvedMed,  total: stats.medium, c: diffConfig.Medium },
            { label: 'Hard',   solved: stats.solvedHard, total: stats.hard,   c: diffConfig.Hard   },
          ].map(({ label, solved, total, c }) => (
            <div key={label} className={`border rounded-2xl p-5 ${c.bg}`}>
              <div className="flex items-end justify-between mb-3">
                <span className={`text-sm font-medium ${c.color}`}>{label}</span>
                <span className="text-gray-400 text-xs">{solved}/{total}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    label === 'Easy' ? 'bg-emerald-500' :
                    label === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: total > 0 ? `${(solved/total)*100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 space-y-3">

          {/* Search + Difficulty */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl
                  pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm
                  focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex gap-2">
              {['', 'Easy', 'Medium', 'Hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                    ${difficulty === d
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}>
                  {d || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Company Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Building2 size={14} className="text-gray-500" />
            {COMPANIES.map(c => (
              <button key={c} onClick={() => setCompany(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                  ${company === c
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}>
                {c}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <TrendingUp size={14} className="text-gray-500" />
            {TAGS.map(t => (
              <button key={t} onClick={() => setTag(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                  ${tag === t
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No problems found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-10">✓</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider"># Title</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Companies</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tags</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Acceptance</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((problem, idx) => {
                  const diff = diffConfig[problem.difficulty]
                  return (
                    <tr key={problem._id} className="hover:bg-gray-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        {problem.isSolved
                          ? <CheckCircle2 size={17} className="text-emerald-400" />
                          : <Circle size={17} className="text-gray-700" />
                        }
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/problems/${problem.slug}`}
                          className="text-white hover:text-indigo-400 transition font-medium text-sm">
                          {idx + 1}. {problem.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${diff.bg} ${diff.color}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {problem.company?.slice(0, 3).map(c => (
                            <span key={c}
                              className="text-xs px-2 py-0.5 bg-blue-950 text-blue-400 rounded-md border border-blue-900">
                              {c}
                            </span>
                          ))}
                          {problem.company?.length > 3 && (
                            <span className="text-xs text-gray-500">+{problem.company.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags?.slice(0, 2).map(tag => (
                            <span key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-md border border-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-medium ${
                          problem.acceptanceRate > 50 ? 'text-emerald-400' :
                          problem.acceptanceRate > 35 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {problem.acceptanceRate?.toFixed(1)}%
                        </span>
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

        <p className="text-center text-gray-600 text-sm mt-4">
          Showing {filtered.length} of {problems.length} problems
        </p>
      </div>
    </div>
  )
}