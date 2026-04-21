const LOW = 70
const HIGH = 140

function findColumns(headerParts) {
  let dateIdx = -1
  let valueIdx = -1
  let unit = 'mg/dL'
  for (let i = 0; i < headerParts.length; i++) {
    const h = headerParts[i].trim().toLowerCase()
    if (dateIdx === -1 && (h.startsWith('yyyy-mm-dd') || h === 'date' || h === 'datetime' || h === 'local time')) {
      dateIdx = i
    }
    if (valueIdx === -1) {
      if (h === 'mg/dl') { valueIdx = i; unit = 'mg/dL' }
      else if (h === 'mmol/l') { valueIdx = i; unit = 'mmol/L' }
    }
  }
  return { dateIdx, valueIdx, unit }
}

function extractDate(raw) {
  if (!raw) return null
  const s = raw.trim()
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : null
}

export function parseJugglucoTSV(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (!lines.length) return []

  const firstParts = lines[0].split('\t')
  const firstIsHeader = /[A-Za-z]/.test(firstParts[0]) && !/^\d/.test(firstParts[0])

  let dateIdx = -1
  let valueIdx = -1
  let unit = 'mg/dL'
  let dataStart = 0

  if (firstIsHeader) {
    const cols = findColumns(firstParts)
    dateIdx = cols.dateIdx
    valueIdx = cols.valueIdx
    unit = cols.unit
    dataStart = 1
  }

  if (dateIdx === -1 || valueIdx === -1) {
    const sampleParts = lines[dataStart]?.split('\t') || []
    for (let i = 0; i < sampleParts.length; i++) {
      if (dateIdx === -1 && /^\d{4}-\d{2}-\d{2}/.test(sampleParts[i])) dateIdx = i
    }
    if (valueIdx === -1 && sampleParts.length) {
      valueIdx = sampleParts.length - 1
      while (valueIdx >= 0 && !Number.isFinite(parseFloat(sampleParts[valueIdx]))) valueIdx--
    }
  }

  if (dateIdx === -1 || valueIdx === -1) return { readings: [], skipped: 0, totalLines: lines.length }

  const readings = []
  let skipped = 0
  const skippedSamples = []
  for (let i = dataStart; i < lines.length; i++) {
    const parts = lines[i].split('\t')

    const headerCheck = findColumns(parts)
    if (headerCheck.dateIdx !== -1 && headerCheck.valueIdx !== -1) {
      dateIdx = headerCheck.dateIdx
      valueIdx = headerCheck.valueIdx
      unit = headerCheck.unit
      continue
    }

    const date = extractDate(parts[dateIdx])
    const raw = parseFloat(parts[valueIdx])
    if (!date || !Number.isFinite(raw)) {
      skipped++
      if (skippedSamples.length < 5 && i > dataStart + 100) {
        skippedSamples.push({ lineNum: i + 1, content: lines[i].slice(0, 200) })
      }
      continue
    }
    const value = unit === 'mmol/L' ? raw * 18.0182 : raw
    readings.push({ date, time: parts[dateIdx].trim(), value })
  }

  return { readings, skipped, totalLines: lines.length, skippedSamples, dateIdx, valueIdx }
}

const MIN_READINGS_PER_DAY = 60

export function aggregateByDay(readings, { minReadings = MIN_READINGS_PER_DAY } = {}) {
  const byDay = {}
  for (const r of readings) {
    if (!byDay[r.date]) byDay[r.date] = []
    byDay[r.date].push(r)
  }

  const result = { glucose_avg: {}, glucose_tir: {}, glucose_excursions: {} }
  const sparseDays = []
  for (const [date, rs] of Object.entries(byDay)) {
    if (rs.length < minReadings) {
      sparseDays.push(date)
      continue
    }
    rs.sort((a, b) => a.time.localeCompare(b.time))
    const vals = rs.map(r => r.value)
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length
    const inRange = vals.filter(v => v >= LOW && v <= HIGH).length
    const tir = (inRange / vals.length) * 100

    let excursions = 0
    for (let i = 1; i < vals.length; i++) {
      if (vals[i - 1] <= HIGH && vals[i] > HIGH) excursions++
    }

    result.glucose_avg[date] = +avg.toFixed(0)
    result.glucose_tir[date] = +tir.toFixed(0)
    result.glucose_excursions[date] = excursions
  }
  return { result, sparseDays }
}
