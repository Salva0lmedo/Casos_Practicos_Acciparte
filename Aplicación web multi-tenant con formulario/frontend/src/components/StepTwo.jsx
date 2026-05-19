import { useState } from 'react';

const OPCIONES = [
  { value: 'Urgencia médica',        icon: '🚨' },
  { value: 'Accidente de tráfico',   icon: '🚗' },
  { value: 'Intervención quirúrgica',icon: '🏥' },
  { value: 'Consulta ambulatoria',   icon: '🩺' },
  { value: 'Traslado hospitalario',  icon: '🚑' },
];

export default function StepTwo({ onSubmit, onBack, error }) {
  const [selected, setSelected] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      setValidationError('Selecciona un tipo de intervención');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ tipo_intervencion: selected });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Tipo de intervención</h2>
      <p className="text-sm text-gray-500 mb-6">Selecciona el tipo que corresponde a este caso.</p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
        role="radiogroup"
        aria-label="Tipo de intervención"
      >
        {OPCIONES.map(({ value, icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected === value}
            onClick={() => { setSelected(value); setValidationError(''); }}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              selected === value
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl" aria-hidden="true">{icon}</span>
            <span className="text-sm font-medium flex-1">{value}</span>
            {selected === value && (
              <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {(validationError || error) && (
        <p role="alert" className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          ⚠ {validationError || error}
        </p>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors"
        >
          ← Atrás
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar formulario'}
        </button>
      </div>
    </form>
  );
}
