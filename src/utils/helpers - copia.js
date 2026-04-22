export function fmt(v) {
  if (v === '' || v === null || v === undefined || isNaN(v)) return ''
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v)
}

export function fmtM(v) {
  if (!v && v !== 0) return '—'
  return `$ ${fmt(v)}`
}

export function parse(s) {
  if (!s && s !== 0) return 0
  const clean = String(s).replace(/\./g, '').replace(',', '.')
  const n = parseFloat(clean)
  return isNaN(n) ? 0 : n
}

export function pct(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}
