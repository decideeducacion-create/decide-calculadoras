import { useState, useEffect } from 'react';
import { fmt, parse } from '../utils/helpers';

export default function NumInput({ value, onChange, placeholder = '0', prefix = '$', disabled = false, small = false }) {
  const [displayValue, setDisplayValue] = useState('');

  // Sincroniza el valor mostrado cuando el valor externo (value) cambia
  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      setDisplayValue('');
    } else {
      const num = parse(value);
      if (isNaN(num)) {
        setDisplayValue('');
      } else {
        setDisplayValue(fmt(num));
      }
    }
  }, [value]);

  const handleChange = (e) => {
    let raw = e.target.value;

    // Limpieza para obtener el número en formato estándar (punto decimal, sin miles)
    let cleaned = raw.replace(/\./g, '');      // elimina puntos de miles
    cleaned = cleaned.replace(',', '.');       // convierte coma decimal a punto

    // Caso: vacío o solo un signo menos
    if (cleaned === '' || cleaned === '-') {
      onChange('');
      setDisplayValue('');
      return;
    }

    const num = parseFloat(cleaned);
    if (isNaN(num)) return;  // ignora caracteres no válidos

    // Actualiza el estado padre con el string limpio (punto decimal, sin miles)
    onChange(cleaned);
    // Actualiza la visualización con formato de miles y coma decimal
    setDisplayValue(fmt(num));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
      {!disabled && <span style={{ fontSize: small ? '12px' : '13px', color: '#555', flexShrink: 0 }}>{prefix}</span>}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: small ? '100px' : '120px', textAlign: 'right' }}
      />
    </div>
  );
}