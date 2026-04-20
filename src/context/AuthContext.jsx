import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginUser, logoutUser, observeAuthState, signupUser } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = observeAuthState(
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (authError) => {
        setError(authError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const signup = useCallback(async (credentials) => {
    setError('');

    try {
      const createdUser = await signupUser(credentials);
      setUser(createdUser);
      return createdUser;
    } catch (signupError) {
      setError(signupError.message);
      throw signupError;
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setError('');

    try {
      const signedInUser = await loginUser(credentials);
      setUser(signedInUser);
      return signedInUser;
    } catch (loginError) {
      setError(loginError.message);
      throw loginError;
    }
  }, []);

  const logout = useCallback(async () => {
    setError('');

    try {
      await logoutUser();
      setUser(null);
    } catch (logoutError) {
      setError(logoutError.message);
      throw logoutError;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      clearError,
    }),
    [clearError, error, loading, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
