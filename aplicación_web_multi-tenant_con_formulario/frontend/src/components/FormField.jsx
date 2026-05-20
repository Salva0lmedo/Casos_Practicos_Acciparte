export function Field({ label, error, children }) {
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

export function inputCls(error) {
  return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-red-400 focus:ring-red-200 bg-red-50'
      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
  }`;
}
