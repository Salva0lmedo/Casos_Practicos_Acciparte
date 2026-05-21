# Reconstrucción Visual Interactiva de Accidentes

> **Stack:** React · react-konva · Vite

Herramienta web para reconstruir visualmente escenas de accidentes de tráfico sobre un canvas interactivo. Permite colocar, mover, rotar y escalar elementos (vehículos, obstáculos, señalización) y exportar/importar la escena en JSON.

---

## Requisitos previos

| Programa | Descarga |
|----------|---------|
| **Node.js 18+** | https://nodejs.org → botón "LTS" |

---

## Instalación y arranque

```powershell
cd "C:\ruta\donde\descargaste\el\proyecto\representacion_visual_interactiva_accidentes"
npm install
npm run dev
```

**Resultado esperado:**
```
VITE v8.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Abre el navegador en `http://localhost:5173`.

---

## Cómo usar la herramienta

### Añadir elementos a la escena

En el panel lateral izquierdo (**Elementos**) hay tres categorías:

| Categoría | Elementos disponibles |
|-----------|----------------------|
| **Vehículos** | Turismo, Camión, Moto, Furgoneta |
| **Obstáculos** | Cono, Barrera, Árbol |
| **Entorno** | Semáforo, Señal STOP, Paso Cebra |

Haz clic en cualquier elemento para añadirlo al canvas (centrado en el área visible).

### Manipular elementos en el canvas

- **Seleccionar:** clic sobre el elemento.
- **Mover:** arrastra el elemento seleccionado.
- **Rotar / escalar:** usa los manejadores del transformer que aparece al seleccionar.
- **Eliminar:** selecciona el elemento y pulsa `Supr` o `Backspace`.
- **Deshacer / Rehacer:** `Ctrl+Z` / `Ctrl+Y` (o `Ctrl+Shift+Z`). Historial de hasta 50 estados.

### Cuadrícula y snap

El botón **Snap: ON/OFF** en el panel izquierdo activa el ajuste a cuadrícula (paso de 40 px). Al moverlos con snap activo, los elementos se alinean automáticamente a la rejilla visible en el canvas.

### Editar propiedades del elemento

Al seleccionar un elemento, el panel derecho muestra sus propiedades:

- **Etiqueta:** campo de texto editable. El texto aparece bajo el elemento en el canvas.
- **Color:** selector de color para cambiar el color del elemento.

### Metadatos del accidente

En el panel derecho hay una sección **Metadatos del accidente** (desplegable) con:

| Campo | Tipo |
|-------|------|
| Lugar | Texto libre |
| Fecha | Selector de fecha |
| Meteorología | Despejado · Lluvia · Niebla · Nieve · Viento fuerte |
| Descripción | Área de texto |

Estos metadatos se incluyen en el JSON exportado y se restauran al importar.

### Exportar e importar la escena

El panel derecho (**JSON**) muestra en todo momento el estado actual de la escena:

```json
{
  "id": "uuid-estable-de-la-escena",
  "timestamp": "2025-05-20T10:30:00.000Z",
  "metadata": {
    "location": "Calle Mayor 12, Madrid",
    "date": "2025-05-20",
    "weather": "Lluvia",
    "description": "Colisión en intersección."
  },
  "elements": [
    {
      "id": "uuid-...",
      "type": "car",
      "category": "vehicle",
      "x": 320,
      "y": 240,
      "rotation": 45,
      "scaleX": 1,
      "scaleY": 1,
      "properties": { "color": "#3b82f6", "label": "Turismo" }
    }
  ]
}
```

- **Exportar:** copia el JSON del panel o usa el botón de descarga.
- **Importar:** pega un JSON válido en el panel y confirma para restaurar escena y metadatos.
- **Limpiar:** botón **Limpiar escena** para eliminar todos los elementos.

---

## Estructura del proyecto

```
representacion_visual_interactiva_accidentes/
  src/
    main.jsx               ← punto de entrada React
    index.css              ← estilos globales
    App.jsx                ← layout principal (toolbar + canvas + panel JSON)
    components/
      Canvas.jsx           ← stage Konva con todos los elementos renderizados
      SceneElement.jsx     ← representación individual de cada elemento en canvas
      Toolbar.jsx          ← panel lateral de categorías y botones de elementos
      JsonPanel.jsx        ← vista y edición del JSON de la escena
    data/
      elementTypes.js      ← catálogo de tipos de elementos con iconos y colores
    hooks/
      useScene.js          ← estado de la escena: add / update / remove / clear / loadScene
  index.html
  vite.config.js
```

---

## Modelo de datos

Cada elemento de la escena tiene esta estructura:

```json
{
  "id": "string (UUID)",
  "type": "string (car | truck | motorcycle | van | cone | barrier | tree | traffic_light | stop_sign | crosswalk)",
  "category": "string (vehicles | obstacles | environment)",
  "x": "number (coordenada horizontal en píxeles)",
  "y": "number (coordenada vertical en píxeles)",
  "rotation": "number (grados, 0-360)",
  "scaleX": "number (escala horizontal, 1 = tamaño original)",
  "scaleY": "number (escala vertical, 1 = tamaño original)",
  "properties": {
    "color": "string (hex color)",
    "label": "string (etiqueta visible en canvas)"
  }
}
```

El JSON completo de la escena incluye además:

- `id` — UUID estable de la escena (no cambia entre renders).
- `timestamp` — ISO 8601, momento del último cambio exportado.
- `metadata` — lugar, fecha, meteorología y descripción del accidente.
- `elements` — array de todos los elementos con las propiedades anteriores.

### Decisiones técnicas clave

- **`useReducer` con patrón past/present/future, no librería (`redux-undo`)**: implementación en ~50 líneas, sin dependencias extra, lógica completamente visible. Una librería añadiría abstracciones para un caso de uso que controlamos por completo.
- **`react-konva`, no canvas API directa**: Konva gestiona eventos de ratón/touch, transformer handles (rotación/escala), hit detection y coordenadas mundo vs. pantalla. Con canvas API directa, todo eso sería código manual propenso a errores.
- **UUID estable para `sceneId`, no `Date.now()`**: `Date.now()` cambiaría en cada render de `getSceneJSON`, generando JSON diferente aunque la escena no haya cambiado. El UUID se genera una sola vez al inicio de la sesión.
- **`ResizeObserver` para dimensiones del canvas**: `window.addEventListener('resize')` solo detecta cambios del viewport. `ResizeObserver` detecta cualquier cambio del contenedor (sidebar que aparece, panel que se redimensiona).
- **Import valida y descarta elementos inválidos, no lanza error**: si el JSON importado tiene un elemento corrupto entre 20 válidos, cargar los 19 buenos es mejor que fallar por completo y perder todo el estado.

### Gestión de estado e historial

`useScene` usa `useReducer` con patrón past/present/future (máx. 50 entradas). Cada acción mutante (ADD, UPDATE, REMOVE, CLEAR, LOAD) empuja el estado anterior al historial. UNDO/REDO invierten el movimiento entre stacks. La selección activa no forma parte del historial para no contaminar el deshacer.

### Exportación / importación

La importación valida cada elemento (`id`, `type`, `x`, `y` como tipos correctos) antes de cargar, descartando entradas inválidas sin errores silenciosos. Al importar también se restauran los metadatos si están presentes en el JSON.
