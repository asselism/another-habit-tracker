import { Download, Upload } from 'lucide-react'

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
    </div>
  )
}
