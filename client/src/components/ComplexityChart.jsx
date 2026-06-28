import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const complexityData = {
  'O(1)':      [1,1,1,1,1,1,1,1,1,1],
  'O(log n)':  [1,2,2,3,3,3,4,4,4,4],
  'O(n)':      [1,2,3,4,5,6,7,8,9,10],
  'O(n log n)':[1,2,5,8,11,14,18,22,27,33],
  'O(n²)':     [1,4,9,16,25,36,49,64,81,100],
  'O(2ⁿ)':     [2,4,8,16,32,64,100,100,100,100],
}

const colorMap = {
  'O(1)':       '#10b981',
  'O(log n)':   '#6366f1',
  'O(n)':       '#f59e0b',
  'O(n log n)': '#f97316',
  'O(n²)':      '#ef4444',
  'O(2ⁿ)':      '#dc2626',
}

const labels = ['n=1','n=2','n=3','n=4','n=5','n=6','n=7','n=8','n=9','n=10']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function ComplexityChart({ timeComplexity, spaceComplexity }) {
  const highlights = [timeComplexity, spaceComplexity].filter(Boolean)

  const chartData = labels.map((label, i) => {
    const row = { label }
    Object.entries(complexityData).forEach(([key, vals]) => {
      row[key] = vals[i]
    })
    return row
  })

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Time & Space Complexity Graph
        </p>
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {timeComplexity && (
              <span className="flex items-center gap-1.5 text-xs bg-indigo-950
                border border-indigo-900 text-indigo-300 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"/>
                Time: {timeComplexity}
              </span>
            )}
            {spaceComplexity && (
              <span className="flex items-center gap-1.5 text-xs bg-emerald-950
                border border-emerald-900 text-emerald-300 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                Space: {spaceComplexity}
              </span>
            )}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            {Object.entries(colorMap).map(([key, color]) => (
              <linearGradient key={key} id={`grad-${key.replace(/[^a-z]/gi,'')}`}
                x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false} tickLine={false}/>
          <Tooltip content={<CustomTooltip />}/>
          {Object.entries(complexityData).map(([key, _]) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colorMap[key]}
              strokeWidth={highlights.includes(key.split(' ')[0]) ? 2.5 : 1}
              strokeOpacity={highlights.length === 0 || highlights.some(h => key.includes(h)) ? 1 : 0.2}
              fill={`url(#grad-${key.replace(/[^a-z]/gi,'')})`}
              fillOpacity={highlights.some(h => key.includes(h)) ? 1 : 0.1}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(colorMap).map(([key, color]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full" style={{ background: color }}/>
            {key}
          </span>
        ))}
      </div>
    </div>
  )
}