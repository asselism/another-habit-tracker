import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { HABITS } from '../habitConfig'
import { getToday } from '../utils'

export default function QuickEntry({ data, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(getToday())

  function handleSave(habitId, value) {
    const val = parseFloat(value)
    if (!isNaN(val) && val >= 0) {
      onUpdate(habitId, date, val)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => { setDate(getToday()); setIsOpen(true) }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-accent-blue rounded-full flex items-center justify-center shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:scale-105 transition-all z-50"
      >
        <Plus size={24} className="text-surface" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-100">Log Habits</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5">
          <label className="text-gray-400 text-sm mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-surface border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 w-full focus:outline-none focus:border-accent-blue"
          />
        </div>

        <div className="space-y-4">
          {HABITS.map(habit => {
            const Icon = habit.icon
            const current = data[habit.id]?.[date] ?? ''
            return (
              <div key={habit.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  <Icon size={16} style={{ color: habit.color }} />
                </div>
                <span className="text-gray-300 text-sm flex-1">{habit.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    defaultValue={current || ''}
                    onBlur={e => handleSave(habit.id, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSave(habit.id, e.target.value)
                        const next = e.target.closest('.space-y-4')?.querySelector(`input[type="number"]:not(:focus)`)
                        next?.focus()
                      }
                    }}
                    className="bg-surface border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 w-20 text-right focus:outline-none focus:border-accent-blue [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-gray-500 text-xs w-12">{habit.unit}</span>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="mt-6 w-full py-2.5 rounded-xl bg-accent-blue/20 text-accent-blue font-medium text-sm hover:bg-accent-blue/30 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
