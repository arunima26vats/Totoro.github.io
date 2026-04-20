import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, ensureFirebaseConfigured } from './firebase';

export async function signupUser({ fullName, email, password }) {
  ensureFirebaseConfigured();

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (fullName?.trim()) {
    await updateProfile(credential.user, { displayName: fullName.trim() });
  }

  return credential.user;
}

export async function loginUser({ email, password }) {
  ensureFirebaseConfigured();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  ensureFirebaseConfigured();
  await signOut(auth);
}

export function observeAuthState(onChange, onError) {
  if (!auth) {
    onChange(null);
    return () => {};
  }

  return onAuthStateChanged(auth, onChange, onError);
}

