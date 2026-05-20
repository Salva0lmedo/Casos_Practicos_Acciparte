import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field, inputCls } from './FormField';

const schema = z.object({
  nombre:    z.string().min(2, 'Mínimo 2 caracteres'),
  apellidos: z.string().min(2, 'Mínimo 2 caracteres'),
  lugar:     z.string().min(3, 'Indica el lugar del incidente'),
});

export default function StepOne({ onNext }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Datos del incidente</h2>
      <p className="text-sm text-gray-500 mb-6">Introduce los datos de la persona afectada.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Nombre" error={errors.nombre?.message}>
          <input
            {...register('nombre')}
            placeholder="Ej. Juan"
            autoComplete="given-name"
            className={inputCls(errors.nombre)}
          />
        </Field>
        <Field label="Apellidos" error={errors.apellidos?.message}>
          <input
            {...register('apellidos')}
            placeholder="Ej. García López"
            autoComplete="family-name"
            className={inputCls(errors.apellidos)}
          />
        </Field>
      </div>

      <div className="mb-6">
        <Field label="Lugar del incidente" error={errors.lugar?.message}>
          <input
            {...register('lugar')}
            placeholder="Ej. Calle Mayor 12, Madrid"
            className={inputCls(errors.lugar)}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
}

