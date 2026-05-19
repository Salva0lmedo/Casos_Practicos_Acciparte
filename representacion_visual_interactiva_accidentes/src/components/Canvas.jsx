import { useRef, useEffect } from 'react'
import { Stage, Layer, Group, Transformer } from 'react-konva'
import { SceneElementShape } from './SceneElement'

const HORIZONTAL_SCALE_TYPES = new Set(['barrier', 'crosswalk'])

export const Canvas = ({ elements, selectedId, onSelect, onMove, onTransform, stageRef, zoom = 1 }) => {
  const transformerRef = useRef(null)

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

  const stageWidth = window.innerWidth - 280 - 340
  const stageHeight = window.innerHeight - 56

  return (
    <Stage
      ref={stageRef}
      width={stageWidth}
      height={stageHeight}
      scaleX={zoom}
      scaleY={zoom}
      onClick={(e) => {
        if (e.target === e.target.getStage()) onSelect(null)
      }}
      onTap={(e) => {
        if (e.target === e.target.getStage()) onSelect(null)
      }}
    >
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
          </Group>
        ))}

        <Transformer
          ref={transformerRef}
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            ...(supportsHorizontalStretch ? ['middle-left', 'middle-right'] : []),
          ]}
          rotateEnabled
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          borderStroke="#f97316"
          borderStrokeWidth={1.5}
          anchorStroke="#f97316"
          anchorFill="#fff"
          anchorSize={8}
          boundBoxFunc={(oldBox, newBox) =>
            Math.abs(newBox.width) < 20 ? oldBox : newBox
          }
          onTransformEnd={(e) => {
            if (selectedId) {
              onTransform(selectedId, e.target.rotation(), e.target.scaleX(), e.target.scaleY())
            }
          }}
        />
      </Layer>
    </Stage>
  )
}
