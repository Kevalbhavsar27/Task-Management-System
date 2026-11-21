import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../services/api';
import type { User } from '../types';

interface AuthContextValue { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (username: string, email: string, password: string) => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => { const raw = localStorage.getItem('taskflow_user'); return raw ? JSON.parse(raw) as User : null; });
  const [loading, setLoading] = useState(true);
  const saveSession = (data: { token: string; user: User }) => { localStorage.setItem('taskflow_token', data.token); localStorage.setItem('taskflow_user', JSON.stringify(data.user)); setUser(data.user); };
  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => { setUser(data.user); localStorage.setItem('taskflow_user', JSON.stringify(data.user)); }).catch(() => { localStorage.removeItem('taskflow_token'); localStorage.removeItem('taskflow_user'); setUser(null); }).finally(() => setLoading(false));
  }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    login: async (email, password) => { const { data } = await api.post('/auth/login', { email, password }); saveSession(data); },
    register: async (username, email, password) => { const { data } = await api.post('/auth/register', { username, email, password }); saveSession(data); },
    logout: () => { localStorage.removeItem('taskflow_token'); localStorage.removeItem('taskflow_user'); setUser(null); }
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; }
