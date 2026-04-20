import { useCallback, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import StatusBanner from './StatusBanner';
import SubjectCard from './SubjectCard';
import SubjectForm from './SubjectForm';

export default function SubjectsPanel({
  subjects,
  loading,
  hasFetched,
  error,
  addSubject,
  editSubject,
  removeSubject,
  clearError,
}) {
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  const [subjectBusy, setSubjectBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const openCreateModal = useCallback(() => {
    setActiveSubject(null);
    setActionError('');
    setIsSubjectModalOpen(true);
  }, []);

  const openEditModal = useCallback((subject) => {
    setActiveSubject(subject);
    setActionError('');
    setIsSubjectModalOpen(true);
  }, []);

  const closeSubjectModal = useCallback(() => {
    setIsSubjectModalOpen(false);
    setActiveSubject(null);
    setActionError('');
  }, []);

  const handleSubjectSubmit = useCallback(
    async (formValues) => {
      setSubjectBusy(true);
      setActionError('');

      try {
        if (activeSubject) {
          await editSubject(activeSubject.id, formValues);
        } else {
          await addSubject(formValues);
        }
        closeSubjectModal();
      } catch (submitError) {
        setActionError(submitError.message);
      } finally {
        setSubjectBusy(false);
      }
    },
    [activeSubject, addSubject, closeSubjectModal, editSubject],
  );

  const handleDeleteSubject = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteBusy(true);
    setActionError('');

    try {
      await removeSubject(deleteTarget.id);
      setDeleteTarget(null);
    } catch (deleteError) {
      setActionError(deleteError.message);
    } finally {
      setDeleteBusy(false);
    }
  }, [deleteTarget, removeSubject]);

  const dismissErrors = useCallback(() => {
    clearError();
    setActionError('');
  }, [clearError]);

  const showSubjectsLoading = loading && !hasFetched;

  return (
    <>
      <div className="page-stack">
        <div className="section-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-700">
                Subject Library
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Your subjects</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create, edit, and review every study area from one place.
              </p>
            </div>
            <button type="button" onClick={openCreateModal} className="btn-primary">
              Add Subject
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <StatusBanner kind="error" message={error || actionError} onDismiss={dismissErrors} />

          {showSubjectsLoading ? (
            <div className="section-card">
              <LoadingSpinner label="Loading your subjects..." />
            </div>
          ) : subjects.length ? (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onEdit={openEditModal}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No subjects yet"
              description={`No subjects yet. Click 'Add Subject' to get started.`}
              action={
                <button type="button" onClick={openCreateModal} className="btn-primary">
                  Add Subject
                </button>
              }
            />
          )}
        </div>
      </div>

      {isSubjectModalOpen ? (
        <Modal
          title={activeSubject ? 'Edit subject' : 'Add a new subject'}
          description="Keep the description practical so you can quickly remember what belongs in this subject."
          onClose={closeSubjectModal}
        >
          <div className="space-y-4">
            <StatusBanner kind="error" message={actionError} onDismiss={() => setActionError('')} />
            <SubjectForm
              initialValues={
                activeSubject
                  ? {
                      title: activeSubject.title,
                      description: activeSubject.description,
                    }
                  : undefined
              }
              onSubmit={handleSubjectSubmit}
              onCancel={closeSubjectModal}
              submitLabel={activeSubject ? 'Update subject' : 'Create subject'}
              busy={subjectBusy}
            />
          </div>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Delete subject"
          description={`This will remove "${deleteTarget.title}" and all of its study sessions.`}
          onClose={() => setDeleteTarget(null)}
        >
          <ConfirmDialog
            title="Delete subject"
            description="This action cannot be undone. The subject document and its nested sessions will be deleted from Firestore."
            confirmLabel="Delete subject"
            onConfirm={handleDeleteSubject}
            onCancel={() => setDeleteTarget(null)}
            busy={deleteBusy}
          />
        </Modal>
      ) : null}
    </>
  );
}
