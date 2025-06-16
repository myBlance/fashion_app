import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'admin' | 'client' | null;

type AuthContextType = {
  role: Role;
  loginAs: (role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true); // ← Thêm loading flag

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role') as Role;
    if (storedRole) {
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const loginAs = (newRole: Role) => {
    sessionStorage.setItem('role', newRole || '');
    setRole(newRole);
  };

  const logout = () => {
    sessionStorage.removeItem('role');
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, loginAs, logout }}>
      {!loading && children} {/* Đợi load xong mới render children */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
