import { t } from '../theme'

export default function ResultBox({ status, title, lines, semaforo }) {
  const statusColor = {
    green:   t.success,
    yellow:  t.warning,
    red:     t.danger,
    neutral: t.accent,
  }[status || 'neutral']

  const statusBg = {
    green:   t.successDim,
    yellow:  t.warningDim,
    red:     t.dangerDim,
    neutral: t.accentDim,
  }[status || 'neutral']

  return (
    <div style={{
      marginTop: '24px',
      border: `1px solid ${statusColor}30`,
      background: statusBg,
      borderRadius: t.radiusLg,
      padding: '20px 22px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: statusColor, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
        📊 Qué significa este resultado
      </p>
      {title && (
        <p style={{ fontSize: '16px', fontWeight: 600, color: t.text, marginBottom: '10px' }}>{title}</p>
      )}
      {lines && lines.map((l, i) => (
        <p key={i} style={{ fontSize: '14px', color: t.textMuted, lineHeight: 1.65, marginBottom: '6px' }}>{l}</p>
      ))}
      {semaforo && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          {semaforo.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(0,0,0,0.25)',
              border: `1px solid ${t.border}`,
              borderRadius: t.radius,
              padding: '6px 12px',
              fontSize: '12.5px',
              color: t.textMuted,
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
