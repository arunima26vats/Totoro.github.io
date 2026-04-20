export default function EmptyState({ title, description, action }) {
  return (
    <div className="section-card border border-dashed border-slate-200 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        <span aria-hidden="true">+</span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
    </div>
  );
}
