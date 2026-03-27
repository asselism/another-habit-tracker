import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDateLabel, getToday } from '../utils'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-card border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="text-gray-400">{label}</p>
      <p className="text-gray-100 font-medium">{payload[0].value}</p>
    </div>
  )
}

export default function HabitCard({ habit, data, dates, isAuthed, onUpdate }) {
  const Icon = habit.icon
  const today = getToday()
  const isCheck = habit.type === 'check'

  const chartData = dates.map(date => ({
    date: formatDateLabel(date),
    value: data[date] ?? 0,
    rawDate: date,
  }))

  const nonEmpty = chartData.filter(d => d.value > 0)
  const total = nonEmpty.reduce((sum, d) => sum + d.value, 0)
  const average = nonEmpty.length ? (total / nonEmpty.length).toFixed(1) : 0

  function handleBarClick(barData) {
    if (!isAuthed) return
    const dateStr = barData.rawDate
    const current = data[dateStr] ?? 0
    const input = prompt(`${habit.name} for ${barData.date}\nCurrent: ${current} ${habit.unit}\nEnter new value:`, current)
    if (input === null) return
    const val = parseFloat(input)
    if (!isNaN(val) && val >= 0) {
      onUpdate(habit.id, dateStr, val)
    }
  }

  function handleDotClick(entry) {
    if (!isAuthed) return
    const current = data[entry.rawDate] ?? 0
    onUpdate(habit.id, entry.rawDate, current > 0 ? 0 : 1)
  }

  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <Icon size={20} style={{ color: habit.color }} />
          </div>
          <div>
            <h3 className="text-gray-100 font-semibold text-sm">{habit.name}</h3>
            <p className="text-gray-500 text-xs">{habit.unit}</p>
            {habit.subtitle && <p className="text-gray-600 text-xs italic">{habit.subtitle}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-100 font-semibold text-lg">{isCheck ? total : average}</p>
          <p className="text-gray-500 text-xs">{isCheck ? `total ${habit.unit}` : `avg ${habit.unit}`}</p>
        </div>
      </div>

      {/* Chart or Dots */}
      {isCheck ? (
        <div className="h-36 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center">
            {chartData.map((entry) => (
              <button
                key={entry.rawDate}
                onClick={() => handleDotClick(entry)}
                disabled={!isAuthed}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-8 h-8 rounded-full border-2 transition-colors flex items-center justify-center"
                  style={{
                    borderColor: habit.color,
                    backgroundColor: entry.value > 0 ? habit.color : 'transparent',
                  }}
                >
                  {entry.value > 0 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-500 text-[10px]">{entry.date}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                interval={dates.length > 10 ? Math.floor(dates.length / 7) : 0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="value"
                fill={habit.color}
                radius={[4, 4, 0, 0]}
                opacity={0.8}
                cursor={isAuthed ? 'pointer' : 'default'}
                onClick={(_, index) => handleBarClick(chartData[index])}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {isAuthed && (
        <p className="text-gray-600 text-xs mt-2 text-center">
          {isCheck ? 'Click to toggle' : 'Click a bar to edit'}
        </p>
      )}
    </div>
  )
}
