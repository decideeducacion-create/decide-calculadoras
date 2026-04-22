import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CalcTable from '../components/CalcTable'
import ResultBox from '../components/ResultBox'
import NoteAlert from '../components/NoteAlert'
import SavedBanner from '../components/SavedBanner'
import NumInput from '../components/NumInput'
import { fmtM, fmt, parse } from '../utils/helpers'
import { storage, KEYS } from '../utils/storage'

export default function Balance() {
  const [rvn,             setRvn]             = useState('')
  const [fragilidadAntes, setFragilidadAntes] = useState('')
  const [fragilidadAhora, setFragilidadAhora] = useState('')
  const [ingresoActivo,   setIngresoActivo]   = useState('')
  const [horas,           setHoras]           = useState('')
  const [ventas,          setVentas]          = useState('')

  const [savedFields, setSavedFields] = useState([])

  useEffect(() => {
    const storedRvn  = storage.get(KEYS.RVN)
    const storedFrag = storage.get(KEYS.FRAGILIDAD)
    const fields = []
    if (storedRvn) {
      setRvn(String(storedRvn))
      fields.push({ label: 'RVN (Capítulo 1)', value: `$ ${fmt(storedRvn)} /hora` })
    }
    if (storedFrag) {
      setFragilidadAntes(String(storedFrag))
      fields.push({ label: 'Número de Fragilidad inicial (Capítulo 3)', value: `${fmt(storedFrag)} meses` })
    }
    setSavedFields(fields)
  }, [])

  const vRvn         = parse(rvn)
  const vIngreso     = parse(ingresoActivo)
  const vHoras       = parse(horas)
  const vVentas      = parse(ventas)
  const vFragAntes   = parse(fragilidadAntes)
  const vFragAhora   = parse(fragilidadAhora)

  const ingresoPorHora = vHoras > 0 ? vIngreso / vHoras : 0
  const superaRvn      = vRvn > 0 && ingresoPorHora > vRvn
  const deltaFrag      = vFragAhora - vFragAntes
  const hasResult      = vIngreso > 0 && vHoras > 0

  const rows = [
    { type: 'separator', label: 'Ingresos del activo en los 90 días' },
    {
      step: 1, type: 'input', concept: 'Ingreso total del activo (en $)',
      how: 'Total de lo que entró en tu cuenta de Hotmart en los 90 días, en pesos al tipo de cambio',
      input: <NumInput value={ingresoActivo} onChange={setIngresoActivo} />,
    },
    {
      step: 2, type: 'input', concept: 'Horas invertidas (estimación)',
      how: 'Creación + contactos + contenido + soporte durante los 90 días',
      input: <NumInput value={horas} onChange={setHoras} placeholder="0" prefix="hs" />,
    },
    {
      step: '÷', type: 'calc', concept: 'Ingreso por hora del activo',
      how: 'Ingreso total (paso 1) ÷ Horas invertidas (paso 2)',
      value: hasResult ? `$ ${fmt(ingresoPorHora.toFixed(2))} /hora` : '',
    },
    {
      step: 3, type: 'input', concept: 'Mi RVN real (referencia)',
      how: 'Lo que calculaste en el Capítulo 1 — el costo real de una hora de trabajo',
      note: parse(rvn) > 0 ? '↑ Pre-completado desde tu calculadora del Capítulo 1' : '',
      input: <NumInput value={rvn} onChange={setRvn} prefix="$" />,
    },
    {
      step: '=', type: 'result', concept: '¿El activo supera el RVN por hora?',
      how: 'Comparación entre el ingreso por hora del activo y tu RVN real',
      value: hasResult && vRvn > 0
        ? superaRvn
          ? `Sí — $ ${fmt(ingresoPorHora.toFixed(2))} vs $ ${fmt(vRvn.toFixed(2))}`
          : `Todavía no — $ ${fmt(ingresoPorHora.toFixed(2))} vs $ ${fmt(vRvn.toFixed(2))}`
        : '',
      negative: hasResult && vRvn > 0 ? !superaRvn : undefined,
    },
    { type: 'separator', label: 'Ventas y evolución de la fragilidad' },
    {
      step: 4, type: 'input', concept: 'Ventas totales en 90 días',
      how: 'Cantidad total de unidades vendidas del activo',
      input: <NumInput value={ventas} onChange={setVentas} placeholder="0" prefix="uds" />,
    },
    {
      step: 5, type: 'input', concept: 'Número de Fragilidad al inicio',
      how: 'El resultado de la Calculadora 3 (Capítulo 3)',
      note: parse(fragilidadAntes) > 0 ? '↑ Pre-completado desde tu calculadora del Capítulo 3' : '',
      input: <NumInput value={fragilidadAntes} onChange={setFragilidadAntes} prefix="meses" />,
    },
    {
      step: 6, type: 'input', concept: 'Número de Fragilidad ahora',
      how: 'Calculalo de nuevo con los datos actuales — ¿cuántos meses podés sostenerte hoy?',
      input: <NumInput value={fragilidadAhora} onChange={setFragilidadAhora} prefix="meses" />,
    },
    {
      step: '=', type: 'result', concept: 'Cambio en el Número de Fragilidad',
      how: 'Fragilidad ahora − Fragilidad al inicio — positivo es mejor',
      value: vFragAntes > 0 && vFragAhora > 0
        ? deltaFrag >= 0 ? `+ ${fmt(deltaFrag.toFixed(1))} meses` : `${fmt(deltaFrag.toFixed(1))} meses`
        : '',
      negative: vFragAntes > 0 && vFragAhora > 0 ? deltaFrag < 0 : undefined,
    },
  ]

  const getResultStatus = () => {
    if (!hasResult) return 'neutral'
    if (superaRvn && deltaFrag > 0) return 'green'
    if (superaRvn || deltaFrag > 0) return 'neutral'
    return 'yellow'
  }

  const getResultLines = () => {
    const lines = []
    if (!hasResult) return lines

    if (vHoras > 0) {
      lines.push(`En 90 días invertiste ${fmt(vHoras)} horas y el activo generó el equivalente a $ ${fmt(ingresoPorHora.toFixed(2))} por hora.`)
    }
    if (superaRvn) {
      lines.push(`El ingreso por hora del activo ya supera tu RVN real. El sistema está funcionando estructuralmente, aunque el volumen todavía sea pequeño.`)
    } else if (vRvn > 0) {
      lines.push(`El ingreso por hora del activo todavía está por debajo de tu RVN. Eso es normal en el Nivel 1 — el sistema no está diseñado para superar el sueldo en los primeros 90 días. Está diseñado para demostrarte que funciona.`)
    }
    if (vVentas > 0) {
      lines.push(`${fmt(vVentas)} venta${vVentas !== 1 ? 's' : ''} en 90 días.${vVentas >= 3 ? ' El activo está validado. El Nivel 2 del Capítulo 14 es el próximo paso.' : ' Si no llegaste a 3 ventas, repetí con una nueva lista de 20 contactos antes de pasar al Mes 2.'}`)
    }
    if (deltaFrag !== 0 && vFragAntes > 0 && vFragAhora > 0) {
      lines.push(deltaFrag > 0
        ? `Tu Número de Fragilidad mejoró ${fmt(deltaFrag.toFixed(1))} meses. Eso es dirección real, aunque el destino sea más lejos todavía.`
        : `Tu Número de Fragilidad no mejoró en este período. Revisá si la Regla 50/50 del Capítulo 12 está operando — es el único mecanismo que protege el ingreso del activo de la Erosión del Estilo de Vida.`
      )
    }
    return lines
  }

  return (
    <Layout
      chapter="Capítulo 12"
      title="Balance de 90 días"
      subtitle="Medí lo que construiste. Cuatro números que responden si el sistema funcionó y qué ajustar para el siguiente trimestre."
    >
      {savedFields.length > 0 && <SavedBanner fields={savedFields} />}

      <CalcTable rows={rows} />

      {hasResult && (
        <>
          <ResultBox
            status={getResultStatus()}
            title="Qué te dice el balance"
            lines={getResultLines()}
          />

          <NoteAlert
            label="Balance completado"
            value={hasResult ? `${vVentas} ventas · $ ${fmt(ingresoPorHora.toFixed(2))}/hs · Fragilidad ${vFragAhora > 0 ? fmt(vFragAhora.toFixed(1)) + ' meses' : 'sin dato'}` : ''}
            tip="Anotá estos números como punto de partida para el segundo trimestre. El Nivel 2 del Capítulo 14 empieza desde acá."
          />
        </>
      )}
    </Layout>
  )
}
