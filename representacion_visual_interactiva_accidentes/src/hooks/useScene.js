import { useReducer, useCallback } from 'react'
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

const isValidElement = (el) =>
  el &&
  typeof el.id === 'string' &&
  typeof el.type === 'string' &&
  typeof el.x === 'number' &&
  typeof el.y === 'number'

const MAX_HISTORY = 50
const INITIAL_METADATA = { location: '', date: '', description: '', weather: '' }

const initialState = {
  past: [],
  present: [],
  future: [],
  selectedId: null,
  sceneId: uuidv4(),
  metadata: INITIAL_METADATA,
}

const pushHistory = (state, newPresent) => ({
  past: [...state.past.slice(-(MAX_HISTORY - 1)), state.present],
  present: newPresent,
  future: [],
})

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const el = createSceneElement(action.elementType, action.x, action.y)
      return { ...state, ...pushHistory(state, [...state.present, el]), selectedId: el.id }
    }
    case 'UPDATE':
      return {
        ...state,
        ...pushHistory(
          state,
          state.present.map((el) => (el.id === action.id ? { ...el, ...action.updates } : el))
        ),
      }
    case 'REMOVE':
      return {
        ...state,
        ...pushHistory(state, state.present.filter((el) => el.id !== action.id)),
        selectedId: null,
      }
    case 'CLEAR':
      return { ...state, ...pushHistory(state, []), selectedId: null }
    case 'LOAD': {
      const valid = (action.json?.elements ?? []).filter(isValidElement)
      return {
        ...state,
        ...pushHistory(state, valid),
        selectedId: null,
        metadata: action.json?.metadata
          ? { ...INITIAL_METADATA, ...action.json.metadata }
          : state.metadata,
      }
    }
    case 'UNDO': {
      if (!state.past.length) return state
      return {
        ...state,
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
        selectedId: null,
      }
    }
    case 'REDO': {
      if (!state.future.length) return state
      return {
        ...state,
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
        selectedId: null,
      }
    }
    case 'SELECT':
      return { ...state, selectedId: action.id }
    case 'UPDATE_METADATA':
      return { ...state, metadata: { ...state.metadata, ...action.updates } }
    default:
      return state
  }
}

export const useScene = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { past, present: elements, future, selectedId, sceneId, metadata } = state

  const addElement = useCallback((type, x, y) => dispatch({ type: 'ADD', elementType: type, x, y }), [])
  const updateElement = useCallback((id, updates) => dispatch({ type: 'UPDATE', id, updates }), [])
  const removeElement = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const clearScene = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const loadScene = useCallback((json) => dispatch({ type: 'LOAD', json }), [])
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])
  const setSelectedId = useCallback((id) => dispatch({ type: 'SELECT', id }), [])
  const updateMetadata = useCallback((updates) => dispatch({ type: 'UPDATE_METADATA', updates }), [])

  const getSceneJSON = useCallback(
    () => ({
      id: sceneId,
      timestamp: new Date().toISOString(),
      metadata,
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
    [sceneId, metadata, elements]
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
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    metadata,
    updateMetadata,
    getSceneJSON,
  }
}
