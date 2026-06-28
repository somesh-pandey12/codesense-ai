import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import ActivityHeatmap from '../components/ActivityHeatmap'
import { useAuth } from '../context/AuthContext'
import {
  Zap, Flame, Trophy, Code2, Target,
  CheckCircle2, Clock, ArrowRight, Calendar,
  TrendingUp, Star
} from 'lucide-react'

const diffConfig = {
  Easy:   { color: 'text-emerald-400', bar: 'bg-emerald-500', bg: 'bg-emerald-950 border-emerald-900' },
  Medium: { color: 'text-yellow-400',  bar: 'bg-yellow-500',  bg: 'bg-yellow-950 border-yellow-900'  },
  Hard:   { color: 'text-red-400',     bar: 'bg-red-500',     bg: 'bg-red-950 border-red-900'        },
}

function ProgressBar({ value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-12 text-right">{value}/{total}</span>
    </div>
  )
}

export default function Profile() {
  const { userId }  = useParams()
  const { user: me} = useAuth()
  const navigate    = useNavigate()

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('solved')

  // Agar no userId — current user ka profile
  const targetId = userId || me?._id || me?.id

  useEffect(() => {
    if (!targetId) return
    axios.get(`/profile/${targetId}`)
      .then(res => setData(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [targetId])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!data) return null

  const { user, stats, badges, recentSubmissions, activityMap, solvedProblems } = data
  const acceptanceRate = stats.totalSubmissions > 0
    ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        {/* Profile Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start gap-5">

            {/* Avatar */}
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center
              justify-center text-3xl font-bold text-white flex-shrink-0">
              {user.avatar
                ? <img src={user.avatar} alt={user.name}
                    className="w-full h-full rounded-2xl object-cover"/>
                : user.name?.charAt(0).toUpperCase()
              }
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Trophy size={13} className="text-yellow-400"/>
                      Rank #{user.rank}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13}/>
                      Joined {new Date(user.joinedAt).toLocaleDateString('en-IN', {
                        month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {user.isOwnProfile && (
                  <Link to="/dashboard"
                    className="flex items-center gap-1.5 text-sm text-indigo-400
                      hover:text-indigo-300 bg-indigo-950 border border-indigo-900
                      px-4 py-2 rounded-xl transition">
                    Dashboard <ArrowRight size={14}/>
                  </Link>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                {[
                  { icon: <Zap size={14} className="text-indigo-400"/>,   label: `${user.xp} XP`           },
                  { icon: <Flame size={14} className="text-orange-400"/>, label: `${user.streak} day streak` },
                  { icon: <Code2 size={14} className="text-emerald-400"/>,label: `${stats.totalSolved} solved` },
                  { icon: <TrendingUp size={14} className="text-blue-400"/>, label: `${acceptanceRate}% acceptance` },
                ].map(({ icon, label }) => (
                  <div key={label}
                    className="flex items-center gap-1.5 bg-gray-800 border border-gray-700
                      px-3 py-1.5 rounded-lg text-sm text-gray-300">
                    {icon} {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-yellow-400"/>
              <h2 className="text-white font-semibold">Badges</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full ml-1">
                {badges.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {badges.map(badge => (
                <div key={badge.id}
                  title={badge.desc}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700
                    hover:border-gray-500 rounded-xl px-4 py-2.5 transition cursor-default">
                  <span className="text-xl">{badge.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{badge.name}</p>
                    <p className="text-gray-500 text-xs">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Difficulty Progress */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Target size={16} className="text-indigo-400"/>
              <h2 className="text-white font-semibold">Problem Progress</h2>
            </div>

            {/* Circle */}
            <div className="flex items-center gap-5 mb-5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="30" fill="none"
                    stroke="#1f2937" strokeWidth="8"/>
                  <circle cx="40" cy="40" r="30" fill="none"
                    stroke="#6366f1" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - stats.totalSolved / (stats.totalProblems || 1))}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{stats.totalSolved}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalSolved}/{stats.totalProblems}
                </p>
                <p className="text-gray-400 text-sm">problems solved</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Easy',   solved: stats.solvedEasy,   total: Math.round(stats.totalProblems * 0.4) },
                { label: 'Medium', solved: stats.solvedMedium, total: Math.round(stats.totalProblems * 0.4) },
                { label: 'Hard',   solved: stats.solvedHard,   total: Math.round(stats.totalProblems * 0.2) },
              ].map(({ label, solved, total }) => {
                const cfg = diffConfig[label]
                return (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-medium ${cfg.color}`}>{label}</span>
                      <span className="text-xs text-gray-500">{solved} solved</span>
                    </div>
                    <ProgressBar value={solved} total={total || 1} color={cfg.bar}/>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Submission Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} className="text-indigo-400"/>
              <h2 className="text-white font-semibold">Submission Stats</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Submissions', value: stats.totalSubmissions,    color: 'text-white'         },
                { label: 'Accepted',          value: stats.acceptedSubmissions, color: 'text-emerald-400'   },
                { label: 'Acceptance Rate',   value: `${acceptanceRate}%`,      color: 'text-indigo-400'    },
                { label: 'Problems Solved',   value: stats.totalSolved,         color: 'text-yellow-400'    },
              ].map(({ label, value, color }) => (
                <div key={label}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-gray-400 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Flame size={16} className="text-orange-400"/>
            <h2 className="text-white font-semibold">Coding Activity</h2>
          </div>
          <ActivityHeatmap activityMap={activityMap} />
        </div>

        {/* Tabs — Solved Problems + Recent Submissions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-800">
            {[
              { id: 'solved',   label: `Solved (${solvedProblems?.length || 0})` },
              { id: 'recent',   label: 'Recent Submissions'                       },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${tab === t.id
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Solved Problems */}
          {tab === 'solved' && (
            <div className="divide-y divide-gray-800">
              {solvedProblems?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No problems solved yet
                </div>
              ) : (
                solvedProblems?.map(problem => {
                  const cfg = diffConfig[problem.difficulty]
                  return (
                    <Link key={problem._id} to={`/problems/${problem.slug}`}
                      className="flex items-center justify-between px-6 py-4
                        hover:bg-gray-800/50 transition group">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0"/>
                        <span className="text-white text-sm group-hover:text-indigo-400 transition">
                          {problem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {problem.tags?.slice(0, 2).map(tag => (
                            <span key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400
                                rounded border border-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                          border ${cfg.bg} ${cfg.color}`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-indigo-400 text-xs">+{problem.xpReward} XP</span>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          )}

          {/* Recent Submissions */}
          {tab === 'recent' && (
            <div className="divide-y divide-gray-800">
              {recentSubmissions?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No submissions yet
                </div>
              ) : (
                recentSubmissions?.map(sub => {
                  const isAccepted = sub.status === 'Accepted'
                  return (
                    <Link key={sub._id} to={`/problems/${sub.problem?.slug}`}
                      className="flex items-center justify-between px-6 py-4
                        hover:bg-gray-800/50 transition group">
                      <div className="flex items-center gap-3">
                        {isAccepted
                          ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0"/>
                          : <Clock size={16} className="text-red-400 flex-shrink-0"/>
                        }
                        <div>
                          <p className="text-white text-sm group-hover:text-indigo-400 transition">
                            {sub.problem?.title}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium
                          ${isAccepted ? 'text-emerald-400' : 'text-red-400'}`}>
                          {sub.status}
                        </span>
                        {sub.xpEarned > 0 && (
                          <span className="text-indigo-400 text-xs">+{sub.xpEarned} XP</span>
                        )}
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}