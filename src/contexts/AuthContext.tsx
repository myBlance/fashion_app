import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'client' | null;

type AuthContextType = {
  role: Role;
  loginAs: (role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  const loginAs = (role: Role) => setRole(role);
  const logout = () => setRole(null);

  return (
    <AuthContext.Provider value={{ role, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
