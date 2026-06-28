import { useMemo } from 'react'

const DAYS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getColor(count) {
  if (!count || count === 0) return 'bg-gray-800'
  if (count === 1)           return 'bg-emerald-900'
  if (count <= 3)            return 'bg-emerald-700'
  if (count <= 6)            return 'bg-emerald-500'
  return                            'bg-emerald-400'
}

export default function ActivityHeatmap({ activityMap = {} }) {
  const weeks = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - 364)

    // Start from Sunday
    while (start.getDay() !== 0) {
      start.setDate(start.getDate() - 1)
    }

    const allWeeks = []
    let currentWeek = []
    const cursor = new Date(start)

    while (cursor <= today) {
      const dateStr = cursor.toISOString().split('T')[0]
      currentWeek.push({
        date:  dateStr,
        count: activityMap[dateStr]?.total || 0,
        month: cursor.getMonth(),
        day:   cursor.getDay()
      })

      if (cursor.getDay() === 6) {
        allWeeks.push(currentWeek)
        currentWeek = []
      }
      cursor.setDate(cursor.getDate() + 1)
    }

    if (currentWeek.length) allWeeks.push(currentWeek)
    return allWeeks
  }, [activityMap])

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const firstDay = week[0]
      if (firstDay && firstDay.month !== lastMonth) {
        labels.push({ month: MONTHS[firstDay.month], weekIndex: wi })
        lastMonth = firstDay.month
      }
    })
    return labels
  }, [weeks])

  const totalContributions = Object.values(activityMap)
    .reduce((sum, d) => sum + (d.total || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white font-medium">
          {totalContributions} submissions in the last year
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>Less</span>
          {['bg-gray-800','bg-emerald-900','bg-emerald-700','bg-emerald-500','bg-emerald-400'].map(c => (
            <span key={c} className={`w-3 h-3 rounded-sm ${c}`}/>
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {weeks.map((_, wi) => {
              const label = monthLabels.find(l => l.weekIndex === wi)
              return (
                <div key={wi} className="w-3.5 flex-shrink-0">
                  {label ? (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {label.month}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAYS.map((d, i) => (
                <div key={d} className="h-3.5 flex items-center">
                  {i % 2 === 1 && (
                    <span className="text-xs text-gray-600 w-7 text-right pr-1">{d}</span>
                  )}
                  {i % 2 === 0 && <span className="w-7"/>}
                </div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                    className={`w-3.5 h-3.5 rounded-sm ${getColor(day.count)}
                      cursor-pointer hover:ring-1 hover:ring-white/30 transition-all`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}