export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  busy,
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-600">{description}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="btn-danger" disabled={busy}>
          {busy ? 'Working...' : confirmLabel}
        </button>
      </div>
    </div>
  );
}

