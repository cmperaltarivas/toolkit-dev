import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';



interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const devBypass = (import.meta as any).env?.PUBLIC_DEV_BYPASS_AUTH === 'true';
    if (devBypass) {
      localStorage.setItem('toolkit_jwt', 'dev-bypass');
      setUser({ id: 'dev-user', name: 'Dev Local', email: 'dev@localhost', avatar: '' });
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('toolkit_jwt');
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch('/api/auth/me', { headers: { 'authorization': `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setUser(data.user); }
      else { localStorage.removeItem('toolkit_jwt'); }
    } catch { localStorage.removeItem('toolkit_jwt'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (idToken: string) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });
    if (!res.ok) throw new Error('Error al autenticar');
    const data = await res.json();
    localStorage.setItem('toolkit_jwt', data.jwt);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('toolkit_jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx && typeof window === 'undefined') return { user: null, loading: true, login: async () => {}, logout: () => {} } as AuthContextType;
  return ctx;
}
