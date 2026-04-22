import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CalcTable from '../components/CalcTable'
import ResultBox from '../components/ResultBox'
import NoteAlert from '../components/NoteAlert'
import NumInput from '../components/NumInput'
import { fmtM, fmt, parse, pct } from '../utils/helpers'
import { storage, KEYS } from '../utils/storage'

export default function RVN() {
  const [ingreso,    setIngreso]    = useState('')
  const [transporte, setTransporte] = useState('')
  const [comidas,    setComidas]    = useState('')
  const [cuidados,   setCuidados]   = useState('')
  const [otros,      setOtros]      = useState('')
  const [horas,      setHoras]      = useState('')

  const vIngreso    = parse(ingreso)
  const vTransporte = parse(transporte)
  const vComidas    = parse(comidas)
  const vCuidados   = parse(cuidados)
  const vOtros      = parse(otros)
  const vHoras      = parse(horas)

  const totalCostos  = vTransporte + vComidas + vCuidados + vOtros
  const ingresoReal  = vIngreso - totalCostos
  const rvnReal      = vHoras > 0 ? ingresoReal / vHoras : 0

  // Hours estimated for nominal comparison (assuming 8h/day, 22 days)
  const horasNominales = 176
  const rvnNominal = vIngreso > 0 ? vIngreso / horasNominales : 0
  const diferenciaPct = rvnNominal > 0 ? pct(rvnNominal - rvnReal, rvnNominal) : 0

  const hasResult = vIngreso > 0 && vHoras > 0

  // Save to localStorage when result is ready
  useEffect(() => {
    if (hasResult && rvnReal > 0) {
      storage.set(KEYS.RVN, parseFloat(rvnReal.toFixed(2)))
      storage.set(KEYS.INGRESO, vIngreso)
    }
  }, [rvnReal, hasResult, vIngreso])

  const rows = [
    {
      step: 1, type: 'input', concept: 'Ingreso mensual neto',
      how: 'Lo que recibís en mano cada mes, después de todos los descuentos',
      input: <NumInput value={ingreso} onChange={setIngreso} />,
    },
    { type: 'separator', label: 'Costos de trabajar — lo que gastás porque trabajás' },
    {
      step: 2, type: 'input', concept: 'Transporte laboral',
      how: 'Costo de ir y volver al trabajo × días hábiles del mes',
      input: <NumInput value={transporte} onChange={setTransporte} />,
    },
    {
      step: 3, type: 'input', concept: 'Comidas y cafés fuera',
      how: 'Lo que no gastarías si trabajaras desde casa',
      input: <NumInput value={comidas} onChange={setComidas} />,
    },
    {
      step: 4, type: 'input', concept: 'Cuidados y servicios por estar fuera',
      how: 'Hijos, personas dependientes, limpieza o cualquier servicio que tercerizás',
      input: <NumInput value={cuidados} onChange={setCuidados} />,
    },
    {
      step: 5, type: 'input', concept: 'Otros costos de trabajar',
      how: 'Ropa específica para el trabajo, herramientas, otros',
      input: <NumInput value={otros} onChange={setOtros} />,
    },
    {
      step: '+', type: 'subtotal', concept: 'Total costos de trabajar',
      how: 'Suma de los pasos 2 a 5',
      value: totalCostos > 0 ? fmtM(totalCostos) : '',
    },
    { type: 'separator', label: '──' },
    {
      step: '−', type: 'calc', concept: 'Ingreso real mensual',
      how: 'Ingreso neto (paso 1) − Total costos de trabajar',
      value: vIngreso > 0 ? fmtM(ingresoReal) : '',
    },
    {
      step: 6, type: 'input', concept: 'Horas reales por mes',
      how: '(Horas de jornada + traslados por día) × días hábiles del mes',
      note: 'Ejemplo: (9 hs jornada + 1 hs traslado) × 22 días = 220 horas',
      input: <NumInput value={horas} onChange={setHoras} placeholder="0" prefix="hs" />,
    },
    {
      step: '=', type: 'result', concept: 'Mi RVN real',
      how: 'Ingreso real ÷ Horas reales (paso 6)',
      value: hasResult ? `$ ${fmt(rvnReal.toFixed(2))} /hora` : '',
    },
  ]

  return (
    <Layout
      chapter="Capítulo 1"
      title="Rendimiento Vital Neto (RVN)"
      subtitle="Calculá cuánto ganás realmente por hora trabajada, descontando lo que te cuesta trabajar. Este número cambia cómo evaluás todas las decisiones del libro."
    >
      <CalcTable rows={rows} />

      {hasResult && rvnReal > 0 && (
        <>
          <ResultBox
            status="neutral"
            title={`Tu hora de trabajo vale realmente $ ${fmt(rvnReal.toFixed(2))} — no $ ${fmt(rvnNominal.toFixed(2))}.`}
            lines={[
              `Eso es un ${diferenciaPct}% menos de lo que parece cuando mirás el recibo de sueldo.`,
              `Cada vez que evaluás si vale la pena hacer horas extra, el número correcto para comparar con el activo digital no es $ ${fmt(rvnNominal.toFixed(2))} — es $ ${fmt(rvnReal.toFixed(2))}.`,
              'Este número vuelve en la Calculadora 5 cuando calculés cuántas ventas de tu activo equivalen a trabajar horas extra. La comparación cambia completamente cuando usás el número real.',
            ]}
          />

          <NoteAlert
            label="Mi RVN real"
            value={`$ ${fmt(rvnReal.toFixed(2))} /hora`}
            nextChapter="Capítulo 9 (Calculadora: Umbral Mínimo) y Capítulo 12 (Balance de 90 días)"
            tip="Guardamos este número automáticamente. Aparece pre-completado en las próximas calculadoras que lo necesiten."
          />
        </>
      )}
    </Layout>
  )
}
