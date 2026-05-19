import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import { submitForm, logout as apiLogout } from '../api';

const STEPS = ['Datos del incidente', 'Tipo de intervención'];

export default function FormPage() {
  const [step, setStep] = useState(0);
  const [stepOneData, setStepOneData] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const tenantSlug = localStorage.getItem('tenantSlug') || 'Mi organización';

  const logout = async () => {
    await apiLogout().catch(() => {});
    localStorage.removeItem('tenantSlug');
    navigate('/login');
  };

  const handleStepTwo = async (values) => {
    setSubmitError('');
    try {
      await submitForm({ ...stepOneData, ...values });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Registro enviado</h2>
          <p className="text-sm text-gray-500 mb-6">Los datos han sido guardados correctamente.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setStep(0); setStepOneData({}); setSuccess(false); setSubmitError(''); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Nuevo registro
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-lg text-xs flex items-center justify-center font-bold">
            {tenantSlug[0].toUpperCase()}
          </span>
          <span className="text-sm font-medium text-gray-700">{tenantSlug}</span>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Stepper */}
        <nav aria-label="Progreso del formulario" className="flex items-center mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  aria-current={i === step ? 'step' : undefined}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i < step
                      ? 'bg-green-500 text-white'
                      : i === step
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${
                  i === step ? 'font-medium text-gray-900' : i < step ? 'text-green-700' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-colors ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {step === 0 ? (
            <StepOne onNext={(data) => { setStepOneData(data); setStep(1); }} />
          ) : (
            <StepTwo onSubmit={handleStepTwo} onBack={() => setStep(0)} error={submitError} />
          )}
        </div>
      </main>
    </div>
  );
}
