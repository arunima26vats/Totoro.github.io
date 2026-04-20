import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import FirebaseNotice from '../components/FirebaseNotice';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import SessionForm from '../components/SessionForm';
import SessionHistory from '../components/SessionHistory';
import StatsCard from '../components/StatsCard';
import StatusBanner from '../components/StatusBanner';
import SubjectForm from '../components/SubjectForm';
import { useAuth } from '../hooks/useAuth';
import { useSubjectDetails } from '../hooks/useSubjectDetails';
import { formatDisplayDate, formatMinutes } from '../services/formatters';

export default function SubjectPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { subject, sessions, loading, error, addSession, removeSession, editSubject, clearError } =
    useSubjectDetails(user?.uid, id);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sessionBusy, setSessionBusy] = useState(false);
  const [sessionDeleteId, setSessionDeleteId] = useState('');
  const [actionError, setActionError] = useState('');

  const metrics = useMemo(() => {
    const totalDuration = subject?.totalDuration || 0;
    const totalSessions = subject?.sessionCount || 0;
    const averagePerSession = totalSessions ? Math.round(totalDuration / totalSessions) : 0;

    return {
      totalDuration,
      totalSessions,
      averagePerSession,
    };
  }, [subject]);

  const dismissErrors = useCallback(() => {
    clearError();
    setActionError('');
  }, [clearError]);

  const handleSessionSubmit = useCallback(
    async (formValues) => {
      setSessionBusy(true);
      setActionError('');

      try {
        await addSession(formValues);
        setIsSessionModalOpen(false);
      } catch (submitError) {
        setActionError(submitError.message);
      } finally {
        setSessionBusy(false);
      }
    },
    [addSession],
  );

  const handleSessionDelete = useCallback(
    async (sessionId) => {
      setSessionDeleteId(sessionId);
      setActionError('');

      try {
        await removeSession(sessionId);
      } catch (deleteError) {
        setActionError(deleteError.message);
      } finally {
        setSessionDeleteId('');
      }
    },
    [removeSession],
  );

  const handleSubjectUpdate = useCallback(
    async (formValues) => {
      setSessionBusy(true);
      setActionError('');

      try {
        await editSubject(formValues);
        setIsEditModalOpen(false);
      } catch (updateError) {
        setActionError(updateError.message);
      } finally {
        setSessionBusy(false);
      }
    },
    [editSubject],
  );

  return (
    <AppShell
      title={subject?.title || 'Subject details'}
      subtitle={
        subject?.description ||
        'Review subject details, add study sessions, and keep a clear revision history.'
      }
      actions={
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="btn-secondary"
            disabled={!subject}
          >
            Edit subject
          </button>
          <button
            type="button"
            onClick={() => setIsSessionModalOpen(true)}
            className="btn-primary"
            disabled={!subject}
          >
            Add session
          </button>
        </div>
      }
    >
      <div className="page-stack">
        <FirebaseNotice />
        <StatusBanner kind="error" message={error || actionError} onDismiss={dismissErrors} />

        <div>
          <Link
            to="/subjects"
            className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-accent-700 shadow-sm transition hover:bg-white"
          >
            Back to subjects
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading subject details..." />
        ) : !subject ? (
          <EmptyState
            title="Subject not found"
            description="This subject may have been removed or is no longer available for your account."
            action={
              <Link to="/dashboard" className="btn-primary">
                Return to dashboard
              </Link>
            }
          />
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                label="Created"
                value={formatDisplayDate(subject.createdAt)}
                helper="When this subject was first added"
                tone="default"
              />
              <StatsCard
                label="Sessions"
                value={metrics.totalSessions}
                helper="Study logs recorded for this subject"
                tone="accent"
              />
              <StatsCard
                label="Total Time"
                value={formatMinutes(metrics.totalDuration)}
                helper="Combined duration across all sessions"
                tone="warm"
              />
              <StatsCard
                label="Average Session"
                value={formatMinutes(metrics.averagePerSession)}
                helper="Average time spent per logged study session"
                tone="default"
              />
            </section>

            <section className="section-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Session history</h2>
                  <p className="text-sm text-slate-600">
                    Review what you studied, when you studied it, and remove logs if needed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(true)}
                  className="btn-primary"
                >
                  Add session
                </button>
              </div>

              <div className="mt-6">
                {sessions.length ? (
                  <SessionHistory
                    sessions={sessions}
                    onDelete={handleSessionDelete}
                    busyId={sessionDeleteId}
                  />
                ) : (
                  <EmptyState
                    title="No sessions yet"
                    description="Start logging study sessions to build a reliable revision history for this subject."
                    action={
                      <button
                        type="button"
                        onClick={() => setIsSessionModalOpen(true)}
                        className="btn-primary"
                      >
                        Log first session
                      </button>
                    }
                  />
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {isSessionModalOpen ? (
        <Modal
          title="Add study session"
          description="Track the date, duration, and the most useful note from this session."
          onClose={() => setIsSessionModalOpen(false)}
        >
          <div className="space-y-4">
            <StatusBanner kind="error" message={actionError} onDismiss={() => setActionError('')} />
            <SessionForm
              onSubmit={handleSessionSubmit}
              onCancel={() => setIsSessionModalOpen(false)}
              busy={sessionBusy}
            />
          </div>
        </Modal>
      ) : null}

      {isEditModalOpen && subject ? (
        <Modal
          title="Edit subject"
          description="Update the title or description whenever your study plan changes."
          onClose={() => setIsEditModalOpen(false)}
        >
          <div className="space-y-4">
            <StatusBanner kind="error" message={actionError} onDismiss={() => setActionError('')} />
            <SubjectForm
              initialValues={{
                title: subject.title,
                description: subject.description,
              }}
              onSubmit={handleSubjectUpdate}
              onCancel={() => setIsEditModalOpen(false)}
              submitLabel="Save changes"
              busy={sessionBusy}
            />
          </div>
        </Modal>
      ) : null}
    </AppShell>
  );
}
