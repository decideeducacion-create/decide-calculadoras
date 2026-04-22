import { t } from '../theme'

export default function SavedBanner({ fields }) {
  if (!fields || fields.length === 0) return null
  return (
    <div style={{
      background: t.accentDim,
      border: `1px solid ${t.accentBorder}`,
      borderRadius: t.radius,
      padding: '14px 18px',
      marginBottom: '24px',
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '16px', marginTop: '1px', flexShrink: 0 }}>💾</span>
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: t.accent, marginBottom: '4px' }}>
          Datos de calculadoras anteriores cargados automáticamente
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {fields.map((f, i) => (
            <li key={i} style={{ fontSize: '13px', color: t.textMuted, marginBottom: '2px' }}>
              → <span style={{ color: t.text }}>{f.label}:</span>{' '}
              <span style={{ color: t.accent, fontWeight: 600 }}>{f.value}</span>
              {' '}<span style={{ color: t.textDim }}>— podés editarlo si cambió</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
