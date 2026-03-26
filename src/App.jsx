import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { HABITS } from './habitConfig'
import { readGist, writeGist } from './gist'
import {
  getWeekDates,
  getMonthDates,
  getWeekLabel,
  getMonthLabel,
  shiftWeek,
  shiftMonth,
} from './utils'
import HabitCard from './components/HabitCard'
import QuickEntry from './components/QuickEntry'
import AuthGate from './components/AuthGate'
import DataManager from './components/DataManager'

const GIST_ID_KEY = 'habit-tracker-gist-id'

function getGistId() {
  // Check URL hash first (for shareable links like #gist=abc123)
  const hash = window.location.hash
  const match = hash.match(/gist=([a-f0-9]+)/)
  if (match) return match[1]
  // Fall back to localStorage
  return localStorage.getItem(GIST_ID_KEY)
}

export default function App() {
  const [data, setData] = useState({})
  const [isAuthed, setIsAuthed] = useState(false)
  const [view, setView] = useState('week')
  const [refDate, setRefDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [hasGist, setHasGist] = useState(!!getGistId())

  const tokenRef = useRef(null)
  const gistIdRef = useRef(getGistId())

  const dates = view === 'week' ? getWeekDates(refDate) : getMonthDates(refDate)
  const label = view === 'week' ? getWeekLabel(dates) : getMonthLabel(refDate)

  // Load data from gist on mount
  useEffect(() => {
    const gistId = gistIdRef.current
    if (!gistId) {
      setLoading(false)
      return
    }
    readGist(gistId)
      .then(setData)
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  // Save to gist (debounced)
  const saveTimeout = useRef(null)
  const saveToGist = useCallback((newData) => {
    const gistId = gistIdRef.current
    const token = tokenRef.current
    if (!gistId || !token) return

    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setSaving(true)
      try {
        await writeGist(gistId, token, newData)
        setError('')
      } catch {
        setError('Failed to save')
      } finally {
        setSaving(false)
      }
    }, 800)
  }, [])

  function updateEntry(habitId, date, value) {
    setData(prev => {
      const next = {
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [date]: value,
        },
      }
      saveToGist(next)
      return next
    })
  }

  function handleImport(imported) {
    setData(prev => {
      const merged = { ...prev }
      for (const [habitId, entries] of Object.entries(imported)) {
        merged[habitId] = { ...merged[habitId], ...entries }
      }
      saveToGist(merged)
      return merged
    })
  }

  function handleAuth(gistId, token) {
    gistIdRef.current = gistId
    tokenRef.current = token
    setHasGist(true)
    // Update URL hash for shareable link
    window.location.hash = `gist=${gistId}`
    // Reload data
    setLoading(true)
    readGist(gistId)
      .then(setData)
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }

  function navigate(direction) {
    setRefDate(prev =>
      view === 'week' ? shiftWeek(prev, direction) : shiftMonth(prev, direction)
    )
  }

  function goToday() {
    setRefDate(new Date())
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-100 tracking-tight">Habits</h1>
              {saving && <Loader2 size={14} className="text-accent-blue animate-spin" />}
              {error && <span className="text-red-400 text-xs">{error}</span>}
            </div>
            <div className="flex items-center gap-3">
              {isAuthed && <DataManager data={data} onImport={handleImport} />}
              <AuthGate isAuthed={isAuthed} setIsAuthed={setIsAuthed} onAuth={handleAuth} />
            </div>
          </div>

          {/* View controls */}
          {hasGist && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 bg-surface-card rounded-lg p-0.5">
                {['week', 'month'].map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      view === v
                        ? 'bg-surface-hover text-gray-100'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goToday}
                  className="text-sm text-gray-300 font-medium hover:text-gray-100 transition-colors min-w-[160px] text-center"
                >
                  {label}
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-accent-blue animate-spin" />
          </div>
        ) : !hasGist ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-lg mb-2">No data source connected</p>
            <p className="text-gray-600 text-sm">Click "Connect GitHub" above to link a Gist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HABITS.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                data={data[habit.id] || {}}
                dates={dates}
                isAuthed={isAuthed}
                onUpdate={updateEntry}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB for quick entry */}
      {isAuthed && <QuickEntry data={data} onUpdate={updateEntry} />}
    </div>
  )
}
