import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Users, CheckCircle2, TrendingUp, Code2 } from 'lucide-react'

const LANG_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function ProblemStats({ slug }) {
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!slug || !expanded) return
    axios.get(`/problems/${slug}/stats`)
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug, expanded])

  return (
    <div className="border-t border-gray-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3
          text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition"
      >
        <span className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-400"/>
          Problem Statistics
        </span>
        <span className="text-xs text-gray-500">
          {expanded ? '▲ Hide' : '▼ Show'}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : stats ? (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: <CheckCircle2 size={14} className="text-emerald-400"/>,
                    label: 'Acceptance Rate',
                    value: `${stats.acceptanceRate?.toFixed(1)}%`,
                    color: stats.acceptanceRate > 50 ? 'text-emerald-400' :
                           stats.acceptanceRate > 35 ? 'text-yellow-400' : 'text-red-400'
                  },
                  {
                    icon: <Users size={14} className="text-indigo-400"/>,
                    label: 'Total Solved',
                    value: stats.solvedBy || 0,
                    color: 'text-white'
                  },
                  {
                    icon: <TrendingUp size={14} className="text-yellow-400"/>,
                    label: 'Submissions',
                    value: stats.totalSubmissions || 0,
                    color: 'text-white'
                  },
                  {
                    icon: <Code2 size={14} className="text-purple-400"/>,
                    label: 'Total Users',
                    value: stats.totalUsers || 0,
                    color: 'text-white'
                  },
                ].map(({ icon, label, value, color }) => (
                  <div key={label}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      {icon}
                      <span className="text-xs text-gray-400">{label}</span>
                    </div>
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Activity Chart */}
              {stats.activityData?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Last 7 Days Activity
                  </p>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={stats.activityData} barGap={2}>
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="submissions"
                        name="Submissions"
                        fill="#6366f1"
                        radius={[3,3,0,0]}
                        maxBarSize={24}
                      />
                      <Bar
                        dataKey="accepted"
                        name="Accepted"
                        fill="#10b981"
                        radius={[3,3,0,0]}
                        maxBarSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="w-2 h-2 rounded-sm bg-indigo-500"/>
                      Submissions
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="w-2 h-2 rounded-sm bg-emerald-500"/>
                      Accepted
                    </span>
                  </div>
                </div>
              )}

              {/* Language Distribution */}
              {stats.languageData?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Language Distribution
                  </p>
                  <div className="flex items-center gap-4">
                    <PieChart width={80} height={80}>
                      <Pie
                        data={stats.languageData}
                        cx={35} cy={35}
                        innerRadius={20}
                        outerRadius={35}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {stats.languageData.map((_, i) => (
                          <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]}/>
                        ))}
                      </Pie>
                    </PieChart>
                    <div className="space-y-1.5">
                      {stats.languageData.map((lang, i) => (
                        <div key={lang.name} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}/>
                          <span className="text-xs text-gray-300 capitalize">{lang.name}</span>
                          <span className="text-xs text-gray-500">{lang.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">
              No stats available yet
            </p>
          )}
        </div>
      )}
    </div>
  )
}