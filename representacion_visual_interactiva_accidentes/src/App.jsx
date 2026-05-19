import { useCallback, useEffect, useRef, useState } from 'react'
import { Toolbar } from './components/Toolbar'
import { Canvas } from './components/Canvas'
import { JsonPanel } from './components/JsonPanel'
import { useScene } from './hooks/useScene'

export default function App() {
  const {
    elements,
    selectedId,
    setSelectedId,
    addElement,
    updateElement,
    removeElement,
    clearScene,
    loadScene,
    getSceneJSON,
  } = useScene()

  const stageRef = useRef(null)
  const [zoom, setZoom] = useState(1)

  const zoomIn = useCallback(() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2))), [])
  const zoomOut = useCallback(() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2))), [])
  const zoomReset = useCallback(() => setZoom(1), [])

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null

  const handleAddElement = useCallback(
    (type) => {
      const cx = (window.innerWidth - 240 - 320) / 2
      const cy = (window.innerHeight - 56) / 2
      const jitter = () => (Math.random() - 0.5) * 100
      addElement(type, cx + jitter(), cy + jitter())
    },
    [addElement]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        const tag = e.target?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        removeElement(selectedId)
      }
    },
    [selectedId, removeElement]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleColorChange = useCallback(
    (color) => {
      if (!selectedElement) return
      updateElement(selectedElement.id, {
        properties: { ...selectedElement.properties, color },
      })
    },
    [selectedElement, updateElement]
  )

  const handleExportPNG = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const dataURL = stage.toDataURL({ pixelRatio: 2 })
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `accidente_${Date.now()}.png`
    a.click()
  }, [])

  const handleImportJSON = useCallback(
    (json) => {
      loadScene(json)
    },
    [loadScene]
  )

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-icon">⚠️</span>
          <h1>Reconstrucción Visual de Accidentes</h1>
        </div>
        <span className="topbar-badge">React · Konva</span>
      </header>

      <main className="workspace">
        <Toolbar onAddElement={handleAddElement} />

        <div className="canvas-area">
          <Canvas
            stageRef={stageRef}
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={(id, x, y) => updateElement(id, { x, y })}
            onTransform={(id, rotation, scaleX, scaleY) => updateElement(id, { rotation, scaleX, scaleY })}
            zoom={zoom}
          />
          {elements.length === 0 && (
            <div className="canvas-empty">
              <span>🏎️</span>
              <p>Añade elementos desde el panel izquierdo</p>
            </div>
          )}
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={zoomOut} title="Reducir" disabled={zoom <= 0.25}>−</button>
            <button className="zoom-label" onClick={zoomReset} title="Restablecer zoom">{Math.round(zoom * 100)}%</button>
            <button className="zoom-btn" onClick={zoomIn} title="Ampliar" disabled={zoom >= 3}>+</button>
          </div>
        </div>

        <JsonPanel
          sceneJSON={getSceneJSON()}
          selectedElement={selectedElement}
          onColorChange={handleColorChange}
          onClear={clearScene}
          onExportPNG={handleExportPNG}
          onImportJSON={handleImportJSON}
        />
      </main>
    </div>
  )
}
