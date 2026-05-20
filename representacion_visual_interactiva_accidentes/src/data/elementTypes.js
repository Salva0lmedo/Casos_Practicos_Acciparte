export const ELEMENT_CATEGORIES = [
  {
    id: 'vehicles',
    label: 'Vehículos',
    icon: '🚗',
    elements: [
      { type: 'car', label: 'Turismo', icon: '🚗', defaultColor: '#3b82f6' },
      { type: 'truck', label: 'Camión', icon: '🚛', defaultColor: '#f59e0b' },
      { type: 'motorcycle', label: 'Moto', icon: '🏍️', defaultColor: '#dc2626' },
      { type: 'van', label: 'Furgoneta', icon: '🚐', defaultColor: '#6b7280' },
    ],
  },
  {
    id: 'obstacles',
    label: 'Obstáculos',
    icon: '⚠️',
    elements: [
      { type: 'cone', label: 'Cono', icon: '🔺', defaultColor: '#f97316' },
      { type: 'barrier', label: 'Barrera', icon: '🚧', defaultColor: '#ef4444' },
      { type: 'tree', label: 'Árbol', icon: '🌳', defaultColor: '#22c55e' },
    ],
  },
  {
    id: 'environment',
    label: 'Entorno',
    icon: '🏙️',
    elements: [
      { type: 'traffic_light', label: 'Semáforo', icon: '🚦', defaultColor: '#1f2937' },
      { type: 'stop_sign', label: 'Señal STOP', icon: '🛑', defaultColor: '#ef4444' },
      { type: 'crosswalk', label: 'Paso Cebra', icon: '🦓', defaultColor: '#6b7280' },
    ],
  },
]

export const getElementDef = (type) => {
  for (const cat of ELEMENT_CATEGORIES) {
    const found = cat.elements.find((e) => e.type === type)
    if (found) return found
  }
  return null
}

// Derived from ELEMENT_CATEGORIES — single source of truth, no duplicate Sets
const TYPE_TO_CATEGORY = Object.fromEntries(
  ELEMENT_CATEGORIES.flatMap((cat) => cat.elements.map((el) => [el.type, cat.id]))
)

export const getCategoryForType = (type) => TYPE_TO_CATEGORY[type] ?? 'environment'
