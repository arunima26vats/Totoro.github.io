export default function StatsCard({ label, value, helper, tone = 'default' }) {
  const toneMap = {
    default: 'from-white to-slate-50',
    accent: 'from-accent-50 to-teal-100',
    warm: 'from-orange-50 to-amber-100',
  };

  return (
    <article
      className={`rounded-3xl border border-white/70 bg-gradient-to-br ${toneMap[tone]} p-6 shadow-glow transition duration-200 hover:-translate-y-1 hover:shadow-2xl`}
    >
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <h3 className="mt-4 text-3xl font-bold text-slate-900">{value}</h3>
      {helper ? <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p> : null}
    </article>
  );
}
