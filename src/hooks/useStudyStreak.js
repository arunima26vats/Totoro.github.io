import { useEffect, useMemo, useState } from 'react';
import { subscribeToSessions } from '../services/subjectService';
import { calculateStudyStreak } from '../services/formatters';

export function useStudyStreak(userId, subjects, subjectsReady) {
  const [sessionsBySubject, setSessionsBySubject] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setSessionsBySubject({});
      setLoading(false);
      setError('');
      return undefined;
    }

    if (!subjectsReady) {
      setLoading(true);
      setError('');
      return undefined;
    }

    if (!subjects.length) {
      setSessionsBySubject({});
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setError('');
    setSessionsBySubject({});

    let pendingInitialSnapshots = subjects.length;
    const initialSnapshotSubjects = new Set();
    let unsubscribers = [];

    try {
      unsubscribers = subjects.map((subject) =>
        subscribeToSessions(
          userId,
          subject.id,
          (sessions) => {
            setSessionsBySubject((current) => ({
              ...current,
              [subject.id]: sessions,
            }));

            if (!initialSnapshotSubjects.has(subject.id)) {
              initialSnapshotSubjects.add(subject.id);
              pendingInitialSnapshots -= 1;

              if (pendingInitialSnapshots <= 0) {
                setLoading(false);
              }
            }
          },
          (snapshotError) => {
            setError(snapshotError.message);
            setLoading(false);
          },
        ),
      );
    } catch (subscriptionError) {
      setError(subscriptionError.message);
      setLoading(false);
      return undefined;
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [subjects, subjectsReady, userId]);

  const sessions = useMemo(
    () => Object.values(sessionsBySubject).flat(),
    [sessionsBySubject],
  );

  const streak = useMemo(() => calculateStudyStreak(sessions), [sessions]);

  return {
    streak,
    sessions,
    loading,
    error,
  };
}
