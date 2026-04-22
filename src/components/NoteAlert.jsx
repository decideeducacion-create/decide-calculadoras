import { useState } from 'react'
import { t } from '../theme'

export default function NoteAlert({ label, value, nextChapter, tip }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(String(value)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (!value && value !== 0) return null

  return (
    <div style={{
      background: t.accentDim,
      border: `1.5px solid ${t.accentBorder}`,
      borderRadius: t.radiusLg,
      padding: '20px 22px',
      marginTop: '32px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
        📌 Anotá este resultado
      </p>
      <p style={{ fontSize: '15px', color: t.text, marginBottom: '6px' }}>
        <span style={{ color: t.textMuted }}>{label}:</span>{' '}
        <span style={{ color: t.accent, fontSize: '20px', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
          {value}
        </span>
      </p>
      {nextChapter && (
        <p style={{ fontSize: '13px', color: t.textMuted, marginBottom: '14px' }}>
          Lo vas a necesitar en el <strong style={{ color: t.text }}>{nextChapter}</strong>.
          En esa calculadora aparece pre-completado si usás el mismo dispositivo.
        </p>
      )}
      {tip && (
        <p style={{ fontSize: '13px', color: t.textMuted, fontStyle: 'italic', marginBottom: '14px' }}>
          {tip}
        </p>
      )}
      <button
        onClick={copy}
        style={{
          background: copied ? t.accentDim : 'transparent',
          border: `1px solid ${t.accentBorder}`,
          borderRadius: t.radius,
          color: copied ? t.accent : t.textMuted,
          fontSize: '13px',
          padding: '8px 16px',
          transition: 'all 0.15s',
          fontWeight: copied ? 600 : 400,
        }}
      >
        {copied ? '✓ Copiado al portapapeles' : 'Copiar al portapapeles'}
      </button>
    </div>
  )
}
