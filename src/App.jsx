import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auditoria from './calculadoras/Auditoria'
import RVN       from './calculadoras/RVN'
import Fragilidad from './calculadoras/Fragilidad'
import Libertad  from './calculadoras/Libertad'
import Umbral    from './calculadoras/Umbral'
import Balance   from './calculadoras/Balance'
import { t }     from './theme'

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: t.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      gap: '12px', fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '80px', color: t.accent, lineHeight: 1 }}>404</span>
      <p style={{ color: t.textMuted, fontSize: '15px' }}>Esta calculadora no existe o el link es incorrecto.</p>
      <p style={{ color: t.textDim, fontSize: '13px' }}>Revisá el link en tu ebook.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auditoria"  element={<Auditoria  />} />
        <Route path="/rvn"        element={<RVN        />} />
        <Route path="/fragilidad" element={<Fragilidad />} />
        <Route path="/libertad"   element={<Libertad   />} />
        <Route path="/umbral"     element={<Umbral     />} />
        <Route path="/balance"    element={<Balance    />} />
        <Route path="*"           element={<NotFound   />} />
      </Routes>
    </BrowserRouter>
  )
}
