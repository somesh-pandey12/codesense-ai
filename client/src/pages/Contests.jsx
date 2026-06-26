import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'
import {
  Trophy, Clock, Users, Calendar,
  CheckCircle2, Lock, Play, ChevronRight
} from 'lucide-react'

const statusConfig = {
  live:     { label: 'Live',     bg: 'bg-emerald-950 border-emerald-800', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  upcoming: { label: 'Upcoming', bg: 'bg-indigo-950 border-indigo-800',   dot: 'bg-indigo-400',  text: 'text-indigo-400'  },
  ended:    { label: 'Ended',    bg: 'bg-gray-800 border-gray-700',       dot: 'bg-gray-500',    text: 'text-gray-400'    },
}

function CountdownTimer({ startTime, endTime, status }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const now = Date.now()
      const target = status === 'upcoming'
        ? new Date(startTime).getTime()
        : new Date(endTime).getTime()
      const diff = target - now

      if (diff <= 0) { setTimeLeft('00:00:00'); return }

      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [startTime, endTime, status])

  return <span className="font-mono text-sm">{timeLeft}</span>
}

export default function Contests() {
  const [contests, setContests] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('all')

  useEffect(() => { fetchContests() }, [])

  const fetchContests = async () => {
    try {
      const { data } = await axios.get('/contests')
      setContests(data.contests)
    } catch (err) {
      toast.error('Failed to load contests')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (contestId, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await axios.post(`/contests/${contestId}/register`)
      toast.success('Registered successfully!')
      fetchContests()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  const seedContests = async () => {
    try {
      await axios.get('/contests/seed')
      toast.success('Contests created!')
      fetchContests()
    } catch (err) {
      toast.error('Seed failed')
    }
  }

  const filtered = contests.filter(c =>
    tab === 'all' ? true : c.status === tab
  )

  const live     = contests.filter(c => c.status === 'live').length
  const upcoming = contests.filter(c => c.status === 'upcoming').length
  const ended    = contests.filter(c => c.status === 'ended').length

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy size={28} className="text-yellow-400" />
              Contests
            </h1>
            <p className="text-gray-400 mt-1">Compete with developers worldwide every Sunday</p>
          </div>
          {contests.length === 0 && (
            <button onClick={seedContests}
              className="text-xs bg-gray-800 border border-gray-700 text-gray-400
                hover:text-white px-4 py-2 rounded-lg transition">
              Create sample contests
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Live Now',  value: live,     color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-900' },
            { label: 'Upcoming',  value: upcoming,  color: 'text-indigo-400',  bg: 'bg-indigo-950 border-indigo-900'   },
            { label: 'Completed', value: ended,     color: 'text-gray-400',    bg: 'bg-gray-900 border-gray-800'       },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`border rounded-2xl p-5 ${bg}`}>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 w-fit">
          {[
            { id: 'all',      label: 'All'      },
            { id: 'live',     label: 'Live'     },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'ended',    label: 'Ended'    },
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

        {/* Contest Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No contests found
            </div>
          ) : (
            filtered.map(contest => {
              const sc = statusConfig[contest.status]
              return (
                <Link key={contest._id} to={`/contests/${contest._id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-2xl p-6
                    hover:border-gray-600 transition-all group">

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">

                      {/* Status badge + title */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`flex items-center gap-1.5 text-xs font-medium
                          px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}
                            ${contest.status === 'live' ? 'animate-pulse' : ''}`} />
                          {sc.label}
                        </span>
                        {contest.isRegistered && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400
                            bg-emerald-950 border border-emerald-900 px-2.5 py-1 rounded-full">
                            <CheckCircle2 size={11}/> Registered
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-white group-hover:text-indigo-400
                        transition mb-2">
                        {contest.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {contest.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {contest.duration} min
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={14} />
                          {contest.participantCount} participants
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Trophy size={14} />
                          {contest.problems?.length} problems
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(contest.startTime).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">

                      {/* Timer */}
                      {contest.status !== 'ended' && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">
                            {contest.status === 'live' ? 'Ends in' : 'Starts in'}
                          </p>
                          <div className={`font-mono text-lg font-bold
                            ${contest.status === 'live' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            <CountdownTimer
                              startTime={contest.startTime}
                              endTime={contest.endTime}
                              status={contest.status}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action button */}
                      {contest.status === 'ended' ? (
                        <span className="flex items-center gap-1.5 text-sm text-gray-500
                          bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl">
                          <Lock size={14}/> Ended
                        </span>
                      ) : contest.isRegistered ? (
                        <span className="flex items-center gap-1.5 text-sm text-white
                          bg-indigo-600 px-4 py-2 rounded-xl">
                          <Play size={14}/> Enter
                          <ChevronRight size={14}/>
                        </span>
                      ) : (
                        <button
                          onClick={e => handleRegister(contest._id, e)}
                          className="flex items-center gap-1.5 text-sm text-white
                            bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}