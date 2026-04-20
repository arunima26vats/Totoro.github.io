import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import FirebaseNotice from '../components/FirebaseNotice';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import StatusBanner from '../components/StatusBanner';
import SummaryPreviewCard from '../components/SummaryPreviewCard';
import WeeklyActivityChart from '../components/WeeklyActivityChart';
import { useAuth } from '../hooks/useAuth';
import { useStudyStreak } from '../hooks/useStudyStreak';
import { useSubjects } from '../hooks/useSubjects';
import {
  calculateWeeklyActivity,
  formatMinutes,
  formatStudyStreakMessage,
} from '../services/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const { subjects, loading, hasFetched, error, clearError } = useSubjects(user?.uid);
  const {
    streak,
    sessions,
    loading: streakLoading,
    error: streakError,
  } = useStudyStreak(user?.uid, subjects, hasFetched);

  const stats = useMemo(() => {
    const totalSessions = subjects.reduce((sum, subject) => sum + (subject.sessionCount || 0), 0);
    const totalMinutes = subjects.reduce((sum, subject) => sum + (subject.totalDuration || 0), 0);
    const averageMinutes = subjects.length ? Math.round(totalMinutes / subjects.length) : 0;

    return {
      totalSubjects: subjects.length,
      totalSessions,
      totalMinutes,
      averageMinutes,
    };
  }, [subjects]);

  const weeklyActivity = useMemo(() => calculateWeeklyActivity(sessions), [sessions]);
  const showSubjectsLoading = loading && !hasFetched;
  const recentSubjects = subjects.slice(0, 3);

  return (
    <AppShell
      title="Dashboard"
      subtitle="See your overall study momentum, review recent subjects, and jump quickly into focused work."
      actions={
        <Link to="/subjects" className="btn-primary">
          Manage Subjects
        </Link>
      }
    >
      <div className="page-stack">
        <FirebaseNotice />
        <StatusBanner kind="error" message={error} onDismiss={clearError} />
        <StatusBanner kind="error" message={streakError} />

        <section className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Subjects"
            value={stats.totalSubjects}
            helper="Organized across your personal workspace"
            tone="default"
          />
          <StatsCard
            label="Study Sessions"
            value={stats.totalSessions}
            helper="All sessions logged in Firestore"
            tone="accent"
          />
          <StatsCard
            label="Total Time"
            value={formatMinutes(stats.totalMinutes)}
            helper="Your full tracked study duration"
            tone="warm"
          />
          <StatsCard
            label="Avg Per Subject"
            value={formatMinutes(stats.averageMinutes)}
            helper="Average time invested per subject"
            tone="default"
          />
        </section>

        <section className="mt-8">
          <div className="rounded-[2rem] border border-accent-100 bg-gradient-to-br from-accent-50 via-white to-orange-50 p-6 shadow-glow">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-700">
                  Study Streak
                </p>
                <h2 className="mt-3 text-4xl font-bold text-slate-900">
                  {streakLoading ? '...' : streak}
                </h2>
                <p className="mt-2 text-base font-medium text-slate-700">
                  {streakLoading
                    ? 'Calculating consecutive days...'
                    : formatStudyStreakMessage(streak)}
                </p>
              </div>
              <div className="rounded-3xl bg-white/80 px-5 py-4 text-sm leading-6 text-slate-600 shadow-sm">
                Consecutive days are counted from your real logged session dates without gaps.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <WeeklyActivityChart activity={weeklyActivity} />
        </section>

        <section className="mt-8">
          <div className="section-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-700">
                  Overview
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">Recent subjects</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Jump back into the areas you have been tracking most recently.
                </p>
              </div>
              <Link to="/subjects" className="btn-secondary">
                View all
              </Link>
            </div>

            <div className="mt-6">
              {showSubjectsLoading ? (
                <LoadingSpinner label="Loading subject overview..." />
              ) : recentSubjects.length ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {recentSubjects.map((subject) => (
                    <Link
                      key={subject.id}
                      to={`/subjects/${subject.id}`}
                      className="block rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{subject.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {subject.description}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm sm:grid-cols-3">
                          <div>
                            <p className="text-slate-500">Sessions</p>
                            <p className="mt-1 font-semibold text-slate-900">
                              {subject.sessionCount || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Study time</p>
                            <p className="mt-1 font-semibold text-slate-900">
                              {formatMinutes(subject.totalDuration || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No subjects yet"
                  description="Create your first subject in the Subjects page to start building your study system."
                  action={
                    <Link to="/subjects" className="btn-primary">
                      Go to Subjects
                    </Link>
                  }
                />
              )}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <SummaryPreviewCard />
        </section>
      </div>
    </AppShell>
  );
}
