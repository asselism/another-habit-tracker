import { Trophy, CheckCircle2 } from 'lucide-react'

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
]

export default function Challenges() {
  const active = CHALLENGES.filter(c => c.status === 'active')
  const past = CHALLENGES.filter(c => c.status === 'completed')

  return (
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Challenges</h2>
      <div className="space-y-3">
        {active.map(c => (
          <div
            key={c.id}
            className="bg-surface-card rounded-2xl p-5 border border-amber-500/30 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-100 font-semibold text-sm">{c.title}</p>
              <p className="text-amber-400 text-xs mt-0.5">In progress</p>
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
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
