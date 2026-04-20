import { useCallback, useEffect, useState } from 'react';
import {
  createSubject,
  deleteSubject,
  subscribeToSubjects,
  updateSubject,
} from '../services/subjectService';

export function useSubjects(userId) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setSubjects([]);
      setLoading(false);
      setHasFetched(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setHasFetched(false);
    setError('');
    let unsubscribe = () => {};

    try {
      unsubscribe = subscribeToSubjects(
        userId,
        (items) => {
          setSubjects(items);
          setError('');
          setLoading(false);
          setHasFetched(true);
        },
        (snapshotError) => {
          setError(snapshotError.message);
          setLoading(false);
          setHasFetched(true);
        },
      );
    } catch (subscriptionError) {
      setError(subscriptionError.message);
      setLoading(false);
      setHasFetched(true);
    }

    return unsubscribe;
  }, [userId]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const addSubject = useCallback(
    async (subjectData) => {
      await createSubject(userId, subjectData);
    },
    [userId],
  );

  const editSubject = useCallback(
    async (subjectId, subjectData) => {
      await updateSubject(userId, subjectId, subjectData);
    },
    [userId],
  );

  const removeSubject = useCallback(
    async (subjectId) => {
      await deleteSubject(userId, subjectId);
    },
    [userId],
  );

  return {
    subjects,
    loading,
    hasFetched,
    error,
    addSubject,
    editSubject,
    removeSubject,
    clearError,
  };
}
