import { useEffect, useState } from 'react';

function getTodayValue() {
  return new Date().toISOString().split('T')[0];
}

const baseState = {
  date: getTodayValue(),
  duration: 60,
  notes: '',
};

export default function SessionForm({ onSubmit, onCancel, busy }) {
  const [formValues, setFormValues] = useState(baseState);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormValues(baseState);
    setError('');
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: name === 'duration' ? value : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const duration = Number(formValues.duration);

    if (!formValues.date) {
      setError('Study date is required.');
      return;
    }

    if (!duration || duration <= 0) {
      setError('Duration must be greater than zero.');
      return;
    }

    if (!formValues.notes.trim()) {
      setError('Add a short note to describe what you studied.');
      return;
    }

    setError('');
    await onSubmit({
      ...formValues,
      duration,
    });
    setFormValues(baseState);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-semibold text-slate-700">
            Session date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="input-field"
            value={formValues.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="duration" className="mb-2 block text-sm font-semibold text-slate-700">
            Duration in minutes
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            className="input-field"
            value={formValues.duration}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-slate-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="textarea-field"
          placeholder="Summarize what you covered, what felt hard, or what to revise next."
          value={formValues.notes}
          onChange={handleChange}
        />
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Saving...' : 'Save session'}
        </button>
      </div>
    </form>
  );
}

