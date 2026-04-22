export default function NumInput({ value, onChange, placeholder = '0', prefix = '$', disabled = false, small = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
      {!disabled && <span style={{ fontSize: small ? '12px' : '13px', color: '#555', flexShrink: 0 }}>{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min="0"
        step="any"
        style={{ width: small ? '100px' : '120px', textAlign: 'right' }}
      />
    </div>
  )
}
