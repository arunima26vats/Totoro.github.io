import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createSession,
  deleteSession,
  subscribeToSessions,
  subscribeToSubject,
  updateSubject,
} from '../services/subjectService';

export function useSubjectDetails(userId, subjectId) {
  const [subject, setSubject] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId || !subjectId) {
      setSubject(null);
      setSessions([]);
      setSubjectLoading(false);
      setSessionsLoading(false);
      return undefined;
    }

    setSubjectLoading(true);
    setSessionsLoading(true);
    let unsubscribeSubject = () => {};
    let unsubscribeSessions = () => {};

    try {
      unsubscribeSubject = subscribeToSubject(
        userId,
        subjectId,
        (item) => {
          setSubject(item);
          setError('');
          setSubjectLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message);
          setSubjectLoading(false);
        },
      );

      unsubscribeSessions = subscribeToSessions(
        userId,
        subjectId,
        (items) => {
          setSessions(items);
          setError('');
          setSessionsLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message);
          setSessionsLoading(false);
        },
      );
    } catch (subscriptionError) {
      setError(subscriptionError.message);
      setSubjectLoading(false);
      setSessionsLoading(false);
    }

    return () => {
      unsubscribeSubject();
      unsubscribeSessions();
    };
  }, [subjectId, userId]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const addSession = useCallback(
    async (sessionData) => {
      await createSession(userId, subjectId, sessionData);
    },
    [subjectId, userId],
  );

  const removeSession = useCallback(
    async (sessionId) => {
      await deleteSession(userId, subjectId, sessionId);
    },
    [subjectId, userId],
  );

  const editSubject = useCallback(
    async (subjectData) => {
      await updateSubject(userId, subjectId, subjectData);
    },
    [subjectId, userId],
  );

  const loading = useMemo(
    () => subjectLoading || sessionsLoading,
    [sessionsLoading, subjectLoading],
  );

  return {
    subject,
    sessions,
    loading,
    error,
    addSession,
    removeSession,
    editSubject,
    clearError,
  };
}

