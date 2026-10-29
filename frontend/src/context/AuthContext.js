import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const completeAuthentication = useCallback(response => {
    const { token, user: authenticatedUser } = response.data;
    localStorage.setItem('token', token);
    setUser(authenticatedUser);
    return { success: true };
  }, []);

  const login = useCallback(async credentials => {
    try {
      return completeAuthentication(await authAPI.login(credentials));
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  }, [completeAuthentication]);

  const register = useCallback(async userData => {
    try {
      return completeAuthentication(await authAPI.register(userData));
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  }, [completeAuthentication]);

  const amazonLogin = useCallback(async data => {
    try {
      return completeAuthentication(await authAPI.amazonLogin(data));
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Amazon login failed' };
    }
  }, [completeAuthentication]);

  const alibabaLogin = useCallback(async data => {
    try {
      return completeAuthentication(await authAPI.alibabaLogin(data));
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Alibaba login failed' };
    }
  }, [completeAuthentication]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // The client must still clear its local, stateless token if the server is unavailable.
    }
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    amazonLogin,
    alibabaLogin,
    logout,
    refreshProfile: fetchUserProfile,
    isAuthenticated: Boolean(user),
    isAdmin: ['admin', 'owner'].includes(user?.role)
  }), [user, loading, login, register, amazonLogin, alibabaLogin, logout, fetchUserProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
