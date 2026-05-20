import { useState, useMemo, useRef } from 'react'

const WEATHER_OPTIONS = ['Despejado', 'Lluvia', 'Niebla', 'Nieve', 'Viento fuerte']

export const JsonPanel = ({
  sceneJSON,
  selectedElement,
  onColorChange,
  onLabelChange,
  onClear,
  onExportPNG,
  onImportJSON,
  metadata,
  onMetadataChange,
}) => {
  const [copied, setCopied] = useState(false)
  const [metaOpen, setMetaOpen] = useState(false)
  const fileInputRef = useRef(null)
  const jsonString = useMemo(() => JSON.stringify(sceneJSON, null, 2), [sceneJSON])

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accidente_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        onImportJSON(JSON.parse(ev.target.result))
      } catch {
        alert('JSON inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <aside className="json-panel">
      {/* Element properties — visible when selected */}
      {selectedElement && (
        <div className="props-panel">
          <div className="props-title">Propiedades</div>
          <div className="prop-row">
            <span className="prop-key">Etiqueta</span>
            <input
              className="prop-input"
              value={selectedElement.properties.label}
              onChange={(e) => onLabelChange(e.target.value)}
            />
          </div>
          <div className="prop-row">
            <span className="prop-key">Color</span>
            <div className="color-picker-wrap">
              <input
                type="color"
                value={selectedElement.properties.color}
                onChange={(e) => onColorChange(e.target.value)}
                className="color-input"
              />
              <span className="prop-val mono">{selectedElement.properties.color}</span>
            </div>
          </div>
          <div className="prop-row">
            <span className="prop-key">Rotación</span>
            <span className="prop-val mono">{Math.round(selectedElement.rotation ?? 0)}°</span>
          </div>
          <div className="prop-row">
            <span className="prop-key">Posición</span>
            <span className="prop-val mono">
              x {Math.round(selectedElement.x)} · y {Math.round(selectedElement.y)}
            </span>
          </div>
        </div>
      )}

      {/* Accident metadata */}
      <div className="meta-section">
        <button className="meta-toggle" onClick={() => setMetaOpen((o) => !o)}>
          <span>📋 Metadatos del accidente</span>
          <span>{metaOpen ? '▲' : '▼'}</span>
        </button>
        {metaOpen && (
          <div className="meta-fields">
            <label className="meta-label">
              Lugar
              <input
                className="meta-input"
                value={metadata.location}
                onChange={(e) => onMetadataChange({ location: e.target.value })}
                placeholder="Dirección o km..."
              />
            </label>
            <label className="meta-label">
              Fecha
              <input
                type="date"
                className="meta-input"
                value={metadata.date}
                onChange={(e) => onMetadataChange({ date: e.target.value })}
              />
            </label>
            <label className="meta-label">
              Meteorología
              <select
                className="meta-input"
                value={metadata.weather}
                onChange={(e) => onMetadataChange({ weather: e.target.value })}
              >
                <option value="">—</option>
                {WEATHER_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </label>
            <label className="meta-label">
              Descripción
              <textarea
                className="meta-input meta-textarea"
                value={metadata.description}
                onChange={(e) => onMetadataChange({ description: e.target.value })}
                placeholder="Descripción del accidente..."
                rows={3}
              />
            </label>
          </div>
        )}
      </div>

      <div className="json-header">
        <h2>Datos de la escena</h2>
        <span className="element-count">
          {sceneJSON.elements.length}{' '}
          {sceneJSON.elements.length === 1 ? 'elemento' : 'elementos'}
        </span>
      </div>

      <div className="json-actions">
        <button className="btn-secondary" onClick={handleCopy}>
          {copied ? '✓ Copiado' : 'Copiar JSON'}
        </button>
        <button className="btn-primary" onClick={handleExportJSON}>
          JSON
        </button>
        <button className="btn-primary" onClick={onExportPNG}>
          PNG
        </button>
        <button
          className="btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          title="Cargar escena desde archivo .json"
        >
          Importar
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileImport}
          style={{ display: 'none' }}
        />
        <button className="btn-danger" onClick={onClear}>
          Limpiar
        </button>
      </div>

      <div className="json-viewer">
        <pre>{jsonString}</pre>
      </div>

      <div className="shortcuts-hint">
        <p>
          <kbd>Supr</kbd> elimina · <kbd>Ctrl+Z</kbd> deshacer · <kbd>Ctrl+Y</kbd> rehacer
        </p>
        <p>Arrastra para mover · Esquinas para rotar/escalar</p>
      </div>
    </aside>
  )
}
