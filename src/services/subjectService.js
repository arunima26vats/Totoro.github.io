import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, ensureFirebaseConfigured } from './firebase';

function userSubjectsCollection(userId) {
  return collection(db, 'users', userId, 'subjects');
}

function subjectDocument(userId, subjectId) {
  return doc(db, 'users', userId, 'subjects', subjectId);
}

function sessionsCollection(userId, subjectId) {
  return collection(db, 'users', userId, 'subjects', subjectId, 'sessions');
}

function sessionDocument(userId, subjectId, sessionId) {
  return doc(db, 'users', userId, 'subjects', subjectId, 'sessions', sessionId);
}

function mapSnapshot(documentSnapshot) {
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  };
}

export function subscribeToSubjects(userId, onUpdate, onError) {
  ensureFirebaseConfigured();
  const subjectsQuery = query(userSubjectsCollection(userId), orderBy('createdAt', 'desc'));

  return onSnapshot(
    subjectsQuery,
    (snapshot) => {
      onUpdate(snapshot.docs.map(mapSnapshot));
    },
    onError,
  );
}

export function subscribeToSubject(userId, subjectId, onUpdate, onError) {
  ensureFirebaseConfigured();

  return onSnapshot(
    subjectDocument(userId, subjectId),
    (snapshot) => {
      onUpdate(snapshot.exists() ? mapSnapshot(snapshot) : null);
    },
    onError,
  );
}

export function subscribeToSessions(userId, subjectId, onUpdate, onError) {
  ensureFirebaseConfigured();
  const sessionsQuery = query(sessionsCollection(userId, subjectId), orderBy('date', 'desc'));

  return onSnapshot(
    sessionsQuery,
    (snapshot) => {
      onUpdate(snapshot.docs.map(mapSnapshot));
    },
    onError,
  );
}

export async function createSubject(userId, subjectData) {
  ensureFirebaseConfigured();

  const payload = {
    title: subjectData.title.trim(),
    description: subjectData.description.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    sessionCount: 0,
    totalDuration: 0,
  };

  await addDoc(userSubjectsCollection(userId), payload);
}

export async function updateSubject(userId, subjectId, subjectData) {
  ensureFirebaseConfigured();

  await updateDoc(subjectDocument(userId, subjectId), {
    title: subjectData.title.trim(),
    description: subjectData.description.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSubject(userId, subjectId) {
  ensureFirebaseConfigured();

  const sessionsSnapshot = await getDocs(sessionsCollection(userId, subjectId));
  const batch = writeBatch(db);

  sessionsSnapshot.forEach((session) => {
    batch.delete(session.ref);
  });

  batch.delete(subjectDocument(userId, subjectId));
  await batch.commit();
}

export async function createSession(userId, subjectId, sessionData) {
  ensureFirebaseConfigured();

  const duration = Number(sessionData.duration);
  const batch = writeBatch(db);
  const newSessionRef = doc(sessionsCollection(userId, subjectId));

  batch.set(newSessionRef, {
    date: sessionData.date,
    duration,
    notes: sessionData.notes.trim(),
    createdAt: serverTimestamp(),
  });

  batch.update(subjectDocument(userId, subjectId), {
    sessionCount: increment(1),
    totalDuration: increment(duration),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

export async function deleteSession(userId, subjectId, sessionId) {
  ensureFirebaseConfigured();

  const sessionSnapshot = await getDoc(sessionDocument(userId, subjectId, sessionId));

  if (!sessionSnapshot.exists()) {
    throw new Error('Session not found.');
  }

  const batch = writeBatch(db);
  const duration = Number(sessionSnapshot.data().duration || 0);

  batch.delete(sessionSnapshot.ref);
  batch.update(subjectDocument(userId, subjectId), {
    sessionCount: increment(-1),
    totalDuration: increment(-duration),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

