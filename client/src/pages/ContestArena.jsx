import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'
import {
  Trophy, Clock, CheckCircle2, Circle,
  Users, ChevronRight, Medal
} from 'lucide-react'

function LiveTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('ENDED'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setIsUrgent(diff < 300000) // last 5 minutes
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [endTime])

  return (
    <span className={`font-mono text-2xl font-bold ${isUrgent ? 'text-red-400 animate-pulse' : 'text-white'}`}>
      {timeLeft}
    </span>
  )
}

export default function ContestArena() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [contest,     setContest]     = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [tab,         setTab]         = useState('problems')
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    fetchContest()
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    if (tab === 'leaderboard') fetchLeaderboard()
  }, [tab])

  const fetchContest = async () => {
    try {
      const { data } = await axios.get(`/contests/${id}`)
      setContest(data.contest)
      if (!data.isRegistered && data.contest.status !== 'ended') {
        toast.error('Please register first')
        navigate('/contests')
      }
    } catch {
      navigate('/contests')
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(`/contests/${id}/leaderboard`)
      setLeaderboard(data.leaderboard)
    } catch {}
  }

  const diffColor = {
    Easy: 'text-emerald-400', Medium: 'text-yellow-400', Hard: 'text-red-400'
  }

  const pointsColor = (pts) => {
    if (pts >= 300) return 'text-red-400'
    if (pts >= 200) return 'text-yellow-400'
    return 'text-emerald-400'
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!contest) return null

  const myParticipant = contest.participants?.find(
    p => p.user === contest.currentUser
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Contest Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {contest.status === 'live' && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400
                    bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                    Live
                  </span>
                )}
                {contest.status === 'ended' && (
                  <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700
                    px-2.5 py-1 rounded-full">Ended</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white">{contest.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Users size={14}/> {contest.participants?.length} participants
                </span>
                <span className="flex items-center gap-1">
                  <Trophy size={14}/> {contest.problems?.length} problems
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14}/> {contest.duration} min
                </span>
              </div>
            </div>

            {/* Timer */}
            {contest.status === 'live' && (
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Time remaining</p>
                <LiveTimer endTime={contest.endTime} />
              </div>
            )}
            {contest.status === 'ended' && (
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Contest ended</p>
                <p className="text-gray-400 text-sm">
                  {new Date(contest.endTime).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Tabs */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 w-fit">
          {[
            { id: 'problems',     label: 'Problems'    },
            { id: 'leaderboard',  label: 'Leaderboard' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === t.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Problems Tab */}
        {tab === 'problems' && (
          <div className="space-y-3">
            {contest.problems?.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                Problems will be visible when contest starts
              </div>
            ) : (
              contest.problems?.map((item, idx) => {
                const problem = item.problem
                if (!problem) return null

                return (
                  <Link
                    key={problem._id}
                    to={`/problems/${problem.slug}`}
                    className="flex items-center justify-between bg-gray-900
                      border border-gray-800 hover:border-gray-600 rounded-2xl p-5
                      transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center
                        justify-center text-gray-400 font-bold border border-gray-700">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div>
                        <p className="text-white font-medium group-hover:text-indigo-400 transition">
                          {problem.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs font-medium ${diffColor[problem.difficulty]}`}>
                            {problem.difficulty}
                          </span>
                          {problem.tags?.slice(0, 2).map(tag => (
                            <span key={tag}
                              className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${pointsColor(item.points)}`}>
                          {item.points}
                        </p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-600 group-hover:text-gray-400" />
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {tab === 'leaderboard' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-800
              text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-7">Participant</div>
              <div className="col-span-2 text-center">Solved</div>
              <div className="col-span-2 text-right">Score</div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No submissions yet — be the first!
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {leaderboard.map(entry => (
                  <div key={entry.user?._id}
                    className={`grid grid-cols-12 px-6 py-4 items-center
                      ${entry.isCurrentUser ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : 'hover:bg-gray-800/30'}`}>
                    <div className="col-span-1">
                      {entry.rank === 1 ? '🥇' :
                       entry.rank === 2 ? '🥈' :
                       entry.rank === 3 ? '🥉' :
                       <span className="text-gray-400 font-medium">#{entry.rank}</span>}
                    </div>
                    <div className="col-span-7 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                        text-sm font-bold ${entry.isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                        {entry.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className={`text-sm font-medium
                        ${entry.isCurrentUser ? 'text-indigo-400' : 'text-white'}`}>
                        {entry.user?.name}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-xs bg-indigo-900 text-indigo-300
                            px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="flex items-center justify-center gap-1 text-sm text-white">
                        <CheckCircle2 size={13} className="text-emerald-400"/>
                        {entry.solved}
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-yellow-400 font-bold">{entry.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}