export default function StatusBanner({ kind = 'error', message, onDismiss }) {
  if (!message) {
    return null;
  }

  const kindStyles = {
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-sky-200 bg-sky-50 text-sky-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${kindStyles[kind]}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        {onDismiss ? (
          <button type="button" onClick={onDismiss} className="text-sm font-semibold">
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}

