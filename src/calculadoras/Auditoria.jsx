import { useState } from 'react'
import Layout from '../components/Layout'
import CalcTable from '../components/CalcTable'
import ResultBox from '../components/ResultBox'
import NoteAlert from '../components/NoteAlert'
import NumInput from '../components/NumInput'
import { fmtM, parse, pct } from '../utils/helpers'

export default function Auditoria() {
  const [fijos,          setFijos]          = useState('')
  const [variables,      setVariables]      = useState('')
  const [discrecionales, setDiscrecionales] = useState('')
  const [fugas,          setFugas]          = useState('')
  const [ingreso,        setIngreso]        = useState('')

  const vFijos   = parse(fijos)
  const vVars    = parse(variables)
  const vDisc    = parse(discrecionales)
  const vFugas   = parse(fugas)
  const vIngreso = parse(ingreso)

  const sumaParcial = vFijos + vVars + vDisc + vFugas
  const diferencia  = vIngreso - sumaParcial
  const hasResult   = vIngreso > 0 && sumaParcial > 0

  const porcentajeUsado = pct(sumaParcial, vIngreso)
  const status = diferencia > 0 ? 'green' : diferencia === 0 ? 'yellow' : 'red'

  const fijosYFugas = vFijos + vFugas
  const pctFijosYFugas = pct(fijosYFugas, vIngreso)

  const rows = [
    {
      step: 1, type: 'input', concept: 'Compromisos fijos',
      how: 'Alquiler + expensas + servicios + cuotas fijas — existen aunque no trabajes',
      input: <NumInput value={fijos} onChange={setFijos} />,
    },
    {
      step: 2, type: 'input', concept: 'Gastos variables recurrentes',
      how: 'Supermercado + transporte + salidas habituales',
      input: <NumInput value={variables} onChange={setVariables} />,
    },
    {
      step: 3, type: 'input', concept: 'Gastos discrecionales',
      how: 'Ropa + entretenimiento + servicios opcionales — son elecciones',
      input: <NumInput value={discrecionales} onChange={setDiscrecionales} />,
    },
    {
      step: 4, type: 'input', concept: 'Fugas invisibles (estimación)',
      how: 'Suscripciones + intereses de tarjeta + servicios sin revisar',
      input: <NumInput value={fugas} onChange={setFugas} />,
    },
    {
      step: '+', type: 'subtotal', concept: 'Suma parcial (pasos 1 a 4)',
      how: 'Suma los cuatro resultados anteriores',
      value: sumaParcial > 0 ? fmtM(sumaParcial) : '',
    },
    { type: 'separator', label: '──' },
    {
      step: 5, type: 'input', concept: 'Ingreso mensual neto',
      how: 'Lo que recibís en mano este mes (después de impuestos y descuentos)',
      input: <NumInput value={ingreso} onChange={setIngreso} />,
    },
    {
      step: '=', type: 'result', concept: 'Diferencia — lo que realmente queda',
      how: 'Paso 5 − Suma parcial',
      value: hasResult ? fmtM(diferencia) : '',
      negative: hasResult ? diferencia < 0 : undefined,
    },
  ]

  return (
    <Layout
      chapter="Capítulo 1"
      title="Auditoría de Flujo Real"
      subtitle="Completá cada celda con tus montos reales. Seguí el orden de los pasos. Al final sabés cuánto dinero realmente te queda cada mes."
    >
      <CalcTable rows={rows} />

      {hasResult && (
        <>
          <ResultBox
            status={status}
            title={
              diferencia > 0
                ? `Quedan ${fmtM(diferencia)} por mes después de todos tus gastos.`
                : diferencia === 0
                ? 'Tu ingreso cubre exactamente tus gastos. No hay margen.'
                : `Gastás ${fmtM(Math.abs(diferencia))} más de lo que ingresás por mes.`
            }
            lines={[
              `Tu gasto total representa el ${porcentajeUsado}% de tu ingreso mensual.`,
              pctFijosYFugas > 70
                ? `Los compromisos fijos + fugas invisibles consumen el ${pctFijosYFugas}% de tu ingreso antes de que tomes ninguna decisión consciente. Es el patrón más común — y la razón por la que el presupuesto no alcanza.`
                : `Los compromisos fijos + fugas invisibles representan el ${pctFijosYFugas}% de tu ingreso. Estás por debajo del 70% típico — eso es una señal sana de que hay margen para diseñar.`,
              diferencia < 0
                ? 'La diferencia negativa indica que el gasto supera el ingreso. El Capítulo 2 identifica exactamente dónde están las fugas para recuperar ese margen sin ganar más.'
                : 'La diferencia positiva es el dinero que todavía podés diseñar. El sistema financiero de este libro te muestra cómo capturarlo antes de que el consumo lo absorba.',
            ]}
            semaforo={[
              { color: '#4ade80', label: 'Diferencia positiva → hay margen para diseñar' },
              { color: '#fb923c', label: 'Diferencia cero → estás justo' },
              { color: '#f87171', label: 'Diferencia negativa → el gasto supera el ingreso' },
            ]}
          />

          <NoteAlert
            label="Diferencia mensual"
            value={fmtM(diferencia)}
            tip="Este número refleja el margen real disponible antes de cualquier decisión de diseño financiero."
          />
        </>
      )}
    </Layout>
  )
}
