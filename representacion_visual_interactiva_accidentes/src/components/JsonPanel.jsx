import { useState, useMemo, useRef } from 'react'

export const JsonPanel = ({
  sceneJSON,
  selectedElement,
  onColorChange,
  onClear,
  onExportPNG,
  onImportJSON,
}) => {
  const [copied, setCopied] = useState(false)
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
        const json = JSON.parse(ev.target.result)
        onImportJSON(json)
      } catch {
        alert('JSON inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <aside className="json-panel">
      {/* Properties panel — visible only when element selected */}
      {selectedElement && (
        <div className="props-panel">
          <div className="props-title">Propiedades</div>
          <div className="prop-row">
            <span className="prop-key">Tipo</span>
            <span className="prop-val">{selectedElement.properties.label}</span>
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
          <kbd>Supr</kbd> elimina el elemento seleccionado
        </p>
        <p>Arrastra para mover · Esquinas para rotar</p>
      </div>
    </aside>
  )
}
