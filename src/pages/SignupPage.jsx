import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import FirebaseNotice from '../components/FirebaseNotice';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup(formValues) {
    setSubmitting(true);
    clearError();

    try {
      await signup({
        fullName: formValues.fullName,
        email: formValues.email,
        password: formValues.password,
      });
      navigate('/dashboard');
    } catch (signupError) {
      return signupError;
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
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <AuthForm mode="signup" onSubmit={handleSignup} busy={submitting} error={error} />
          </div>

          <section className="space-y-6">
            <div className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              Your personal study operating system
            </div>
            <div>
              <h2 className="max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Turn scattered study notes into a system you can actually trust.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Set up subjects, keep a clean session history, review your study habits, and generate
                concise topic summaries whenever revision gets noisy.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-700">
                  Study overview
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  See subject totals, session counts, and time investment at a glance.
                </p>
              </div>
              <div className="glass-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral-500">
                  Smarter revision
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Use the AI summary tool to create a quick recap before tests and assignments.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
