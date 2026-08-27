import { useRef, useCallback } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDateLabel, getToday } from '../utils'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload
  return (
    <div className="bg-surface-card border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-lg max-w-xs">
      <p className="text-gray-400">{label}</p>
      <p className="text-gray-100 font-medium">{entry.value}</p>
      {entry.note && <p className="text-gray-400 text-xs italic mt-1 whitespace-pre-wrap">{entry.note}</p>}
    </div>
  )
}

export default function HabitCard({ habit, data, notes = {}, dates, isAuthed, onUpdate, onUpdateNote }) {
  const Icon = habit.icon
  const today = getToday()
  const factor = habit.displayFactor || 1
  const dUnit = habit.displayUnit || habit.unit

  const isGlucose = habit.id.startsWith('glucose_')
  const chartData = dates.map(date => {
    const rawData = data[date]
    const hasData = rawData !== undefined && rawData !== null
    const value = hasData ? +(rawData * factor).toFixed(2) : 0
    return {
      date: formatDateLabel(date),
      value,
      barValue: value || 0.15,
      rawDate: date,
      rawValue: rawData ?? 0,
      hasData,
      note: notes[date] || null,
    }
  })

  const isSum = habit.aggregate === 'sum'
  const elapsed = chartData.filter(d => d.rawDate <= today)
  const stat = isSum
    ? elapsed.reduce((sum, d) => sum + d.value, 0)
    : elapsed.length ? (elapsed.reduce((sum, d) => sum + d.value, 0) / elapsed.length).toFixed(1) : 0

  const longPressTimer = useRef(null)
  const longPressed = useRef(false)

  function handleBarClick(barData) {
    if (!isAuthed || longPressed.current) return
    if (isSum) {
      const dateStr = barData.rawDate
      const current = data[dateStr] ?? 0
      onUpdate(habit.id, dateStr, current + 1)
    } else {
      handleBarEdit(barData)
    }
  }

  function handleBarEdit(barData) {
    if (!isAuthed) return
    const dateStr = barData.rawDate
    const current = data[dateStr] ?? 0
    const input = prompt(`${habit.name} for ${barData.date}\nCurrent: ${current} ${habit.unit}\nEnter new value (${habit.unit}):`, current)
    if (input === null) return
    const val = parseFloat(input)
    if (!isNaN(val) && val >= 0) {
      onUpdate(habit.id, dateStr, val)
    }
    if (!isGlucose && onUpdateNote) {
      const currentNote = notes[dateStr] || ''
      const noteInput = prompt(`Optional note for ${barData.date} (leave blank to clear):`, currentNote)
      if (noteInput !== null) {
        onUpdateNote(habit.id, dateStr, noteInput.trim())
      }
    }
  }

  const handleMouseDown = useCallback((_, index) => {
    longPressed.current = false
    longPressTimer.current = setTimeout(() => {
      longPressed.current = true
      handleBarEdit(chartData[index])
    }, 500)
  }, [chartData, data, isAuthed])

  const handleMouseUp = useCallback(() => {
    clearTimeout(longPressTimer.current)
  }, [])

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
            <p className="text-gray-500 text-xs">{dUnit}</p>
            {habit.subtitle && <p className="text-gray-600 text-xs italic">{habit.subtitle}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-100 font-semibold text-lg">{stat}</p>
          <p className="text-gray-500 text-xs">{isSum ? 'total' : 'avg'} {dUnit}</p>
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
              dataKey="barValue"
              radius={[4, 4, 0, 0]}
              cursor={isAuthed ? 'pointer' : 'default'}
              onClick={(_, index) => handleBarClick(chartData[index])}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.rawDate}
                  fill={habit.color}
                  opacity={entry.value > 0 ? 0.8 : 0.2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isAuthed && (
        <p className="text-gray-600 text-xs mt-2 text-center">{isSum ? 'Tap +1 · Long press to edit' : 'Tap to edit'}</p>
      )}
    </div>
  )
}
