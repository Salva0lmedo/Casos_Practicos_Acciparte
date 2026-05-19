import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getElementDef, getCategoryForType } from '../data/elementTypes'

const createSceneElement = (type, x, y) => {
  const def = getElementDef(type)
  return {
    id: uuidv4(),
    type,
    category: getCategoryForType(type),
    x,
    y,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    properties: {
      color: def?.defaultColor ?? '#6b7280',
      label: def?.label ?? type,
    },
  }
}

export const useScene = () => {
  const [elements, setElements] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const addElement = useCallback((type, x, y) => {
    const el = createSceneElement(type, x, y)
    setElements((prev) => [...prev, el])
    setSelectedId(el.id)
    return el.id
  }, [])

  const updateElement = useCallback((id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    )
  }, [])

  const removeElement = useCallback((id) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
    setSelectedId(null)
  }, [])

  const clearScene = useCallback(() => {
    setElements([])
    setSelectedId(null)
  }, [])

  const loadScene = useCallback((json) => {
    if (!json?.elements) return
    setElements(json.elements)
    setSelectedId(null)
  }, [])

  const getSceneJSON = useCallback(
    () => ({
      id: 'scene-' + Date.now(),
      timestamp: new Date().toISOString(),
      elements: elements.map((el) => ({
        id: el.id,
        type: el.type,
        category: el.category,
        x: Math.round(el.x),
        y: Math.round(el.y),
        rotation: Math.round(el.rotation ?? 0),
        scaleX: el.scaleX ?? 1,
        scaleY: el.scaleY ?? 1,
        properties: el.properties,
      })),
    }),
    [elements]
  )

  return {
    elements,
    selectedId,
    setSelectedId,
    addElement,
    updateElement,
    removeElement,
    clearScene,
    loadScene,
    getSceneJSON,
  }
}
