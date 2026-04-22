import { t } from '../theme'

export default function Layout({ chapter, title, subtitle, children }) {
  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <header style={{
        borderBottom: `1px solid ${t.border}`,
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        position: 'sticky',
        top: 0,
        background: t.bg,
        zIndex: 100,
      }}>
        {/* Logo wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '22px',
            color: t.accent,
            letterSpacing: '-0.5px',
          }}>decide.</span>
          <span style={{ fontSize: '11px', color: t.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>digital</span>
        </div>
        <div style={{ width: '1px', height: '20px', background: t.border }} />
        <span style={{ fontSize: '12px', color: t.textMuted, letterSpacing: '0.06em' }}>El Mapa del Dinero</span>
      </header>

      {/* ── HERO ── */}
      <div style={{
        padding: '40px 24px 32px',
        maxWidth: '760px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          fontSize: '11px',
          color: t.accent,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>{chapter}</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(32px, 6vw, 52px)',
          color: t.text,
          letterSpacing: '1px',
          lineHeight: 1.1,
          marginBottom: '14px',
        }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.65, maxWidth: '600px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* ── CONTENT ── */}
      <main style={{
        flex: 1,
        maxWidth: '760px',
        margin: '0 auto',
        width: '100%',
        padding: '0 24px 60px',
      }}>
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${t.border}`,
        padding: '18px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: t.textDim,
      }}>
        <span style={{ color: t.accent }}>decide.</span>digital · El Mapa del Dinero
      </footer>

    </div>
  )
}
