import { Trophy, CheckCircle2, Clock, Moon } from 'lucide-react'
import { getToday } from '../utils'

function getAprilWeeks() {
  const weeks = []
  let d = new Date(2026, 3, 1) // Apr 1
  let week = []
  while (d.getMonth() === 3) {
    const dateStr = d.toISOString().slice(0, 10)
    const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
    week.push({ date: dateStr, day: dayLabel, num: d.getDate() })
    if (d.getDay() === 0 || d.getDate() === 30) {
      weeks.push(week)
      week = []
    }
    d.setDate(d.getDate() + 1)
  }
  return weeks
}

function SleepWeekTracker({ sleepData }) {
  const today = getToday()
  const weeks = getAprilWeeks()
  const allDays = weeks.flat()
  const hitDays = allDays.filter(d => d.date <= today && (sleepData[d.date] || 0) >= 7).length
  const totalPast = allDays.filter(d => d.date <= today).length

  return (
    <div className="mt-3 space-y-2">
      {weeks.map((week, i) => {
        const hit = week.filter(d => d.date <= today && (sleepData[d.date] || 0) >= 7).length
        const past = week.filter(d => d.date <= today).length
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 w-10 shrink-0">Wk {i + 1}</span>
            <div className="flex gap-1.5">
              {week.map(d => {
                const isFuture = d.date > today
                const val = sleepData[d.date] || 0
                const hit7 = val >= 7
                return (
                  <div key={d.date} className="flex flex-col items-center gap-0.5" title={`${d.day} Apr ${d.num}: ${isFuture ? '—' : val + 'h'}`}>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-medium ${
                        isFuture
                          ? 'border border-gray-700 text-gray-600'
                          : hit7
                            ? 'bg-purple-500/80 text-white'
                            : 'bg-red-500/30 text-red-300'
                      }`}
                    >
                      {d.num}
                    </div>
                  </div>
                )
              })}
            </div>
            {past > 0 && (
              <span className={`text-[10px] ml-1 ${hit === past ? 'text-purple-400' : 'text-gray-500'}`}>
                {hit}/{past}
              </span>
            )}
          </div>
        )
      })}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-800/50">
        <Moon size={12} className="text-purple-400" />
        <span className="text-xs text-gray-400">
          {hitDays}/{totalPast} nights so far
        </span>
        {hitDays === totalPast && totalPast > 0 && (
          <span className="text-[10px] text-purple-400 font-medium">Perfect streak!</span>
        )}
      </div>
    </div>
  )
}

const CHALLENGES = [
  {
    id: 'april-sleep',
    title: 'Sleep 7+ hours every night in April',
    status: 'active',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
  },
  {
    id: 'solidcore-streak',
    title: 'Go to [solidcore] for 14 days in a row',
    status: 'completed',
  },
  {
    id: 'monochrome-fits-streak',
    title: 'Wear a different monochrome fit every day for a week',
    status: 'completed',
    schedule: [
      { date: '2026-04-06', day: 'Mon', color: 'Black', hex: '#000000' },
      { date: '2026-04-07', day: 'Tue', color: 'Maroon', hex: '#800000' },
      { date: '2026-04-08', day: 'Wed', color: 'Red', hex: '#dc2626' },
      { date: '2026-04-09', day: 'Thu', color: 'Denim', hex: '#4a6fa5', denim: true },
      { date: '2026-04-10', day: 'Fri', color: 'Yellow', hex: '#eab308' },
      { date: '2026-04-11', day: 'Sat', color: 'Green', hex: '#4b5320' },
      { date: '2026-04-12', day: 'Sun', color: 'Blue', hex: '#1d4ed8' },
    ],
  },
]

export default function Challenges({ sleepData }) {
  const active = CHALLENGES.filter(c => c.status === 'active')
  const upcoming = CHALLENGES.filter(c => c.status === 'not started')
  const past = CHALLENGES.filter(c => c.status === 'completed')

  return (
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Challenges</h2>
      <div className="space-y-3">
        {active.map(c => (
          <div
            key={c.id}
            className="bg-surface-card rounded-2xl p-5 border border-amber-500/30 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20 shrink-0">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-100 font-semibold text-sm">{c.title}</p>
              <p className="text-amber-400 text-xs mt-0.5">In progress</p>
              {c.id === 'april-sleep' && <SleepWeekTracker sleepData={sleepData} />}
              {c.schedule && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {c.schedule.map(s => {
                    const today = getToday()
                    const isPast = s.date < today
                    const isToday = s.date === today
                    return (
                      <div
                        key={s.date}
                        className={`flex flex-col items-center gap-1 ${isPast ? 'opacity-40' : ''}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full overflow-hidden ${isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-card' : ''}`}
                          style={{
                            backgroundColor: s.hex,
                            ...(s.denim && {
                              backgroundImage: `
                                repeating-linear-gradient(
                                  135deg,
                                  rgba(255,255,255,0.08) 0px,
                                  rgba(255,255,255,0.08) 1px,
                                  transparent 1px,
                                  transparent 3px
                                ),
                                repeating-linear-gradient(
                                  45deg,
                                  rgba(0,0,0,0.1) 0px,
                                  rgba(0,0,0,0.1) 1px,
                                  transparent 1px,
                                  transparent 4px
                                )
                              `,
                            }),
                          }}
                        />
                        <span className="text-[10px] text-gray-400">{s.day}</span>
                        <span className="text-[9px] text-gray-500">{s.color}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {upcoming.map(c => (
          <div
            key={c.id}
            className="bg-surface-card rounded-2xl p-5 border border-blue-500/30 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20">
              <Clock size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-100 font-semibold text-sm">{c.title}</p>
              <p className="text-blue-400 text-xs mt-0.5">Upcoming</p>
            </div>
          </div>
        ))}
        {past.map(c => (
          <div
            key={c.id}
            className="bg-surface-card rounded-2xl p-5 border border-gray-800/50 flex items-center gap-4 opacity-60"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/20">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-100 font-semibold text-sm">{c.title}</p>
              <p className="text-green-400 text-xs mt-0.5">Completed</p>
              {c.schedule && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {c.schedule.map(s => (
                    <div key={s.date} className="flex flex-col items-center gap-1">
                      <div
                        className="w-7 h-7 rounded-full overflow-hidden"
                        style={{
                          backgroundColor: s.hex,
                          ...(s.denim && {
                            backgroundImage: `
                              repeating-linear-gradient(
                                135deg,
                                rgba(255,255,255,0.08) 0px,
                                rgba(255,255,255,0.08) 1px,
                                transparent 1px,
                                transparent 3px
                              ),
                              repeating-linear-gradient(
                                45deg,
                                rgba(0,0,0,0.1) 0px,
                                rgba(0,0,0,0.1) 1px,
                                transparent 1px,
                                transparent 4px
                              )
                            `,
                          }),
                        }}
                      />
                      <span className="text-[10px] text-gray-400">{s.day}</span>
                      <span className="text-[9px] text-gray-500">{s.color}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
