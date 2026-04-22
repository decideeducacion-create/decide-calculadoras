import { useState } from 'react'
import Layout from '../components/Layout'
import CalcTable from '../components/CalcTable'
import ResultBox from '../components/ResultBox'
import NoteAlert from '../components/NoteAlert'
import NumInput from '../components/NumInput'
import { fmtM, fmt, parse } from '../utils/helpers'

export default function Libertad() {
  const [ingreso,  setIngreso]  = useState('')
  const [objetivo, setObjetivo] = useState('')

  const vIngreso  = parse(ingreso)
  const vObjetivo = parse(objetivo)

  const veinte   = vIngreso * 0.20
  const cuarenta = vIngreso * 0.40

  // Use user-defined target or default to 30%
  const meta = vObjetivo > 0 ? vObjetivo : vIngreso * 0.30

  const ventasUSD = meta > 0 ? Math.ceil(meta / 12) : 0
  const hasResult = vIngreso > 0

  const rows = [
    {
      step: 1, type: 'input', concept: 'Ingreso mensual actual',
      how: 'Lo que recibís en mano por mes (tu sueldo o ingreso principal)',
      input: <NumInput value={ingreso} onChange={setIngreso} />,
    },
    { type: 'separator', label: 'Rangos de referencia para definir tu objetivo' },
    {
      step: '·', type: 'calc', concept: '20% del ingreso actual',
      how: 'El piso mínimo que ya cambia la conversación con el trabajo',
      value: vIngreso > 0 ? fmtM(veinte) : '',
    },
    {
      step: '·', type: 'calc', concept: '40% del ingreso actual',
      how: 'El techo que la mayoría elige como punto de inflexión real',
      value: vIngreso > 0 ? fmtM(cuarenta) : '',
    },
    { type: 'separator', label: 'Tu objetivo personal' },
    {
      step: 2, type: 'input', concept: 'Mi Número de Libertad',
      how: 'El monto mensual fuera del empleo que cambiaría fundamentalmente tu relación con el trabajo. Usá el rango de arriba como referencia.',
      note: 'Si lo dejás en 0, usamos el 30% de tu ingreso como referencia',
      input: <NumInput value={objetivo} onChange={setObjetivo} />,
    },
    {
      step: '=', type: 'result', concept: 'Ventas mensuales necesarias (a $ 12 USD)',
      how: 'Número de Libertad ÷ $ 12 USD por venta — redondeado hacia arriba',
      value: hasResult && meta > 0 ? `${ventasUSD} ventas/mes` : '',
    },
  ]

  return (
    <Layout
      chapter="Capítulo 3"
      title="Mi Número de Libertad"
      subtitle="¿Cuánto ingreso mensual fuera del empleo cambiaría fundamentalmente tu nivel de estrés financiero? No cuánto necesitás para dejar de trabajar — cuánto necesitás para elegir quedarte."
    >
      <CalcTable rows={rows} />

      {hasResult && meta > 0 && (
        <>
          <ResultBox
            status="neutral"
            title={`Tu Número de Libertad es ${fmtM(meta)} por mes.`}
            lines={[
              `Eso equivale a ${ventasUSD} ventas mensuales de tu activo a $ 12 USD.`,
              ventasUSD <= 10
                ? `${ventasUSD} ventas mensuales es un objetivo alcanzable en el Nivel 1 del sistema. El mapa de 90 días del Capítulo 12 está diseñado para llegar ahí.`
                : ventasUSD <= 30
                ? `${ventasUSD} ventas mensuales es el objetivo del Nivel 2 — el ecosistema que construís entre los meses 4 y 9. El Nivel 1 sienta las bases.`
                : `${ventasUSD} ventas mensuales corresponde al Nivel 3. Es alcanzable — requiere el ecosistema completo (dos activos + lista de emails + segundo canal). El sistema de 18 meses del Capítulo 14 muestra el camino.`,
              'La primera venta no te da el Número de Libertad. Te demuestra que el sistema funciona. El resto es consistencia y escala.',
            ]}
          />

          <NoteAlert
            label="Mi Número de Libertad"
            value={`${fmtM(meta)} / mes — ${ventasUSD} ventas a $ 12 USD`}
            tip="Anotá este número en un lugar visible mientras ejecutás el sistema. Es la brújula, no el límite."
          />
        </>
      )}
    </Layout>
  )
}
