import { t } from '../theme'

// rowType: 'input' | 'calc' | 'subtotal' | 'result' | 'separator'
export default function CalcTable({ rows }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: t.radiusLg, border: `1px solid ${t.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '540px' }}>
        <thead>
          <tr style={{ background: '#111' }}>
            {['Paso', 'Concepto', 'Cómo se calcula', 'Resultado'].map((h, i) => (
              <th key={i} style={{
                padding: '12px 16px',
                textAlign: i === 3 ? 'right' : 'left',
                fontSize: '10.5px',
                fontWeight: 600,
                color: t.textMuted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderBottom: `1px solid ${t.border}`,
                width: i === 0 ? '52px' : i === 2 ? '38%' : i === 3 ? '160px' : undefined,
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            if (row.type === 'separator') {
              return (
                <tr key={i}>
                  <td colSpan={4} style={{ padding: '6px 16px', borderBottom: `1px solid ${t.border}`, fontSize: '11px', color: t.textDim, background: '#0d0d0d' }}>
                    {row.label || ''}
                  </td>
                </tr>
              )
            }

            const isCalc = row.type === 'calc' || row.type === 'subtotal' || row.type === 'result'
            const isResult = row.type === 'result'
            const isSubtotal = row.type === 'subtotal'

            const bg = isResult
              ? t.bgRowResult
              : isSubtotal
              ? t.bgRowTotal
              : isCalc
              ? '#111'
              : t.bgRow

            const borderStyle = `1px solid ${t.border}`

            return (
              <tr key={i} style={{ background: bg, borderBottom: borderStyle }}>
                {/* STEP */}
                <td style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'middle', borderRight: borderStyle }}>
                  <StepBadge step={row.step} type={row.type} />
                </td>

                {/* CONCEPT */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle', borderRight: borderStyle }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: isCalc ? 600 : 500,
                    color: isResult ? t.accent : t.text,
                    display: 'block',
                    lineHeight: 1.3,
                  }}>{row.concept}</span>
                  {row.note && (
                    <span style={{ fontSize: '12px', color: t.textDim, display: 'block', marginTop: '2px' }}>{row.note}</span>
                  )}
                </td>

                {/* HOW */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle', borderRight: borderStyle }}>
                  <span style={{ fontSize: '13px', color: t.textMuted, lineHeight: 1.45 }}>{row.how}</span>
                </td>

                {/* RESULT */}
                <td style={{ padding: '10px 12px', textAlign: 'right', verticalAlign: 'middle' }}>
                  {row.type === 'input'
                    ? row.input
                    : <CalcResult value={row.value} suffix={row.suffix} type={row.type} negative={row.negative} />
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function StepBadge({ step, type }) {
  const isSymbol = ['+', '-', '=', '÷', '×'].includes(String(step))
  const isResult = type === 'result'
  const isSubtotal = type === 'subtotal'

  if (isResult || isSubtotal) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '26px', height: '26px',
        background: isResult ? t.accentDim : '#222',
        border: `1px solid ${isResult ? t.accentBorder : t.border}`,
        borderRadius: '50%',
        fontSize: isSymbol ? '14px' : '12px',
        fontWeight: 700,
        color: isResult ? t.accent : t.textMuted,
      }}>{step}</span>
    )
  }

  if (isSymbol) {
    return <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 700 }}>{step}</span>
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '26px', height: '26px',
      background: '#1e1e1e',
      border: `1px solid ${t.border}`,
      borderRadius: '50%',
      fontSize: '12px',
      fontWeight: 600,
      color: t.textMuted,
    }}>{step}</span>
  )
}

function CalcResult({ value, suffix, type, negative }) {
  const isResult = type === 'result'
  const isSubtotal = type === 'subtotal'

  if (value === '' || value === null || value === undefined) {
    return <span style={{ color: t.textDim, fontSize: '13px' }}>—</span>
  }

  const color = isResult
    ? (negative === true ? t.danger : negative === false ? t.success : t.accent)
    : isSubtotal
    ? t.text
    : t.textMuted

  return (
    <span style={{
      fontFamily: isResult ? "'Bebas Neue', sans-serif" : 'inherit',
      fontSize: isResult ? '20px' : isSubtotal ? '15px' : '14px',
      fontWeight: isResult ? 400 : 600,
      color,
      letterSpacing: isResult ? '0.5px' : 0,
    }}>
      {value}{suffix ? ` ${suffix}` : ''}
    </span>
  )
}
