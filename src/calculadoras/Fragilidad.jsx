import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CalcTable from '../components/CalcTable'
import ResultBox from '../components/ResultBox'
import NoteAlert from '../components/NoteAlert'
import NumInput from '../components/NumInput'
import { fmtM, fmt, parse } from '../utils/helpers'
import { storage, KEYS } from '../utils/storage'

export default function Fragilidad() {
  const [efectivo,    setEfectivo]    = useState('')
  const [cuentas,     setCuentas]     = useState('')
  const [inversiones, setInversiones] = useState('')
  const [alquiler,    setAlquiler]    = useState('')
  const [servicios,   setServicios]   = useState('')
  const [alimentos,   setAlimentos]   = useState('')
  const [transporte,  setTransporte]  = useState('')
  const [medicacion,  setMedicacion]  = useState('')

  const vEfec  = parse(efectivo)
  const vCtas  = parse(cuentas)
  const vInv   = parse(inversiones)
  const vAlq   = parse(alquiler)
  const vServ  = parse(servicios)
  const vAlim  = parse(alimentos)
  const vTrans = parse(transporte)
  const vMed   = parse(medicacion)

  const totalDisponible = vEfec + vCtas + vInv
  const gastosEsenciales = vAlq + vServ + vAlim + vTrans + vMed
  const meses = gastosEsenciales > 0 ? totalDisponible / gastosEsenciales : 0
  const hasResult = totalDisponible > 0 && gastosEsenciales > 0

  const status = meses < 3 ? 'red' : meses < 6 ? 'yellow' : 'green'
  const label = meses < 3 ? 'Fragilidad crítica' : meses < 6 ? 'Colchón básico pero frágil' : 'Base sólida para construir'

  useEffect(() => {
    if (hasResult && meses > 0) {
      storage.set(KEYS.FRAGILIDAD, parseFloat(meses.toFixed(2)))
    }
  }, [meses, hasResult])

  const rows = [
    { type: 'separator', label: 'Dinero disponible ahora mismo' },
    {
      step: 1, type: 'input', concept: 'Efectivo disponible',
      how: 'Billetes y monedas accesibles en este momento',
      input: <NumInput value={efectivo} onChange={setEfectivo} />,
    },
    {
      step: 2, type: 'input', concept: 'Cuentas bancarias',
      how: 'Saldo total en todas tus cuentas',
      input: <NumInput value={cuentas} onChange={setCuentas} />,
    },
    {
      step: 3, type: 'input', concept: 'Inversiones líquidas',
      how: 'Las que podés convertir en efectivo en menos de 48 horas',
      input: <NumInput value={inversiones} onChange={setInversiones} />,
    },
    {
      step: '+', type: 'subtotal', concept: 'Total disponible (A)',
      how: 'Suma de los pasos 1, 2 y 3',
      value: totalDisponible > 0 ? fmtM(totalDisponible) : '',
    },
    { type: 'separator', label: 'Gastos esenciales mensuales — solo lo imprescindible' },
    {
      step: 4, type: 'input', concept: 'Alquiler o hipoteca',
      how: 'Costo mensual de vivienda',
      input: <NumInput value={alquiler} onChange={setAlquiler} />,
    },
    {
      step: 5, type: 'input', concept: 'Servicios básicos',
      how: 'Agua, luz, gas, internet, teléfono',
      input: <NumInput value={servicios} onChange={setServicios} />,
    },
    {
      step: 6, type: 'input', concept: 'Alimentación esencial',
      how: 'Gasto mínimo de comida para subsistir',
      input: <NumInput value={alimentos} onChange={setAlimentos} />,
    },
    {
      step: 7, type: 'input', concept: 'Transporte imprescindible',
      how: 'Solo lo estrictamente necesario',
      input: <NumInput value={transporte} onChange={setTransporte} />,
    },
    {
      step: 8, type: 'input', concept: 'Medicación y salud esencial',
      how: 'Si aplica — dejá en 0 si no tenés gastos fijos',
      input: <NumInput value={medicacion} onChange={setMedicacion} />,
    },
    {
      step: '+', type: 'subtotal', concept: 'Gastos esenciales por mes (B)',
      how: 'Suma de los pasos 4 a 8',
      value: gastosEsenciales > 0 ? fmtM(gastosEsenciales) : '',
    },
    { type: 'separator', label: '──' },
    {
      step: '=', type: 'result', concept: 'Mi Número de Fragilidad',
      how: 'Total disponible (A) ÷ Gastos esenciales por mes (B)',
      value: hasResult ? `${fmt(meses.toFixed(1))} meses` : '',
      negative: hasResult ? meses < 3 : undefined,
    },
  ]

  const interpretations = {
    red:    [
      `Con ${fmt(meses.toFixed(1))} meses de autonomía, cualquier evento inesperado — pérdida del trabajo, enfermedad, emergencia familiar — te lleva directo a la deuda.`,
      'El activo digital no reemplaza este colchón, pero genera el ingreso adicional que puede ir construyéndolo. Ese es uno de los objetivos del sistema de 90 días.',
    ],
    yellow: [
      `Con ${fmt(meses.toFixed(1))} meses de autonomía tenés un colchón básico, pero frágil. Alcanza para una crisis pequeña, no para una mayor.`,
      'El objetivo del sistema es que en 6 meses este número esté por encima de 6, mientras el activo genera el ingreso adicional en paralelo.',
    ],
    green:  [
      `Con ${fmt(meses.toFixed(1))} meses de autonomía tenés una base sólida. Eso cambia cómo tomás decisiones — incluyendo la de construir el activo — porque no operás desde el miedo a la falta.`,
      'Este número va a importar de nuevo en la Calculadora 6 (Balance de 90 días), cuando midas cuánto mejoró después de tres meses de sistema.',
    ],
  }

  return (
    <Layout
      chapter="Capítulo 3"
      title="Mi Número de Fragilidad"
      subtitle="Calculá cuánto tiempo podés sostenerte si perdieras tu fuente de ingreso principal mañana. El resultado es el punto de partida del sistema — no su destino."
    >
      <CalcTable rows={rows} />

      {hasResult && (
        <>
          <ResultBox
            status={status}
            title={`${label} — ${fmt(meses.toFixed(1))} meses de autonomía.`}
            lines={interpretations[status]}
            semaforo={[
              { color: '#f87171', label: 'Menos de 3 meses → fragilidad crítica' },
              { color: '#fb923c', label: 'Entre 3 y 6 meses → colchón básico' },
              { color: '#4ade80', label: 'Más de 6 meses → base sólida' },
            ]}
          />

          <NoteAlert
            label="Número de Fragilidad"
            value={`${fmt(meses.toFixed(1))} meses`}
            nextChapter="Capítulo 12 (Balance de 90 días)"
            tip="Guardamos este número automáticamente. En el balance de los 90 días vas a comparar este resultado con el que tengas después de ejecutar el sistema."
          />
        </>
      )}
    </Layout>
  )
}
