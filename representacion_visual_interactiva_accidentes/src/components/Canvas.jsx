import { useRef, useEffect, useState, useMemo } from 'react'
import { Stage, Layer, Group, Transformer, Line, Text } from 'react-konva'
import { SceneElementShape } from './SceneElement'

const HORIZONTAL_SCALE_TYPES = new Set(['barrier', 'crosswalk'])
const GRID_SIZE = 40

export const Canvas = ({ elements, selectedId, onSelect, onMove, onTransform, stageRef, zoom = 1 }) => {
  const containerRef = useRef(null)
  const transformerRef = useRef(null)
  const [size, setSize] = useState({
    width: window.innerWidth - 240 - 320,
    height: window.innerHeight - 56,
  })

  // Track actual container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const selectedType = elements.find((el) => el.id === selectedId)?.type
  const supportsHorizontalStretch = HORIZONTAL_SCALE_TYPES.has(selectedType)

  useEffect(() => {
    const tr = transformerRef.current
    if (!tr) return
    const stage = stageRef.current
    if (!stage) return

    if (selectedId) {
      const node = stage.findOne('#' + selectedId)
      if (node) {
        tr.nodes([node])
        tr.getLayer()?.batchDraw()
      }
    } else {
      tr.nodes([])
      tr.getLayer()?.batchDraw()
    }
  }, [selectedId, elements])

  // Grid lines in world coordinates — recompute when visible area changes
  const gridLines = useMemo(() => {
    const cols = Math.ceil(size.width / zoom / GRID_SIZE) + 2
    const rows = Math.ceil(size.height / zoom / GRID_SIZE) + 2
    const lines = []
    for (let i = 0; i <= cols; i++) {
      lines.push({ key: `v${i}`, points: [i * GRID_SIZE, 0, i * GRID_SIZE, rows * GRID_SIZE] })
    }
    for (let j = 0; j <= rows; j++) {
      lines.push({ key: `h${j}`, points: [0, j * GRID_SIZE, cols * GRID_SIZE, j * GRID_SIZE] })
    }
    return lines
  }, [size.width, size.height, zoom])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        scaleX={zoom}
        scaleY={zoom}
        onClick={(e) => {
          if (e.target === e.target.getStage()) onSelect(null)
        }}
        onTap={(e) => {
          if (e.target === e.target.getStage()) onSelect(null)
        }}
      >
        {/* Grid layer — non-interactive, scales with zoom */}
        <Layer listening={false}>
          {gridLines.map(({ key, points }) => (
            <Line key={key} points={points} stroke="#334155" strokeWidth={0.5} />
          ))}
        </Layer>

        {/* Elements layer */}
        <Layer>
          {elements.map((el) => (
            <Group
              key={el.id}
              id={el.id}
              x={el.x}
              y={el.y}
              rotation={el.rotation ?? 0}
              scaleX={el.scaleX ?? 1}
              scaleY={el.scaleY ?? 1}
              draggable
              onClick={() => onSelect(el.id)}
              onTap={() => onSelect(el.id)}
              onDragEnd={(e) => onMove(el.id, e.target.x(), e.target.y())}
            >
              <SceneElementShape type={el.type} color={el.properties.color} />
              <Text
                text={el.properties.label}
                x={-40}
                y={72}
                width={80}
                align="center"
                fontSize={10}
                fontStyle="bold"
                fill="#cbd5e1"
                shadowColor="black"
                shadowBlur={3}
                shadowOpacity={0.8}
                listening={false}
              />
            </Group>
          ))}

          <Transformer
            ref={transformerRef}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
              ...(supportsHorizontalStretch ? ['middle-left', 'middle-right'] : []),
            ]}
            rotateEnabled
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            borderStroke="#f97316"
            borderStrokeWidth={1.5}
            anchorStroke="#f97316"
            anchorFill="#fff"
            anchorSize={8}
            boundBoxFunc={(oldBox, newBox) => (Math.abs(newBox.width) < 20 ? oldBox : newBox)}
            onTransformEnd={(e) => {
              if (selectedId) {
                onTransform(selectedId, e.target.rotation(), e.target.scaleX(), e.target.scaleY())
              }
            }}
          />
        </Layer>
      </Stage>
    </div>
  )
}
