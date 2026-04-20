import { Link } from 'react-router-dom';
import { formatDisplayDate, formatMinutes } from '../services/formatters';

export default function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <article className="glass-card flex h-full flex-col p-6 transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-700">
            Subject
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{subject.title}</h3>
        </div>
      </div>

      <p className="mt-4 max-h-[4.5rem] overflow-hidden text-sm leading-6 text-slate-600">
        {subject.description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4 text-sm">
        <div>
          <p className="text-slate-500">Created</p>
          <p className="mt-1 font-semibold text-slate-900">
            {formatDisplayDate(subject.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Sessions</p>
          <p className="mt-1 font-semibold text-slate-900">{subject.sessionCount || 0}</p>
        </div>
        <div className="col-span-2">
          <p className="text-slate-500">Study time</p>
          <p className="mt-1 font-semibold text-slate-900">
            {formatMinutes(subject.totalDuration || 0)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-end gap-3 sm:flex-row">
        <Link to={`/subjects/${subject.id}`} className="btn-primary flex-1">
          Open subject
        </Link>
        <button type="button" onClick={() => onEdit(subject)} className="btn-secondary flex-1">
          Edit
        </button>
        <button type="button" onClick={() => onDelete(subject)} className="btn-danger flex-1">
          Delete
        </button>
      </div>
    </article>
  );
}
