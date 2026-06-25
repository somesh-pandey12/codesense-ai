import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import {
  Zap, Flame, Code2, Trophy, ArrowRight,
  CheckCircle2, Clock, TrendingUp, Target
} from 'lucide-react'

const diffConfig = {
  Easy:   { color: 'text-emerald-400', bg: 'bg-emerald-950', border: 'border-emerald-900', bar: 'bg-emerald-500' },
  Medium: { color: 'text-yellow-400',  bg: 'bg-yellow-950',  border: 'border-yellow-900',  bar: 'bg-yellow-500'  },
  Hard:   { color: 'text-red-400',     bg: 'bg-red-950',     border: 'border-red-900',     bar: 'bg-red-500'     },
}

function ProgressBar({ solved, total, color }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-16 text-right">{solved}/{total}</span>
    </div>
  )
}

export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { user, problems, recentSubmissions } = stats || {}
  const solvedPct = problems?.total > 0
    ? Math.round((problems.solved / problems.total) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        {/* Welcome Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Rank #{user?.rank} globally · Joined {new Date(user?.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link to="/problems"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500
              text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all group">
            Solve Problems
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon:  <Zap size={20} className="text-indigo-400" />,
              label: 'Total XP',
              value: user?.xp || 0,
              bg:    'bg-indigo-950 border-indigo-900'
            },
            {
              icon:  <Flame size={20} className="text-orange-400" />,
              label: 'Day Streak',
              value: user?.streak || 0,
              bg:    'bg-orange-950 border-orange-900'
            },
            {
              icon:  <Code2 size={20} className="text-emerald-400" />,
              label: 'Solved',
              value: problems?.solved || 0,
              bg:    'bg-emerald-950 border-emerald-900'
            },
            {
              icon:  <Trophy size={20} className="text-yellow-400" />,
              label: 'Global Rank',
              value: `#${user?.rank || '—'}`,
              bg:    'bg-yellow-950 border-yellow-900'
            },
          ].map(({ icon, label, value, bg }) => (
            <div key={label} className={`${bg} border rounded-2xl p-5`}>
              <div className="flex items-center gap-2 mb-3">
                {icon}
                <span className="text-gray-400 text-sm">{label}</span>
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Overall Progress */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target size={18} className="text-indigo-400" />
              <h2 className="text-white font-semibold">Progress Overview</h2>
            </div>

            {/* Circle progress */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke="#1f2937" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke="#6366f1" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - solvedPct / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-bold text-lg">{solvedPct}%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{problems?.solved}/{problems?.total}</p>
                <p className="text-gray-400 text-sm mt-0.5">Problems solved</p>
              </div>
            </div>

            {/* Difficulty breakdown */}
            <div className="space-y-4">
              {['Easy', 'Medium', 'Hard'].map(d => {
                const cfg  = diffConfig[d]
                const data = problems?.[d.toLowerCase()]
                return (
                  <div key={d}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-medium ${cfg.color}`}>{d}</span>
                      <span className="text-xs text-gray-500">
                        {data?.solved}/{data?.total} solved
                      </span>
                    </div>
                    <ProgressBar
                      solved={data?.solved || 0}
                      total={data?.total || 0}
                      color={cfg.bar}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-indigo-400" />
                <h2 className="text-white font-semibold">Recent Submissions</h2>
              </div>
              <Link to="/problems"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                View all →
              </Link>
            </div>

            {recentSubmissions?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Code2 size={32} className="text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">No submissions yet</p>
                <Link to="/problems"
                  className="mt-3 text-indigo-400 text-sm hover:text-indigo-300">
                  Start solving →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions?.map(sub => {
                  const isAccepted = sub.status === 'Accepted'
                  return (
                    <Link
                      key={sub._id}
                      to={`/problems/${sub.problem?.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl
                        bg-gray-800 border border-gray-700 hover:border-gray-600
                        transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {isAccepted
                          ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                          : <Clock size={16} className="text-red-400 flex-shrink-0" />
                        }
                        <div>
                          <p className="text-white text-sm font-medium group-hover:text-indigo-400 transition">
                            {sub.problem?.title}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(sub.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-medium
                          ${isAccepted ? 'text-emerald-400' : 'text-red-400'}`}>
                          {sub.status}
                        </span>
                        {sub.xpEarned > 0 && (
                          <p className="text-xs text-indigo-400 mt-0.5">+{sub.xpEarned} XP</p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Practice Easy',
              sub:   'Build your foundation',
              color: 'from-emerald-900 to-emerald-950 border-emerald-800',
              btn:   'bg-emerald-600 hover:bg-emerald-500',
              path:  '/problems?difficulty=Easy'
            },
            {
              title: 'Tackle Medium',
              sub:   'Level up your skills',
              color: 'from-yellow-900 to-yellow-950 border-yellow-800',
              btn:   'bg-yellow-600 hover:bg-yellow-500',
              path:  '/problems?difficulty=Medium'
            },
            {
              title: 'Conquer Hard',
              sub:   'Push your limits',
              color: 'from-red-900 to-red-950 border-red-800',
              btn:   'bg-red-600 hover:bg-red-500',
              path:  '/problems?difficulty=Hard'
            },
          ].map(({ title, sub, color, btn, path }) => (
            <Link key={title} to={path}
              className={`bg-gradient-to-br ${color} border rounded-2xl p-5
                hover:scale-[1.02] transition-all duration-200 group`}>
              <p className="text-white font-semibold mb-1">{title}</p>
              <p className="text-gray-400 text-sm mb-4">{sub}</p>
              <span className={`inline-flex items-center gap-1.5 ${btn}
                text-white text-xs font-medium px-3 py-1.5 rounded-lg transition`}>
                Start <ArrowRight size={12}/>
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}