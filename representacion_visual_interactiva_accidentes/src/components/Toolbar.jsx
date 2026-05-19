import { ELEMENT_CATEGORIES } from '../data/elementTypes'

export const Toolbar = ({ onAddElement }) => (
  <aside className="toolbar">
    <div className="toolbar-header">
      <h2>Elementos</h2>
      <p>Clic para añadir a la escena</p>
    </div>

    {ELEMENT_CATEGORIES.map((cat) => (
      <div key={cat.id} className="toolbar-category">
        <div className="category-header">
          <span className="category-icon">{cat.icon}</span>
          <span className="category-label">{cat.label}</span>
        </div>
        <div className="element-grid">
          {cat.elements.map((el) => (
            <button
              key={el.type}
              className="element-btn"
              onClick={() => onAddElement(el.type)}
              title={`Añadir ${el.label}`}
            >
              <span className="el-icon">{el.icon}</span>
              <span className="el-label">{el.label}</span>
            </button>
          ))}
        </div>
      </div>
    ))}
  </aside>
)
