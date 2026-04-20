import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AuthForm({ mode, onSubmit, busy, error }) {
  const isSignup = mode === 'signup';
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formValues.email.trim() || !formValues.password.trim()) {
      setLocalError('Email and password are required.');
      return;
    }

    if (isSignup && !formValues.fullName.trim()) {
      setLocalError('Full name is required for signup.');
      return;
    }

    if (isSignup && formValues.password !== formValues.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLocalError('');
    await onSubmit(formValues);
  }

  return (
    <div className="glass-card w-full max-w-md p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-700">
          {isSignup ? 'Create account' : 'Welcome back'}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          {isSignup ? 'Start your study system' : 'Log in to your dashboard'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isSignup
            ? 'Build a focused study routine with organized subjects, session tracking, and AI summaries.'
            : 'Pick up where you left off and keep your learning streak moving.'}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {isSignup ? (
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              className="input-field"
              placeholder="Aarav Sharma"
              value={formValues.fullName}
              onChange={handleChange}
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input-field"
            placeholder="student@example.com"
            value={formValues.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="input-field"
            placeholder="Minimum 6 characters"
            value={formValues.password}
            onChange={handleChange}
          />
        </div>

        {isSignup ? (
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="input-field"
              placeholder="Re-enter your password"
              value={formValues.confirmPassword}
              onChange={handleChange}
            />
          </div>
        ) : null}

        {localError ? <p className="text-sm font-medium text-rose-600">{localError}</p> : null}
        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-accent-700">
          {isSignup ? 'Log in' : 'Create one'}
        </Link>
      </p>
    </div>
  );
}

