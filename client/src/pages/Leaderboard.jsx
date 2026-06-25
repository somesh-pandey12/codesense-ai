import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import { Trophy, Zap, Code2, Flame, Medal } from 'lucide-react'

const rankStyle = {
  1: { bg: 'bg-yellow-500',  text: 'text-yellow-900', icon: '🥇' },
  2: { bg: 'bg-gray-400',    text: 'text-gray-900',   icon: '🥈' },
  3: { bg: 'bg-orange-600',  text: 'text-orange-100', icon: '🥉' },
}

export default function Leaderboard() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/leaderboard')
      .then(res => setData(res.data.leaderboard))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const top3  = data.slice(0, 3)
  const rest  = data.slice(3)

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy size={28} className="text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Global Leaderboard</h1>
          </div>
          <p className="text-gray-400">Top developers ranked by XP earned</p>
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-10">
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center
                justify-center text-2xl mb-2 border-4 border-gray-400">
                {top3[1]?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="text-white font-medium text-sm">{top3[1]?.name?.split(' ')[0]}</p>
              <p className="text-gray-400 text-xs">{top3[1]?.xp} XP</p>
              <div className="w-24 bg-gray-400 rounded-t-lg h-16 mt-3 flex items-center
                justify-center text-gray-900 font-bold text-xl">2</div>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center -mt-6">
              <div className="text-3xl mb-1">👑</div>
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center
                justify-center text-2xl mb-2 border-4 border-yellow-300 text-yellow-900 font-bold">
                {top3[0]?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="text-white font-bold">{top3[0]?.name?.split(' ')[0]}</p>
              <p className="text-yellow-400 text-sm font-medium">{top3[0]?.xp} XP</p>
              <div className="w-24 bg-yellow-500 rounded-t-lg h-24 mt-3 flex items-center
                justify-center text-yellow-900 font-bold text-xl">1</div>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-700 rounded-full flex items-center
                justify-center text-2xl mb-2 border-4 border-orange-500 text-orange-100 font-bold">
                {top3[2]?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="text-white font-medium text-sm">{top3[2]?.name?.split(' ')[0]}</p>
              <p className="text-gray-400 text-xs">{top3[2]?.xp} XP</p>
              <div className="w-24 bg-orange-600 rounded-t-lg h-12 mt-3 flex items-center
                justify-center text-orange-100 font-bold text-xl">3</div>
            </div>
          </div>
        )}

        {/* Full Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-800
            text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Developer</div>
            <div className="col-span-2 text-center">XP</div>
            <div className="col-span-2 text-center">Solved</div>
            <div className="col-span-2 text-center">Streak</div>
          </div>

          <div className="divide-y divide-gray-800">
            {data.map(entry => {
              const rs = rankStyle[entry.rank]
              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 px-6 py-4 items-center
                    transition-colors hover:bg-gray-800/50
                    ${entry.isCurrentUser ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''}`}
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    {rs ? (
                      <span className="text-xl">{rs.icon}</span>
                    ) : (
                      <span className="text-gray-400 font-medium">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center
                      font-bold text-sm flex-shrink-0
                      ${entry.isCurrentUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                      }`}>
                      {entry.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-medium text-sm
                        ${entry.isCurrentUser ? 'text-indigo-400' : 'text-white'}`}>
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-xs bg-indigo-900 text-indigo-300
                            px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap size={13} className="text-indigo-400" />
                      <span className="text-white font-medium text-sm">{entry.xp}</span>
                    </div>
                  </div>

                  {/* Solved */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Code2 size={13} className="text-emerald-400" />
                      <span className="text-white text-sm">{entry.solved}</span>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Flame size={13} className="text-orange-400" />
                      <span className="text-white text-sm">{entry.streak}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {data.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No users yet — be the first to solve a problem!
          </div>
        )}

      </div>
    </div>
  )
}