function toLocalDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getToday() {
  return toLocalDateStr(new Date())
}

export function getWeekDates(referenceDate = new Date()) {
  const d = new Date(referenceDate)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((day + 6) % 7))

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return toLocalDateStr(date)
  })
}

export function getMonthDates(referenceDate = new Date()) {
  const d = new Date(referenceDate)
  const year = d.getFullYear()
  const month = d.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1)
    return toLocalDateStr(date)
  })
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getWeekLabel(dates) {
  const start = new Date(dates[0] + 'T00:00:00')
  const end = new Date(dates[6] + 'T00:00:00')
  const opts = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}

export function getMonthLabel(referenceDate) {
  return referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function shiftWeek(referenceDate, direction) {
  const d = new Date(referenceDate)
  d.setDate(d.getDate() + direction * 7)
  return d
}

export function shiftMonth(referenceDate, direction) {
  const d = new Date(referenceDate)
  d.setMonth(d.getMonth() + direction)
  return d
}
