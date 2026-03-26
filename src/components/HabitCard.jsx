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

  const chartData = dates.map(date => ({
    date: formatDateLabel(date),
    value: data[date] ?? 0,
    rawDate: date,
  }))

  const average = chartData.length
    ? (chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)
    : 0

  const todayValue = data[today] ?? 0

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
            <p className="text-gray-500 text-xs">{habit.section}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-100 font-semibold text-lg">{todayValue}</p>
          <p className="text-gray-500 text-xs">today · avg {average}</p>
        </div>
      </div>

      {/* Chart */}
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

      {isAuthed && (
        <p className="text-gray-600 text-xs mt-2 text-center">Click a bar to edit</p>
      )}
    </div>
  )
}
