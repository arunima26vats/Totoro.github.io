import { formatDisplayDate, formatMinutes } from '../services/formatters';

export default function SessionHistory({ sessions, onDelete, busyId }) {
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <article
          key={session.id}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                  {formatDisplayDate(session.date)}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {formatMinutes(session.duration)}
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600">{session.notes}</p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(session.id)}
              className="btn-danger"
              disabled={busyId === session.id}
            >
              {busyId === session.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
