import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clearCart, syncCartAfterLogin } from '../store/cartSlice';
import { useAppDispatch } from './../store/hooks';

type Role = 'admin' | 'client' | null;

type AuthContextType = {
  role: Role;
  loginAs: (role: Role, userId?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch(); 

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role') as Role | null;
    if (storedRole) setRole(storedRole);
    setLoading(false);
  }, []);

  const loginAs = (newRole: Role, userId?: string) => {
    if (newRole) sessionStorage.setItem('role', newRole);
    else sessionStorage.removeItem('role');

    setRole(newRole);

    if (userId) {
      dispatch(syncCartAfterLogin(userId));
    }
  };

  const logout = () => {
    sessionStorage.removeItem('role');
    setRole(null);

    dispatch(clearCart());

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ role, loginAs, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
