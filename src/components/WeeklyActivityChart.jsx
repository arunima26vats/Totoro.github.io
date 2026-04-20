import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatMinutes } from '../services/formatters';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0]?.value || 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{formatMinutes(value)}</p>
    </div>
  );
}

export default function WeeklyActivityChart({ activity = [] }) {
  return (
    <section className="section-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-700">
            Activity
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Weekly Study Activity</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Study duration across the last seven days, with missing days filled in automatically.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Aggregated from logged sessions
        </div>
      </div>

      <div className="mt-8 h-[320px] w-full rounded-[2rem] bg-slate-50/80 px-3 py-4 sm:px-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activity} margin={{ top: 12, right: 8, left: -18, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={56}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }} content={<CustomTooltip />} />
            <Bar dataKey="minutes" radius={[14, 14, 6, 6]} maxBarSize={56}>
              {activity.map((item) => (
                <Cell
                  key={item.key}
                  fill={item.minutes ? '#14b8a6' : '#cbd5e1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
