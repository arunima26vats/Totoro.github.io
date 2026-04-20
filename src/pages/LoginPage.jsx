import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import FirebaseNotice from '../components/FirebaseNotice';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(formValues) {
    setSubmitting(true);
    clearError();

    try {
      await login({
        email: formValues.email,
        password: formValues.password,
      });
      navigate('/dashboard');
    } catch (loginError) {
      return loginError;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <FirebaseNotice />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-6">
            <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              Focus. Track. Improve.
            </div>
            <div>
              <h2 className="max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Build a study workflow that stays organized under real deadlines.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Manage subjects, log sessions, monitor study time, and get quick AI-style topic
                summaries in one responsive dashboard.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card p-5">
                <p className="text-2xl font-bold text-slate-900">Subjects</p>
                <p className="mt-2 text-sm text-slate-600">Keep each course neatly structured.</p>
              </div>
              <div className="glass-card p-5">
                <p className="text-2xl font-bold text-slate-900">Sessions</p>
                <p className="mt-2 text-sm text-slate-600">Track consistency and revision effort.</p>
              </div>
              <div className="glass-card p-5">
                <p className="text-2xl font-bold text-slate-900">Summaries</p>
                <p className="mt-2 text-sm text-slate-600">Generate compact topic recaps fast.</p>
              </div>
            </div>
          </section>

          <div className="flex justify-center lg:justify-end">
            <AuthForm mode="login" onSubmit={handleLogin} busy={submitting} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}
