import AppShell from '../components/AppShell';
import FirebaseNotice from '../components/FirebaseNotice';
import SubjectsPanel from '../components/SubjectsPanel';
import { useAuth } from '../hooks/useAuth';
import { useSubjects } from '../hooks/useSubjects';

export default function SubjectsPage() {
  const { user } = useAuth();
  const { subjects, loading, hasFetched, error, addSubject, editSubject, removeSubject, clearError } =
    useSubjects(user?.uid);

  return (
    <AppShell
      title="Subjects"
      subtitle="Manage all your subjects in one place, then open any subject to track sessions and study history."
    >
      <div className="page-stack">
        <FirebaseNotice />
        <SubjectsPanel
          subjects={subjects}
          loading={loading}
          hasFetched={hasFetched}
          error={error}
          addSubject={addSubject}
          editSubject={editSubject}
          removeSubject={removeSubject}
          clearError={clearError}
        />
      </div>
    </AppShell>
  );
}
