const PREFIX = 'decide_'

export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {}
  },
  get(key) {
    try {
      const v = localStorage.getItem(PREFIX + key)
      return v ? JSON.parse(v) : null
    } catch { return null }
  },
  remove(key) {
    try { localStorage.removeItem(PREFIX + key) } catch {}
  }
}

export const KEYS = {
  RVN:        'rvn',
  FRAGILIDAD: 'fragilidad',
  INGRESO:    'ingreso_neto',
}
