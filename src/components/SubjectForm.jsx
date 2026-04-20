import { useEffect, useState } from 'react';

const initialState = {
  title: '',
  description: '',
};

export default function SubjectForm({
  initialValues = initialState,
  onSubmit,
  onCancel,
  submitLabel,
  busy,
}) {
  const [formValues, setFormValues] = useState(initialValues);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormValues(initialValues);
    setError('');
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formValues.title.trim()) {
      setError('Subject title is required.');
      return;
    }

    if (!formValues.description.trim()) {
      setError('Add a short description so your subjects stay organized.');
      return;
    }

    setError('');
    await onSubmit(formValues);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
          Subject title
        </label>
        <input
          id="title"
          name="title"
          className="input-field"
          placeholder="Example: Data Structures"
          value={formValues.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="textarea-field"
          placeholder="What do you want to focus on in this subject?"
          value={formValues.description}
          onChange={handleChange}
        />
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

