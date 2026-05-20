import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Toolbar } from './components/Toolbar'
import { Canvas } from './components/Canvas'
import { JsonPanel } from './components/JsonPanel'
import { useScene } from './hooks/useScene'

const SNAP_SIZE = 40

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
    undo,
    redo,
    canUndo,
    canRedo,
    metadata,
    updateMetadata,
    getSceneJSON,
  } = useScene()

  const stageRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [snapToGrid, setSnapToGrid] = useState(false)

  const zoomIn = useCallback(() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2))), [])
  const zoomOut = useCallback(() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2))), [])
  const zoomReset = useCallback(() => setZoom(1), [])

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null
  const sceneJSON = useMemo(() => getSceneJSON(), [getSceneJSON])

  const handleAddElement = useCallback(
    (type, canvasSize) => {
      // canvasSize passed from Canvas via Toolbar — fallback to estimate if not available
      const w = canvasSize?.width ?? window.innerWidth - 240 - 320
      const h = canvasSize?.height ?? window.innerHeight - 56
      const jitter = () => (Math.random() - 0.5) * 100
      // Divide by zoom: convert viewport center to world coordinates
      addElement(type, (w / 2 + jitter()) / zoom, (h / 2 + jitter()) / zoom)
    },
    [addElement, zoom]
  )

  const handleMove = useCallback(
    (id, x, y) => {
      const sx = snapToGrid ? Math.round(x / SNAP_SIZE) * SNAP_SIZE : x
      const sy = snapToGrid ? Math.round(y / SNAP_SIZE) * SNAP_SIZE : y
      updateElement(id, { x: sx, y: sy })
    },
    [snapToGrid, updateElement]
  )

  const handleKeyDown = useCallback(
    (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        removeElement(selectedId)
        return
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        undo()
        return
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault()
        redo()
      }
    },
    [selectedId, removeElement, undo, redo]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleColorChange = useCallback(
    (color) => {
      if (!selectedElement) return
      updateElement(selectedElement.id, { properties: { ...selectedElement.properties, color } })
    },
    [selectedElement, updateElement]
  )

  const handleLabelChange = useCallback(
    (label) => {
      if (!selectedElement) return
      updateElement(selectedElement.id, { properties: { ...selectedElement.properties, label } })
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

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-icon">⚠️</span>
          <h1>Reconstrucción Visual de Accidentes</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="btn-undo"
            onClick={undo}
            disabled={!canUndo}
            title="Deshacer (Ctrl+Z)"
          >
            ↩ Deshacer
          </button>
          <button
            className="btn-undo"
            onClick={redo}
            disabled={!canRedo}
            title="Rehacer (Ctrl+Y)"
          >
            ↪ Rehacer
          </button>
        </div>
        <span className="topbar-badge">React · Konva</span>
      </header>

      <main className="workspace">
        <Toolbar
          onAddElement={handleAddElement}
          snapToGrid={snapToGrid}
          onSnapToggle={() => setSnapToGrid((s) => !s)}
        />

        <div className="canvas-area">
          <Canvas
            stageRef={stageRef}
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={handleMove}
            onTransform={(id, rotation, scaleX, scaleY) =>
              updateElement(id, { rotation, scaleX, scaleY })
            }
            zoom={zoom}
          />
          {elements.length === 0 && (
            <div className="canvas-empty">
              <span>🏎️</span>
              <p>Añade elementos desde el panel izquierdo</p>
            </div>
          )}
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={zoomOut} title="Reducir" disabled={zoom <= 0.25}>
              −
            </button>
            <button className="zoom-label" onClick={zoomReset} title="Restablecer zoom">
              {Math.round(zoom * 100)}%
            </button>
            <button className="zoom-btn" onClick={zoomIn} title="Ampliar" disabled={zoom >= 3}>
              +
            </button>
          </div>
        </div>

        <JsonPanel
          sceneJSON={sceneJSON}
          selectedElement={selectedElement}
          onColorChange={handleColorChange}
          onLabelChange={handleLabelChange}
          onClear={clearScene}
          onExportPNG={handleExportPNG}
          onImportJSON={loadScene}
          metadata={metadata}
          onMetadataChange={updateMetadata}
        />
      </main>
    </div>
  )
}
