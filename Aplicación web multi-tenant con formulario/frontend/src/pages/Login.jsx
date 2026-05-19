import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

const schema = z.object({
  tenantSlug: z.string().min(1, 'Introduce tu organización'),
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export default function Login() {
  const [mode, setMode] = useState('login');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const { register: reg, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const tenantSlug = watch('tenantSlug');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const fn = mode === 'login' ? login : register;
      await fn(data.email, data.password, data.tenantSlug);
      localStorage.setItem('tenantSlug', data.tenantSlug);
      navigate('/form');
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {tenantSlug && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-bold">
              {tenantSlug[0].toUpperCase()}
            </span>
            <span className="font-medium">{tenantSlug}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? 'Accede a tu organización' : 'Crea tu cuenta en la organización'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Field label="Organización" error={errors.tenantSlug?.message}>
              <input
                {...reg('tenantSlug')}
                placeholder="mi-empresa"
                autoComplete="organization"
                className={inputCls(errors.tenantSlug)}
              />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input
                {...reg('email')}
                type="email"
                placeholder="usuario@empresa.com"
                autoComplete="email"
                className={inputCls(errors.email)}
              />
            </Field>
            <Field label="Contraseña" error={errors.password?.message}>
              <input
                {...reg('password')}
                type="password"
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={inputCls(errors.password)}
              />
            </Field>

            {serverError && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {isSubmitting ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          </form>
        </div>

        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setServerError(''); }}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
        >
          {mode === 'login' ? '¿Sin cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function inputCls(error) {
  return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-red-400 focus:ring-red-200 bg-red-50'
      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
  }`;
}
