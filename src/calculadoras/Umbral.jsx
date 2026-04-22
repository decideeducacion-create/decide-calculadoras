import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CalcTable from '../components/CalcTable'
import ResultBox from '../components/ResultBox'
import NoteAlert from '../components/NoteAlert'
import SavedBanner from '../components/SavedBanner'
import NumInput from '../components/NumInput'
import { fmtM, fmt, parse } from '../utils/helpers'
import { storage, KEYS } from '../utils/storage'

export default function Umbral() {
  const [rvn, setRvn] = useState('')
  const [savedRvn, setSavedRvn] = useState(null)

  useEffect(() => {
    const stored = storage.get(KEYS.RVN)
    if (stored) {
      setSavedRvn(stored)
      setRvn(String(stored))
    }
  }, [])

  const vRvn       = parse(rvn)
  const valor10hs  = vRvn * 10
  const ventas12   = valor10hs > 0 ? Math.ceil(valor10hs / 12) : 0
  const hasResult  = vRvn > 0

  const rows = [
    {
      step: 1, type: 'input', concept: 'Mi RVN real ($ /hora)',
      how: 'Tu Rendimiento Vital Neto calculado en el Capítulo 1 — cuánto ganás realmente por hora de trabajo',
      note: savedRvn ? '↑ Pre-completado con tu resultado del Capítulo 1' : 'Completá este dato desde la Calculadora del Capítulo 1',
      input: <NumInput value={rvn} onChange={setRvn} placeholder={savedRvn ? String(savedRvn) : '0'} prefix="$" />,
    },
    {
      step: '×', type: 'calc', concept: 'Valor de 10 horas de trabajo',
      how: 'RVN real × 10 horas — el costo real de una jornada y media de trabajo',
      value: hasResult ? fmtM(valor10hs) : '',
    },
    { type: 'separator', label: '──' },
    {
      step: '=', type: 'result', concept: 'Ventas mínimas del activo para igualar esas 10 horas',
      how: 'Valor de 10 horas ÷ $ 12 USD por venta (tipo de cambio del momento) — redondeado hacia arriba',
      value: hasResult ? `${ventas12} ventas/mes` : '',
    },
  ]

  const savedFields = savedRvn
    ? [{ label: 'RVN (Capítulo 1)', value: `$ ${fmt(savedRvn)} /hora` }]
    : []

  return (
    <Layout
      chapter="Capítulo 9"
      title="Umbral Mínimo del Activo"
      subtitle="¿Cuántas ventas de tu activo equivalen a hacer horas extra? La comparación cambia completamente cuando usás el número real de lo que vale tu hora de trabajo."
    >
      {savedFields.length > 0 && <SavedBanner fields={savedFields} />}

      <CalcTable rows={rows} />

      {hasResult && (
        <>
          <ResultBox
            status="neutral"
            title={`Con solo ${ventas12} ventas mensuales, el activo iguala el valor real de 10 horas extra de trabajo.`}
            lines={[
              `Trabajar 10 horas extra tiene un costo real de ${fmtM(valor10hs)} (a tu RVN de $ ${fmt(vRvn.toFixed(2))}/hora).`,
              `Tu activo necesita ${ventas12} venta${ventas12 !== 1 ? 's' : ''} al mes para generar lo mismo — y esas ventas ocurren mientras dormís, mientras trabajás, mientras hacés cualquier otra cosa.`,
              `Eso no es motivación. Es la comparación racional de dos modelos con estructuras de riesgo distintas: el trabajo extra para cuando vos parás; el activo no.`,
              ventas12 <= 5
                ? `${ventas12} ventas/mes es un objetivo que el sistema de los 20 contactos del Capítulo 10 puede lograr en la primera semana de lanzamiento.`
                : ventas12 <= 15
                ? `${ventas12} ventas/mes es el objetivo del primer trimestre. El sistema de 90 días del Capítulo 12 está diseñado para llegar ahí con consistencia.`
                : `${ventas12} ventas/mes requiere el ecosistema del Nivel 2. Es alcanzable — el camino está en el Capítulo 14.`,
            ]}
          />

          <NoteAlert
            label="Umbral mínimo"
            value={`${ventas12} ventas/mes para igualar 10 hs de trabajo`}
            tip="Este es tu número de referencia para evaluar si el esfuerzo de construir el activo vale la comparación con las horas extra. La respuesta matemática es sí."
          />
        </>
      )}
    </Layout>
  )
}
