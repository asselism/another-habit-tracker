import { Download, Upload, Activity } from 'lucide-react'
import { parseJugglucoTSV, aggregateByDay } from '../glucose'

export default function DataManager({ data, onImport }) {
  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habits-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result)
        if (typeof imported === 'object' && imported !== null) {
          onImport(imported)
        }
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleCgmImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const { readings } = parseJugglucoTSV(ev.target.result)
      if (!readings.length) {
        alert('No glucose readings found. Expected Juggluco TSV.')
        return
      }
      const { result, sparseDays } = aggregateByDay(readings)
      const dates = Object.keys(result.glucose_avg).sort()
      onImport(result, {
        removeDays: {
          glucose_avg: sparseDays,
          glucose_tir: sparseDays,
          glucose_excursions: sparseDays,
        },
      })
      const sparseNote = sparseDays.length ? ` Skipped ${sparseDays.length} sparse day(s).` : ''
      alert(`Imported ${readings.length} readings across ${dates.length} days (${dates[0]} – ${dates[dates.length - 1]}).${sparseNote}`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card/50 text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors text-sm"
      >
        <Download size={14} />
        Export
      </button>
      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card/50 text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors text-sm cursor-pointer">
        <Upload size={14} />
        Import
        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
      </label>
      <label
        title="Import Juggluco TSV (Libre 3 glucose)"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card/50 text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors text-sm cursor-pointer"
      >
        <Activity size={14} />
        CGM
        <input type="file" accept=".tsv,.txt,.csv,text/*" onChange={handleCgmImport} className="hidden" />
      </label>
    </div>
  )
}
